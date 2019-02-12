import osco
import sys
import numpy
import torch

from utils.util import get_instance
import model.model as module_model
from data_loader.dataset import MidiDataset

class Predict:
    MAX_LEN = 1000
    def __init__(self):
        # Load config
        self.json_path = './config.json'
        self.config = config = json.load(open(self.json_path))
        self.dataset = MidiDataset

        # load model
        self.model = get_instance(module_model, 'model', self.config)
        self.resume = './saved/Music_LSTM/0208_141502/model_best.pth'
        if torch.cuda.is_available():
            checkpoint = torch.load(self.resume)
        else:
            checkpoint = torch.load(self.resume, map_location=lambda storage, loc: storage)
        state_dict = checkpoint['state_dict']
        self.model.load_state_dict(state_dict)



    def generateOutput(self, x):
        pred_output = []

        for i in range(self.MAX_LEN):
            if i < len(x):
                input = x[i]
            pred = self.model.forward()
        for i in range(0, len(x)):
            prediction = self.model.predict(numpy.array([x[i]]))
            index = numpy.argmax(prediction)
            result = self.dataset.int_to_chord[index]
            prediction_output.append(result)
        return prediction_output

    def process(self, input_):
        x = torch.tensor([self.dataset.convert_note_to_int(n) for n in input_]).long().view(1,-1)
        return x

    def get_prediction(self, input_):
        x = self.process(input_)
        return self.generateOutput(x)
