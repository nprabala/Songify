from sanic import Sanic
from sanic.response import text
import Constants
from Transcribe import Transcriber


app = Sanic()
ts = Transcriber()


@app.route("/")
async def transcribe(request):
    filename = request.args['filename'][0]
    ts.run(filename)
    return text(filename + " was successfully transcribed!")

if __name__ == "__main__":
    ts.init()
    app.run(host=Constants.TRANSCRIPTION_IP, port=Constants.TRANSCRIPTION_PORT)
