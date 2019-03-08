from math import floor
from enum import Enum
from sanic import Sanic
from sanic.response import text, json
from sanic_cors import CORS, cross_origin
from aoiklivereload import LiveReloader
from predict import Predict
from collections import defaultdict

# running sanic
app = Sanic()
CORS(app)

# live reloading
reloader = LiveReloader()
reloader.start_watcher_thread()

# model predictor
predict = Predict()

# connection information
IP = '0.0.0.0'
PORT = 8081

# enum of different note lengths
class NOTE_TYPE(Enum):
    SIXTEENTH = 0.25
    EIGHTH = 0.5
    QUARTER = 1
    HALF = 2
    WHOLE = 4

# max length chord can last for before breaking it up
MAX_DURATION = NOTE_TYPE.HALF.value

def find_smallest_note(notes):
    ''''
    Returns the smallest note_length in the notes provided
    '''

    smallest = NOTE_TYPE.HALF.value
    for n in notes:
        duration = n['duration']
        if duration < smallest:
            smallest = duration

    return smallest

def get_notes_timesteps(notes, smallest_note):
    ''''
    Takes in list of key-value pairs indicating the note as a string
    and duration as a float.

    Returns array of the notes sampled at smallest_note note intervals
    '''

    timesteps = []
    for n in notes:
        note = n['note']
        duration = n['duration']
        offset = 0

        while offset < duration:
            timesteps.append(note)
            offset += smallest_note

    return timesteps

def query_model(notes_timestamps):
    ''''
    Returns chords predicted by the model given notes_timestamps
    '''
    return predict.get_prediction(notes_timestamps)

def get_chord_progressions(notes):
    ''''
    Takes in a list of dicts containing note and duration.

    Parses notes into notes_timestamps

    Queries the model for chords corresponding to these notes and concats
    repeated chords together.

    Returns this chord progression as a list of key-value pairs mapping
    chord and duration.
    '''

    smallest_note = find_smallest_note(notes)
    notes_timestamps = get_notes_timesteps(notes, smallest_note)
    chords = query_model(notes_timestamps)
    chords_to_return = []

    chord_freq = defaultdict(int)
    current_dur = 0
    for chord in chords:
        chord_freq[chord] += 1
        current_dur += smallest_note

        if current_dur == NOTE_TYPE.HALF.value:
            # get most frequent chord
            c = max(chord_freq, key=lambda k: chord_freq[k])
            chords_to_return.append({'chord':c, 'duration':current_dur})

            chord_freq = defaultdict(int)
            current_dur = 0

    if len(chord_freq) > 0:
        c = max(chord_freq, key=lambda k: chord_freq[k])
        chords_to_return.append({'chord':c, 'duration':current_dur})
    return chords_to_return

@app.route("/",methods=["GET","OPTIONS"])
async def return_home(request):
    return json({"hello":"world"})

@app.route("/chord_progressions", methods=['POST','OPTIONS','GET'])
async def post_chord_progressions(request):
    notes = request.json
    if notes:
        return json(get_chord_progressions(notes))
    else:
        return json([])

if __name__ == "__main__":
    app.run(host=IP, port=PORT)
