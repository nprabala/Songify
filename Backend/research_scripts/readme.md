# Magenta (transcription)

## Setup

In order to run the onsets script, you will need to set up a few things for Google Magenta to work.

### Conda

I recommend downloading conda for (https://conda.io/en/master/) and setting up a conda virtual environment (https://uoa-eresearch.github.io/eresearch-cookbook/recipe/2014/11/20/conda/):

> conda create -n \<env name\> python=3.6

Activate the environment with

> source activate \<env name\>

### Modules

After conda is installed, you will need to pip install magenta, librosa, tensorflow which are needed for the script. In addition, magenta may require a few other libraries that aren't listed such as numpy, but it'll alert you which ones you will need when you try to run the script.

### Magenta Checkpoint

In order to use the checkpoint file that google provides, you will need to download it from here https://storage.googleapis.com/magentadata/models/onsets_frames_transcription/maestro_checkpoint.zip. Once unzipped, the resulting train folder needs to be put into the same directory as the Transcribe.py script.

## Issues

* Bus Error: 10. To handle this, pip uninstall numpy and then conda install numpy instead
* Make sure you are using the correct versions for Python (Python vs Python3)

## More info

More information about Magenta can be found on their gitub: https://github.com/tensorflow/magenta/tree/master/magenta/

# Aubio

Not much is needed to set up Aubio: just pip install aubio, mido, and numpy. Likewise, a few other libraries might be needed that the script will alert you to if they are not present. To run the script:

<blockquote> python aubio_.py input_file output_file.midi </blockquote>
