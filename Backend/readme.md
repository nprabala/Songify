# Server

## Sanic

You will need Python 3.6. I recommend downloading conda for (https://conda.io/en/master/) and setting up a conda virtual environment (https://uoa-eresearch.github.io/eresearch-cookbook/recipe/2014/11/20/conda/):

> conda create -n \<env name\> python=3.6

Activate the environment with

> source activate \<env name\>

To use Sanic: pip install sanic and then run python ModelServer.py.

To help with live reloading for development, pip install hupper and run

> hupper -m \<app name\>

so it can track your changes and reload the server.

## ModelServer

To test ModelServer locally, download postman (API tool for sending requests),
insert localhost:8000/chord_progressions as the URL, make it a POST request,
and insert notes as the request body in the following format:

    [{"note":"A", "duration":2},
    {"note":"B", "duration":1},
    {"note":"C", "duration":0.25},
    {"note":"D", "duration":0.5},
    {"note":"A", "duration":1}]

The server will return chords in a similar format (just with 'chords' instead
of notes).

## Model
## Midi LSTM - generate chords and melody from input melody
### Code template adapted from https://github.com/victoresque/pytorch-template


Install requirements<br />
`pip install -r requirements.txt`


Parse through data and create pickle data file<br />
`python data_loader/parse.py data/ data/output.pkl`



Train the model using default config file<br />
`python train.py`

