import os
import numpy as np
import pandas as pd
import pickle
import torch
from torch.utils.data import Dataset
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence


class MidiDataset(Dataset):
    """MIDI Music Dataset"""
    # NOTES = ['C', 'C#', 'D-', 'D', 'D#', 'E-', 'E', 'E#', 'F-', 'F', 'F#',
    #             'G-', 'G', 'G#', 'A-', 'A', 'A#', 'B-', 'B', 'B#', 'C-']
    # NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    # NOTE_TO_INT = {k:v for v, k in enumerate(NOTES)}
    NOTES_TO_INT = {
        'PAD':0, # padding
        '':1, # empty note
        'B#':2, 'C':2,
        'C#':3, 'D-':3,
        'D':4,
        'D#':5, 'E-':5,
        'E':6,  'F-':6,
        'E#':7, 'F':7,
        'F#':8, 'G-':8,
        'G':9,
        'G#':10,'A-':10,
        'A':11,
        'A#':12,'B-':12,
        'B':13, 'C-':13,
    }
    NUM_NOTES = max(NOTES_TO_INT.values()) + 1
    INT_TO_NOTES = {v:k for k,v in NOTES_TO_INT.items()}

    # Use sequence of notes insteads of entire song (false runs sequence over entire song)
    USE_SEQUENCE = True
    SEQUENCE_LENGTH = 16

    def __init__(self, data_path, transform=None, target_transform=None):
        """
        Args:
            data_path (string): Path to pickle file containing the dictionary of data
            transform (callable, optional): Optional transform to be applied
                on a sample.
        """

        assert os.path.exists(data_path), "{} does not exist".format(data_path)
        if not data_path.endswith('.pkl'):
            raise IOError('{} is not a recoginizable file type (.pkl)'.format(data_path))

        # load data
        with open(data_path, 'rb') as f:
            data_dict = pickle.load(f)

        self.df = pd.DataFrame.from_dict(data_dict)
        self.transform = transform
        self.target_transform = target_transform

    @classmethod
    def convert_note_to_int(cls, note):
        return cls.NOTES_TO_INT[note]

    @classmethod
    def convert_chord_to_int(cls, chord):
        """
        converts chord into list of ints
        Parameters
        ----------
        chord : str
            notes in chord
        Returns
        -------
        note_list : list
            list of ints for each note in chord
        """
        note_list = []
        notes = chord.split('.')

        for n in notes:
            note_list.append(cls.NOTES_TO_INT[n])

        return note_list

    @classmethod
    def convert_chord_to_onehot(cls, chord):
        note_list = [0] * cls.NUM_NOTES
        notes = chord.split('.')

        for n in notes:
            note_list[cls.NOTES_TO_INT[n]] = 1

        return note_list

    @classmethod
    def convert_int_to_note(cls, int):
        return cls.INT_TO_NOTES[int]

    @classmethod
    def convert_onehot_to_chord(cls, onehot_list):
        notes = np.argmax(onehot_list)
        chord = '.'.join(convert_int_to_note(n) for n in notes)

        return chord

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        """
        Args:
            idx (int): idx of data entry to get
        Returns:
            sample : melody_x, melody_y, chord_y
        """
        row = self.df.iloc[idx]

        if self.USE_SEQUENCE:
            notes = [self.convert_note_to_int(n) for n in row['melody']]
            chords = [self.convert_chord_to_onehot(c) for c in row['chords']]
            melody_x = []
            melody_y = []
            chord_y = []
            for i in range(len(notes) - self.SEQUENCE_LENGTH):
                melody_x.append(notes[i:i + self.SEQUENCE_LENGTH])
                melody_y.append(notes[i + self.SEQUENCE_LENGTH]) # next note
                chord_y.append(chords[i + self.SEQUENCE_LENGTH - 1]) # chord belonging to last note played
        else:
            notes = [self.convert_note_to_int(n) for n in row['melody']]
            melody_x = notes[:-1] # all but last note
            melody_y = notes[1:] # all but first note
            chord_y = [self.convert_chord_to_int(c) for c in row['chords']][:-1] # all but last

        if self.transform:
            melody_x = self.transform(melody_x)
        if self.target_transform:
            melody_y = self.target_transform(melody_y)
            chord_y = self.target_transform(chord_y)

        return melody_x, melody_y, chord_y
