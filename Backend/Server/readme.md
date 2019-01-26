# Magenta

## Setup

In order to run the onsets script, you will need to set up a few things for Google Magenta to work. 

### Conda

I recommend downloading conda for python 2.7 (https://conda.io/en/master/) and setting up a conda virtual environment (https://uoa-eresearch.github.io/eresearch-cookbook/recipe/2014/11/20/conda/).

### Modules

After conda is installed, you will need to pip install magenta, librosa, tensorflow which are needed for the script. In addition, magenta may require a few other libraries that aren't listed such as numpy, but it'll alert you which ones you will need when you try to run the script. 

### Magenta Checkpoint

In order to use the checkpoint file that google provides, you will need to download it from here https://storage.googleapis.com/magentadata/models/onsets_frames_transcription/maestro_checkpoint.zip. Once unzipped, the resulting train folder needs to be put into the same directory as the onsets script.

## Issues

Bus Error: 10. To handle this, pip uninstall numpy and then conda install numpy instead

## More info

More information about Magenta can be found on their gitub: https://github.com/tensorflow/magenta/tree/master/magenta/

# Server 

## Sanic

To use Sanic: pip install sanic. The Constants file will be used to store server info such as IP addresses and ports so we can easily make changes for running locally or on the cloud. 
