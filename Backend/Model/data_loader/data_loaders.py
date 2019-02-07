from torchvision import datasets, transforms
from base import BaseDataLoader
from data_loader.dataset import MidiDataset


class MidiDataLoader(BaseDataLoader):
    """
    Midi Dataloader class
    """
    def __init__(self, data_path, batch_size, shuffle, validation_split, num_workers, training=True, **kwargs):
        self.data_path = data_path
        self.dataset = MidiDataset(self.data_path)
        super(MidiDataLoader, self).__init__(self.dataset, batch_size, shuffle, validation_split, num_workers, **kwargs)


class MnistDataLoader(BaseDataLoader):
    """
    MNIST data loading demo using BaseDataLoader
    """
    def __init__(self, data_dir, batch_size, shuffle, validation_split, num_workers, training=True, **kwargs):
        trsfm = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize((0.1307,), (0.3081,))
            ])
        self.data_dir = data_dir
        self.dataset = datasets.MNIST(self.data_dir, train=training, download=True, transform=trsfm)
        super(MnistDataLoader, self).__init__(self.dataset, batch_size, shuffle, validation_split, num_workers, **kwargs)
