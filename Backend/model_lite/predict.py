import os
import sys
import numpy

from model_lite.data.dataset import Dataset
from model_lite.model import Model

class Predict:

    def __init__(self):
        self.dataset = Dataset()
        self.model = Model()
        self.model.build_network(self.dataset.output_vocab())
        self.model.load_weights()

    def generateOutput(self, x):
        prediction_output = []
        for i in range(0, len(x)):
            prediction = self.model.predict(numpy.array([x[i]]))
            index = numpy.argmax(prediction)
            result = self.dataset.int_to_chord[index]
            prediction_output.append(result)
        return prediction_output

    def process(self, input_):
        x = numpy.array([[self.dataset.convert_note_to_int(n)] for n in input_])
        reshaped_x = numpy.reshape(x, (x.shape[0], 1, x.shape[1]))
        return reshaped_x

    def get_prediction(self, input_):
        x = self.process(input_)
        return self.generateOutput(x)
