# Magenta

## Setup

In order to run the onsets script, you will need to set up a few things for Google Magenta to work. 

### Conda

I recommend downloading conda for python 2.7 (https://conda.io/en/master/) and setting up a conda virtual environment (https://uoa-eresearch.github.io/eresearch-cookbook/recipe/2014/11/20/conda/).

### Modules

After conda is installed, you will need to pip install magenta, librosa, tensorflow which are needed for the script. In addition, magenta may require a few other libraries that aren't listed such as numpy, but it'll alert you which ones you will need when you try to run the script. 

In addition, a few normalization methods were added, so you will need to pip install pydub. 

### Magenta Checkpoint

In order to use the checkpoint file that google provides, you will need to download it from here https://storage.googleapis.com/magentadata/models/onsets_frames_transcription/maestro_checkpoint.zip. Once unzipped, the resulting train folder needs to be put into the same directory as the onsets script.

## Arguments

The arguments for the script can be viewed using --help, but the general arguments are: 

<blockquote> python onsets_frames_transcription_transcribe.py --acoustic_run_dir directory --clean_notes=boolean input_file </blockquote>

where acoustic_run_dir specifies the directory of the file you want to transcribe, clean_notes specifies whether you want to apply our cleaning/normalization methods, and the first system argument is the file you want to transcribe. 

## Issues

Bus Error: 10. To handle this, pip uninstall numpy and then conda install numpy instead

## More info

More information about Magenta can be found on their gitub: https://github.com/tensorflow/magenta/tree/master/magenta/

# Aubio

Not much is needed to set up Aubio: just pip install aubio, mido, and numpy. Likewise, a few other libraries might be needed that the script will alert you to if they are not present. To run the script: 

<blockquote> python aubio_.py input_file output_file.midi </blockquote> 
