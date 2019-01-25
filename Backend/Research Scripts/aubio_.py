#! /usr/bin/env python

# Simple demo to extract notes from a sound file, and store them in a midi file
# using mido.
#
# Install mido: `pip instal mido`
#
# Documentation: https://mido.readthedocs.io/

import sys
from aubio import source, notes, tempo
from mido import Message, MetaMessage, MidiFile, MidiTrack, second2tick, bpm2tempo
from numpy import median, diff

min_pitch = 36
max_pitch = 71

def between(val, min_val, max_val):
    return (val >= min_val and val <= max_val)

def get_file_bpm(filename, params=None):
    """ Calculate the beats per minute (bpm) of a given file.
        path: path to the file
        param: dictionary of parameters

        TODO: figure out second arguement
    """
    if params is None:
        params = {}
    # default:
    samplerate, win_s, hop_s = 44100, 1024, 512
    if 'mode' in params:
        if params.mode in ['super-fast']:
            # super fast
            samplerate, win_s, hop_s = 4000, 128, 64
        elif params.mode in ['fast']:
            # fast
            samplerate, win_s, hop_s = 8000, 512, 128
        elif params.mode in ['default']:
            pass
        else:
            raise ValueError("unknown mode {:s}".format(params.mode))
    # manual settings
    if 'samplerate' in params:
        samplerate = params.samplerate
    if 'win_s' in params:
        win_s = params.win_s
    if 'hop_s' in params:
        hop_s = params.hop_s

    s = source(filename, samplerate, hop_s)
    samplerate = s.samplerate
    o = tempo("specdiff", win_s, hop_s, samplerate)
    # List of beats, in samples
    beats = []
    # Total number of frames read
    total_frames = 0

    while True:
        samples, read = s()
        is_beat = o(samples)
        if is_beat:
            this_beat = o.get_last_s()
            beats.append(this_beat)
            #if o.get_confidence() > .2 and len(beats) > 2.:
            #    break
        total_frames += read
        if read < hop_s:
            break

    def beats_to_bpm(beats, path):
        # if enough beats are found, convert to periods then to bpm
        if len(beats) > 1:
            if len(beats) < 4:
                print("few beats found in {:s}".format(filename))
            bpms = 60./diff(beats)
            return median(bpms)
        else:
            print("not enough beats found in {:s}".format(filename))
            return 0

    return beats_to_bpm(beats, filename)

def create_midi(filename, midioutput):
    downsample = 1
    samplerate = 44100 // downsample
    if len( sys.argv ) > 3: samplerate = int(sys.argv[3])

    win_s = 512 // downsample # fft size
    hop_s = 256 // downsample # hop size

    s = source(filename, samplerate, hop_s)
    samplerate = s.samplerate

    tolerance = 0.8

    notes_o = notes("default", win_s, hop_s, samplerate)

    print("%8s" % "time","[ start","vel","last ]")

    # create a midi file
    mid = MidiFile()
    track = MidiTrack()
    mid.tracks.append(track)

    ticks_per_beat = mid.ticks_per_beat # default: 480
    bpm = get_file_bpm(filename) # 120 default midi tempo
    print('beats per minute: ', bpm)

    tempo = bpm2tempo(bpm)
    track.append(MetaMessage('set_tempo', tempo=tempo))
    track.append(MetaMessage('time_signature', numerator=4, denominator=4))

    def frames2tick(frames, samplerate=samplerate):
        sec = frames / float(samplerate)
        return int(second2tick(sec, ticks_per_beat, tempo))

    last_time = 0
    # total number of frames read
    total_frames = 0

    while True:
        samples, read = s()
        new_note = notes_o(samples)
        if (new_note[0] != 0):
            note_str = ' '.join(["%.2f" % i for i in new_note])
            print("%.6f" % (total_frames/float(samplerate)), new_note)
            delta = frames2tick(total_frames) - last_time

            if between(new_note[0], min_pitch, max_pitch) or True:
                if new_note[2] > 0:
                    track.append(Message('note_off', note=int(new_note[2]), velocity=127, time=0))
                track.append(Message('note_on',note=int(new_note[0]),velocity=int(new_note[1]),time=delta))
                last_time = frames2tick(total_frames)
        total_frames += read
        if read < hop_s: break

    mid.save(midioutput)

def transcribe():
    if len(sys.argv) < 3:
        print("Usage: %s <filename> <output> [samplerate]" % sys.argv[0])
        sys.exit(1)

    filename = sys.argv[1]
    midioutput = sys.argv[2]
    create_midi(filename, midioutput)

if __name__ == '__main__':
  transcribe()
