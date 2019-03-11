import os
import numpy as np
import pandas as pd
import pickle
import torch
from torch.utils.data import Dataset
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence
from .constants import NOTES_TO_INT, INT_TO_NOTES, CHORD_TO_INT, INT_TO_CHORD, CHORD_TO_NOTES, NOTES_TO_CHORD


'''
TODO LOOK AT THIS
https://www.reddit.com/r/musictheory/comments/1jd894/looking_for_an_algorithm_that_generates_chord/
https://www.reddit.com/r/cs231n/comments/93iyxa/cs231nrepodeepubuntutargz_not_found/
'''
class MidiDataset(Dataset):
    """MIDI Music Dataset"""
    # NOTES = ['C', 'C#', 'D-', 'D', 'D#', 'E-', 'E', 'E#', 'F-', 'F', 'F#',
    #             'G-', 'G', 'G#', 'A-', 'A', 'A#', 'B-', 'B', 'B#', 'C-']
    # NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    # NOTE_TO_INT = {k:v for v, k in enumerate(NOTES)}

    NUM_NOTES = max(NOTES_TO_INT.values()) + 1
    NOTES_TO_INT = NOTES_TO_INT
    INT_TO_NOTES = INT_TO_NOTES
    CHORD_TO_INT = CHORD_TO_INT
    INT_TO_CHORD = INT_TO_CHORD
    CHORD_TO_NOTES = CHORD_TO_NOTES
    NOTES_TO_CHORD = NOTES_TO_CHORD

    # Use sequence of notes insteads of entire song (false runs sequence over entire song)
    USE_SEQUENCE = False
    SEQUENCE_LENGTH = 16

    # Use onehot instead of binary
    USE_CHORD_ONEHOT = True
    NUM_CHORDS = max(CHORD_TO_INT.values()) + 1
    INTERSECT_THRESH = 2 # Number of notes to intersect to count as a chord

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

        if self.USE_CHORD_ONEHOT:
            self.chord_converter = self.convert_chord_to_onehot
        else:
            self.chord_converter = self.convert_chord_to_binary

        # if self.USE_CHORD_ONEHOT:
        #     chord_set = set([])
        #     for song in data_dict['chords']:
        #         for n in song:
        #             chord = '.'.join(sorted(n.split('.')))
        #             chord_set.add(self.simplify_chord(n))
        #
        #     self.CHORD_DICT = CHORD_TO_NOTES
        #     for k,v in self.CHORD_DICT.items():
        #         self.CHORD_DICT[k] = self.simplify_chord(v)
        #
        #     self.IDX_CHORD_DICT = {v:k for k,v in self.CHORD_DICT.items()}
        #
        #     missed = []
        #     correct = []
        #     two = []
        #     for chord in chord_set:
        #         found = False
        #         for k,v in self.IDX_CHORD_DICT.items():
        #             if len(set(chord.split('.')).intersection(set(k.split('.')))) > 1:
        #             # if all(x in chord.split('.') for x in k.split('.')) or all(x in k.split('.') for x in chord.split('.')):
        #                 found = True
        #                 correct.append(chord)
        #                 break
        #         if not found:
        #             missed.append(chord)
        #
        #     print(two)
        #     print("TWO", len(two))
        #     print("MISSED", len(missed))
        #     print(missed)
        #     print("CORRECT", len(correct))
        #     raise
        #
        #     self.chord_to_idx = {c:i for i, c in enumerate(chord_set)}
        #     self.idx_to_chord = {v:k for k,v in self.chord_to_idx.items()}
        #
        #
        #     self.chord_converter = self.convert_chord_to_onehot
        # else:
        #     self.chord_converter = self.convert_chord_to_binary

        self.df = pd.DataFrame.from_dict(data_dict)
        self.transform = transform
        self.target_transform = target_transform

    @classmethod
    def simplify_chord(cls, chord):
        '''
        Given chord, gives idx of all the notes, simplifying it
        return as string joined by '.'
        '''
        note_list = []
        notes = chord.split('.')

        for n in notes:
            n_idx = str(cls.convert_note_to_int(n))
            if n_idx not in note_list: note_list.append(n_idx)

        return '.'.join(note_list)

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
            note_list.append(cls.convert_note_to_int(n))

        return note_list

    def convert_chord_to_onehot(self, chord):
        """"Convert chord to onehot list"""
        chord_name = 'EMPTY'
        for k,v in NOTES_TO_CHORD.items():
            if len(set(chord.split('.')).intersection(set(k.split('.')))) >= self.INTERSECT_THRESH:
                chord_name = v
                break

        # offset by 1 to remove pad
        return self.CHORD_TO_INT[chord_name]

    @classmethod
    def convert_chord_to_binary(cls, chord):
        """Convert chord to binary list"""
        note_list = [0] * cls.NUM_NOTES
        notes = chord.split('.')

        for n in notes:
            note_list[cls.NOTES_TO_INT[n]] = 1

        return note_list

    @classmethod
    def convert_int_to_note(cls, int):
        """Convert int to the note"""
        return cls.INT_TO_NOTES[int]

    @classmethod
    def convert_binary_to_chord(cls, binary_list):
        """Convert binary list to the chord"""
        notes = np.argmax(binary_list)
        chord = '.'.join(convert_int_to_note(n) for n in notes)

        return chord

    @classmethod
    def convert_chord_int_to_str(cls, chord_int):
        """"Convert chord to string"""
        return cls.CHORD_TO_NOTES[cls.INT_TO_CHORD[chord_int]]

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
            chords = [self.chord_converter(c) for c in row['chords']]
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
            chord_y = [self.chord_converter(c) for c in row['chords']][:-1] # all but last

        if self.transform:
            melody_x = self.transform(melody_x)
        if self.target_transform:
            melody_y = self.target_transform(melody_y)
            chord_y = self.target_transform(chord_y)

        return melody_x, melody_y, chord_y

if __name__ == '__main__':
    data_path = 'data/out.pkl'
    dataset = MidiDataset(data_path)
