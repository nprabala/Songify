from enum import Enum
from sanic import Sanic
from sanic.response import text, json
from sanic_cors import CORS, cross_origin
from aoiklivereload import LiveReloader
from predict import Predict

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

# sample interval
INTERVAL = 4 # num sixteenth notes... total of a quarter note

# enum of different note lengths
class NOTE_TYPE(Enum):
    SIXTEENTH = 0.25
    EIGHTH = 0.5
    QUARTER = 1
    HALF = 2
    WHOLE = 4

def get_notes_timesteps(notes):
    ''''
    Takes in list of key-value pairs indicating the note as a string
    and duration as a float.

    Returns array of the notes sampled at NOTE_TYPE.SIXTEENTH.value note intervals
    '''

    timesteps = []
    for n in notes:
        note = n['note']
        duration = n['duration']
        offset = 0

        while offset < duration:
            timesteps.append(note)
            offset += NOTE_TYPE.SIXTEENTH.value

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

    Queries the model for chords corresponding to these notes.

    Returns these chords sampled at INTERVAL offsets (with similar chords
    combined up to a whole note value) as a
    list of key-value pairs mapping chord and duration.
    '''

    notes_timestamps = get_notes_timesteps(notes)
    chords = query_model(notes_timestamps)
    chords_to_return = []

    for c in range(0, len(chords), INTERVAL):
        chord = chords[c]

        if len(chords_to_return) > 0:
            # check if last_chord is the same as chord, if so, update
            # last_chord's duration (if less than whole note duration)
            last_chord = chords_to_return[-1]
            if last_chord['chord'] == chord and last_chord['duration'] < NOTE_TYPE.WHOLE.value:
                last_chord['duration'] += NOTE_TYPE.QUARTER.value
                continue

        chords_to_return.append({'chord':chord, 'duration':NOTE_TYPE.QUARTER.value})

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
