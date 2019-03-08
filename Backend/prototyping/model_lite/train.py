import os
import sys
import numpy

from model_lite.data.dataset import Dataset
from model_lite.model import Model

def create_dataset(dataset):
    dataX, dataY = [], []

    melodies = dataset.melodies
    chords = dataset.chords

    for i in range(0, len(melodies)):
        melody = melodies[i]
        chord = chords[i]

        for i in range(0, len(melody)):
            dataX.append([dataset.convert_note_to_int(melody[i])])
            dataY.append(dataset.convert_chord_to_int(chord[i]))

    x = numpy.array(dataX)
    reshaped_x = numpy.reshape(x, (x.shape[0], 1, x.shape[1]))
    y = numpy.array(dataY)

    return reshaped_x, y

def train():
    # create dataset
    dataset = Dataset()
    x, y = create_dataset(dataset)

    # build model and train
    model = Model()
    model.build_network(dataset.output_vocab())
    model.train(x, y)

if __name__ == '__main__':
    train()
