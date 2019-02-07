## Parsing Data

Requires pip installing pickle.

Run

> python -m model_lite.data.parse

assuming data is in the same directory. Data will be stored as a dictionary, with keys 'melody' and 'chord' each with values that are lists containing the list of notes/chords in a specific song. The indices of each are aligned by time.

## Reading Data

To read the data from the pickle file, import Dataset class, create an instance, and call read_pickle_file. The melodies and chords will be stored in the fields of the Dataset instance.
