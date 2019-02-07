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

    def convert_note(self, note):
        return self.NOTES_TO_INT[note]

    def convert_chord(self, chord):
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
            note_list.append(self.NOTES_TO_INT[n])

        return note_list


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

        notes = [self.convert_note(n) for n in row['melody']]
        melody_x = notes[:-1] # all but last note
        melody_y = notes[1:] # all but first note
        chord_y = [self.convert_chord(c) for c in row['chords']][:-1] # all but last

        if self.transform:
            melody_x = self.transform(melody_x)
        if self.target_transform:
            melody_y = self.target_transform(melody_y)
            chord_y = self.target_transform(chord_y)

        return melody_x, melody_y, chord_y
