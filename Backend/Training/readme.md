## Parsing Data

Requires pip installing pickle.

Run python parse.py passing in the directory of the data containing the midi files to be read and the name of the output pickle file to be create that will store the melody and chords for each song. Data will be stored as a dictionary, with keys 'melody' and 'chord' each with values that are lists containing the list of notes/chords in a specific song. The indices of each are aligned by time. 

## Reading Data

To read the data from the pickle file, import read_pickle_file (assuming read_pickle_file.py is in the same directory), and call read_pickle_file(pickle_notes), where pickle_notes is the filename of the pickle notes to read. An example can be found in test_read_pickle_file.py. 
