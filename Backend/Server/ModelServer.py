from sanic import Sanic
from sanic.response import text, json



app = Sanic()
IP = '0.0.0.0'
PORT = 8000
sixteenth = 0.25 # 16th note: 1 = quarter note, 0.5 = 8th note


def get_notes_timesteps(notes):
    ''''
    Takes in list of key-value pairs indicating the note as a string
    and duration as a float.

    Returns array of the notes sampled at sixteenth note intervals
    '''

    timesteps = []
    for n in notes:
        note = n['note']
        duration = n['duration']
        offset = 0

        while offset < duration:
            timesteps.append(note)
            offset += sixteenth
    return timesteps


# TODO: stub for now
def query_model(notes_timestamps):
    ''''
    Returns chords predicted by the model given notes_timestamps
    '''
    return ['C.E.G','C.E.G', 'C.E.G', 'C.E.G', 'D.G.A', 'D.G.A', 'C.F.G', 'A.D.E']

def get_chord_progressions(notes_timestamps):
    ''''
    Takes in a list notes_timestamps of the notes sampled over time intervals.

    Queries the model for chords corresponding to these notes and concats
    repeated chords together.

    Returns this chord progression as a list of key-value pairs mapping
    chord and duration.
    '''
    chords = query_model(notes_timestamps)
    concated_chords = []

    for chord in chords:
        if len(concated_chords) > 0:
            # check if last_chord is the same as chord, if so, update
            # last_chord's duration
            last_chord = concated_chords[-1]
            if last_chord['chord'] == chord:
                last_chord['duration'] += sixteenth
                continue

        # last_chord wasn't chord, so make new insertion
        concated_chords.append({'chord':chord, 'duration':sixteenth})

    return concated_chords

@app.route("/chord_progressions", methods=['POST'])
async def post_chord_progressions(request):
    notes = request.json
    notes_timestamps = get_notes_timesteps(notes)
    return json(get_chord_progressions(notes_timestamps))

if __name__ == "__main__":
    app.run(host=IP, port=PORT)
