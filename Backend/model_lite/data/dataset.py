import pickle

class Dataset:
    pickle_file = './model_lite/data/all_keys_notes'

    def __init__(self):
        self.read_pickle_file()
        self.create_mappings()

    def convert_note_to_int(self, n):
        return self.note_to_int[n]

    def convert_int_to_note(self, i):
        return self.int_to_note[i]

    def convert_chord_to_int(self, c):
        return self.chord_to_int[c]

    def convert_int_to_chord(self, i):
        return self.int_to_chord[i]

    def output_vocab(self):
        return len(self.chord_to_int)

    def create_mappings(self):
        notes = set()
        for m in self.melodies:
            for n in m:
                notes.add(n)
        notes = sorted(notes)

        chords = set()
        for c in self.chords:
            for n in c:
                chords.add(n)
        chords = sorted(chords)

        self.note_to_int = dict((n, i) for i, n in enumerate(notes))
        self.int_to_note = dict((i, n) for i, n in enumerate(notes))
        self.chord_to_int = dict((c, i) for i, c in enumerate(chords))
        self.int_to_chord = dict((i, c) for i, c in enumerate(chords))

    def read_pickle_file(self):
        with open(self.pickle_file, 'rb') as filepath:
            notes = pickle.load(filepath)

        self.melodies = notes['melody']
        self.chords = notes['chords']
