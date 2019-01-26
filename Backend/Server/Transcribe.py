# Copyright 2018 The Magenta Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Transcribe a recording of piano audio."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import collections
import os

import librosa
from magenta.common import tf_utils
from magenta.models.onsets_frames_transcription import constants
from magenta.models.onsets_frames_transcription import data
from magenta.models.onsets_frames_transcription import model
from magenta.music import audio_io
from magenta.music import midi_io
from magenta.music import sequences_lib
from magenta.protobuf import music_pb2
import tensorflow as tf

class Transcriber:
    max_pitch = 75
    min_pitch = 30
    acoustic_run_dir = '.'
    hparams = 'onset_mode=length_ms,onset_length=32'
    frame_threshold = 0.5
    onset_threshold = 0.5
    log = 'INFO'

    TranscriptionSession = collections.namedtuple(
        'TranscriptionSession',
        ('session', 'examples', 'iterator', 'onset_probs_flat', 'frame_probs_flat',
         'velocity_values_flat', 'hparams'))

    def __init__(self):
        self.transcription_session = None    # instance variable unique to each instance


    def create_example(self, filename, hparams):
      """Processes an audio file into an Example proto."""
      wav_data = librosa.core.load(filename, sr=hparams.sample_rate)[0]
      if hparams.normalize_audio:
        audio_io.normalize_wav_data(wav_data, hparams.sample_rate)
      wav_data = audio_io.samples_to_wav_data(wav_data, hparams.sample_rate)

      example = tf.train.Example(features=tf.train.Features(feature={
          'id':
              tf.train.Feature(bytes_list=tf.train.BytesList(
                  value=[filename.encode('utf-8')]
              )),
          'sequence':
              tf.train.Feature(bytes_list=tf.train.BytesList(
                  value=[music_pb2.NoteSequence().SerializeToString()]
              )),
          'audio':
              tf.train.Feature(bytes_list=tf.train.BytesList(
                  value=[wav_data]
              )),
          'velocity_range':
              tf.train.Feature(bytes_list=tf.train.BytesList(
                  value=[music_pb2.VelocityRange().SerializeToString()]
              )),
      }))

      return example.SerializeToString()

    def initialize_session(self, acoustic_checkpoint, hparams):
      """Initializes a transcription session."""
      with tf.Graph().as_default():
        examples = tf.placeholder(tf.string, [None])

        batch, iterator = data.provide_batch(
            batch_size=1,
            examples=examples,
            hparams=hparams,
            is_training=False,
            truncated_length=0)

        model.get_model(batch, hparams, is_training=False)

        session = tf.Session()
        saver = tf.train.Saver()
        saver.restore(session, acoustic_checkpoint)

        onset_probs_flat = tf.get_default_graph().get_tensor_by_name(
            'onsets/onset_probs_flat:0')
        frame_probs_flat = tf.get_default_graph().get_tensor_by_name(
            'frame_probs_flat:0')
        velocity_values_flat = tf.get_default_graph().get_tensor_by_name(
            'velocity/velocity_values_flat:0')

        return self.TranscriptionSession(
            session=session,
            examples=examples,
            iterator=iterator,
            onset_probs_flat=onset_probs_flat,
            frame_probs_flat=frame_probs_flat,
            velocity_values_flat=velocity_values_flat,
            hparams=hparams)

    def clean_notes(self, sequence_prediction):
        def contained_in(note_one, note_two):
            return note_one.start_time >= note_two.start_time and note_one.end_time < note_two.end_time
        def starts_before_end(note_one, note_two):
            return note_one.start_time > note_two.start_time and note_one.start_time < note_two.end_time


        toRemove = []
        for note_one in sequence_prediction.notes:
            # try to ignore non human voice elements
            if note_one.pitch > self.max_pitch or note_one.pitch < self.min_pitch:
                toRemove.append(note_one)
                continue

            # if given two notes and one is contained in the other note or they both
            # start at the same time, the note with the lower velocity is removed
            for note_two in sequence_prediction.notes:
                if note_one != note_two:
                    if (contained_in(note_one, note_two) or note_one.start_time == note_two.start_time) \
                        and note_one.velocity < note_two.velocity:
                        toRemove.append(note_one)
                        break

        for note in toRemove:
            sequence_prediction.notes.remove(note)

        for note_one in sequence_prediction.notes:
            for note_two in sequence_prediction.notes:
                if note_one != note_two:
                    # note one starts before note two ends
                    if starts_before_end(note_one, note_two):
                        note_two.end_time = note_one.start_time

    def transcribe_audio(self, transcription_session, filename, frame_threshold,
                         onset_threshold):
      """Transcribes an audio file."""
      tf.logging.info('Processing file...')
      transcription_session.session.run(
          transcription_session.iterator.initializer,
          {transcription_session.examples: [
              self.create_example(filename, transcription_session.hparams)]})
      tf.logging.info('Running inference...')
      frame_logits, onset_logits, velocity_values = (
          transcription_session.session.run([
              transcription_session.frame_probs_flat,
              transcription_session.onset_probs_flat,
              transcription_session.velocity_values_flat]))

      frame_predictions = frame_logits > frame_threshold

      onset_predictions = onset_logits > onset_threshold

      sequence_prediction = sequences_lib.pianoroll_to_note_sequence(
          frame_predictions,
          frames_per_second=data.hparams_frames_per_second(
              transcription_session.hparams),
          min_duration_ms=0,
          onset_predictions=onset_predictions,
          velocity_values=velocity_values)

      for note in sequence_prediction.notes:
        note.pitch += constants.MIN_MIDI_PITCH

      self.clean_notes(sequence_prediction)

      return sequence_prediction

    def init(self):
        print(self.max_pitch)
        tf.logging.set_verbosity(self.log)

        acoustic_checkpoint = tf.train.latest_checkpoint(
            os.path.join(os.path.expanduser(self.acoustic_run_dir), 'train'))

        default_hparams = tf_utils.merge_hparams(
            constants.DEFAULT_HPARAMS, model.get_default_hparams())
        default_hparams.parse(self.hparams)

        self.transcription_session = self.initialize_session(acoustic_checkpoint, default_hparams)


    def run(self, filename):
      tf.logging.info('Starting transcription for %s...', filename)

      sequence_prediction = self.transcribe_audio(
          self.transcription_session, filename, self.frame_threshold,
          self.onset_threshold)

      midi_filename = filename + '.midi'
      midi_io.sequence_proto_to_midi_file(sequence_prediction, midi_filename)

      tf.logging.info('Transcription written to %s.', midi_filename)
