from tensorflow.python.keras import utils
from tensorflow.python.keras.models import Sequential
from tensorflow.python.keras.layers import GRU

class Model:
    epochs = 1
    batch_size = 128
    num_features = 1
    weights = './model_lite/weights.h5'

    def __init__(self):
        self.model = None

    def build_network(self, output_vocab):
        self.model = Sequential()
        self.model.add(GRU(output_vocab, input_shape=(1, self.num_features), \
            activation='softmax'))
        self.model.compile(loss='sparse_categorical_crossentropy', \
            optimizer='rmsprop')

    def train(self, x, y):
        self.model.fit(x, y, epochs=self.epochs, batch_size=self.batch_size, \
            verbose=1, validation_split=0.2)
        self.model.save_weights(self.weights)

    def load_weights(self):
        self.model.load_weights(self.weights)

    def predict(self, x):
        return self.model.predict(x, batch_size=self.batch_size, verbose=0)
