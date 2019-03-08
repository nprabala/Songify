import pickle

## NOT USED, MOVED TO DATASET.PY

# return lists of lists containing the melody/chords of a song.
# Indices match on time steps
def read_pickle_file(pickle_file):
    with open(pickle_file, 'rb') as filepath:
        notes = pickle.load(filepath)

    melody = notes['melody']
    chords = notes['chords']
    return (melody, chords)
