import torch
from torch.utils.data.dataloader import default_collate
from data_loader.dataset import MidiDataset

def midi_collate_fn(data):
    """Creates mini-batch tensors from the list of tuples (melody_x, melody_y, chord_y).

    We should build custom collate_fn rather than using default collate_fn,
    because merging caption (including padding) is not supported in default.
    Args:
        data: list of tuple (melody_x, melody_y, chord_y).
            - melody_x: torch tensor of shape (sequence_len,)
            - melody_y: torch tensor (sequence_len,)
            - chord_y: torch tensor (sequence_len, vocab_size)
    Returns:
        data:
            - melody_x: torch tensor of shape (batch_size, sequence_len)
        target:
            - melody_y: torch tensor of shape (batch_size, sequence_len)
            - chord_y_onehot: torch tensor of shape (batch_size, sequence_len, vocab_size)
        extra:
            - seq_lengths: torch tensor of sequence lengths of batch
    """
    # Sort a data list by caption length (descending order).
    data.sort(key=lambda x: len(x[0]), reverse=True)

    melody_x, melody_y, chord_y = zip(*data)
    batch_size = len(melody_x)
    vocab_size = MidiDataset.NUM_NOTES

    # seq_lengths = torch.LongTensor([[len(seq) for seq in song] for song in melody_x])
    # total_batch_size = sum(seq_lengths.shape)
    # seq_melody_x = torch.zeros((total_batch_size, seq_lengths.max())).long()
    # seq_melody_y = torch.zeros((total_batch_size, seq_lengths.max())).long()
    #
    # seq_melody_x = torch.tensor(melody_x)
    # seq_melody_x = seq_melody_x.reshape(-1. seq_melody_x.size(-1))
    # seq_melody_y = torch.tensor(melody_y)
    # seq_melody_y = seq_melody_y.reshape(-1. seq_melody_y.size(-1))
    #  TODO
    #  chord_y
    #
    #

    # get length of each sequence in batch
    seq_lengths = torch.LongTensor([len(seq) for seq in melody_x])
    seq_melody_x = torch.zeros((batch_size, seq_lengths.max())).long()
    seq_melody_y = torch.zeros((batch_size, seq_lengths.max())).long()

    # pad to max sequence length
    for idx, (mx, my, seq_len) in enumerate(zip(melody_x, melody_y, seq_lengths)):
        seq_melody_x[idx, :seq_len] = torch.tensor(mx)
        seq_melody_y[idx, :seq_len] = torch.tensor(my)

    # make onehot chord tensor
    chord_y_onehot = torch.zeros(batch_size, seq_lengths.max(), vocab_size)
    for idx, (c, seq_len) in enumerate(zip(chord_y, seq_lengths)):
        for j, notes in enumerate(c):
            chord_y_onehot[idx, j, notes] = 1

    # sort tensors by length
    seq_lengths, perm_idx = seq_lengths.sort(0, descending=True)
    seq_melody_x = seq_melody_x[perm_idx]
    seq_melody_y = seq_melody_y[perm_idx]
    chord_y_onehot = chord_y_onehot[perm_idx]

    # package in dictionary
    data = {'melody_x': seq_melody_x}
    target = {'melody_y': seq_melody_y, 'chord_y': chord_y_onehot}
    extra = {'seq_lengths': seq_lengths}

    return data, target, extra
