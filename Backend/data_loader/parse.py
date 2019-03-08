from music21 import converter, instrument, note, chord, stream, interval, pitch
import sys
import os
import pickle
from tqdm import tqdm

dir_ = sys.argv[1]
pickle_file = sys.argv[2]

all_files = []
all_melody = []
all_chords = []
sixteenth = 0.25 # 16th note: 1 = quarter note, 0.5 = 8th note
CHORD_NAME = True # use chord name instead of chord notes

for file in tqdm(os.listdir(dir_)):
    try:
        midi = converter.parseFile(dir_ + '/' + file)
    except:
        print('Could not parse ' + file)
        continue

    offset = 0
    stop = midi.highestTime
    song_melody = []
    song_chords = []

    while offset < stop:
        cur_melody = []
        cur_chords = []
        all_notes = midi.recurse().getElementsByOffsetInHierarchy(
                                    offset,
                                    offsetEnd=offset+sixteenth,
                                    mustBeginInSpan=False,
                                    includeElementsThatEndAtStart=False).notes

        # gather notes and cur_chords played at offset
        for element in all_notes:
            if isinstance(element, note.Note):
                cur_melody.append(str(element.pitch.name))
            elif isinstance(element, chord.Chord):
                if CHORD_NAME:
                    cur_chords.append(element.pitchedCommonName)
                else:
                    cur_chords.append('.'.join(sorted([str(p.name) for p in element.pitches])))

        # nothing playing at offset
        if len(cur_melody) == 0 and len(cur_chords) == 0:
            song_melody.append('')
            song_chords.append('')

        # cur_melody played but not chord at offset
        elif len(cur_chords) == 0:
            for n in cur_melody:
                song_melody.append(n)
                song_chords.append('')

        # cur_chords played but not cur_melody at offset
        elif len(cur_melody) == 0:
            for c in cur_chords:
                song_melody.append('')
                song_chords.append(c)

        # both played at offset
        else:
            for n in cur_melody:
                for c in cur_chords:
                    song_melody.append(n)
                    song_chords.append(c)

        offset += sixteenth

    all_files.append(file)
    all_melody.append(song_melody)
    all_chords.append(song_chords)

# put into dictionary and send to pickle file
harmony = {}
harmony['file'] = all_files
harmony['melody'] = all_melody
harmony['chords'] = all_chords

with open(pickle_file, 'wb') as filepath:
    pickle.dump(harmony, filepath)

print('MIDI Processing Completed.')
