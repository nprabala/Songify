from math import floor
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

    smallest = NOTE_TYPE.WHOLE.value
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

    current_chord = chords[0]
    current_duration = smallest_note
    current_index = 1

    def divide_current_chord():
        ''''
        Divide up the chord duration into integer component and remainder.
        Remainder might require further division. This ensures we don't tie
        the chord into an eighth or sixteenth note which can mess with the
        anticpated flow/beat
        '''

        integer_component = floor(current_duration)
        remainder = current_duration - integer_component

        if integer_component > 0:
            chords_to_return.append({'chord':current_chord, 'duration':integer_component})

        if remainder > 0:
            if remainder == 0.75:
                chords_to_return.append({'chord':current_chord, 'duration':0.5})
                chords_to_return.append({'chord':current_chord, 'duration':0.25})
            elif remainder == 0.5:
                chords_to_return.append({'chord':current_chord, 'duration':0.5})
            else:
                chords_to_return.append({'chord':current_chord, 'duration':0.25})


    while current_index < len(chords):
        next_chord = chords[current_index]

        # combine with last chord if less than MAX_DURATION
        if (next_chord == current_chord) and (current_duration + smallest_note <= MAX_DURATION):
            current_duration += smallest_note

        # we will replay the chord since over MAX_DURATION
        elif (next_chord == current_chord) and (current_duration + smallest_note > MAX_DURATION):
            chords_to_return.append({'chord':current_chord, 'duration':current_duration})
            current_duration = smallest_note

        # divide up current chord and make next chord the new current chord
        else:
            divide_current_chord()
            current_chord = next_chord
            current_duration = smallest_note

        current_index += 1

    divide_current_chord()
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
