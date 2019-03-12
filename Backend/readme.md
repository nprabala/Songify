## Server

You will need Python 3.6 for this project. We recommend downloading conda (https://conda.io/en/master/) and setting up a conda virtual environment (https://uoa-eresearch.github.io/eresearch-cookbook/recipe/2014/11/20/conda/):

`conda create -n \<env name\> python=3.6`

Activate the environment with:

`source activate \<env name\>`

In order to run the server/model, you will need to pip install some requirements:

`pip install -r requirements.txt`

To run the server <br />
`python model_server.py`


## Training Model
## Midi LSTM - generate chords and melody from input melody
### Code template adapted from https://github.com/victoresque/pytorch-template

Install requirements<br />
`pip install -r requirements.txt`

Dataset constructed from https://github.com/wayne391/Lead-Sheet-Dataset or download our copy https://drive.google.com/file/d/1LH7v59EsS4rwhy9HKaEdE9frcuHZTabQ/view and place the data in the data folder. 

Parse through data and create pickle data file<br />
`python data_loader/parse.py data/ data/output.pkl`

Train the model using default config file<br />
`python train.py`

