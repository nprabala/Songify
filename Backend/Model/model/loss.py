import torch.nn.functional as F

def midi_loss(output, target, extra=None):
    melody_out = output['melody_out']
    chord_out = output['chord_out']
    melody_y = target['melody_y']
    chord_y = target['chord_y']

    batch_size, seq_len, vocab_size = melody_out.shape

    # flatten (batchsize, seq_len, vocab_size) -> (batchsize * seq_len, vocab_size)
    # contiguous returns tensor with same data
    melody_out = melody_out.contiguous().view(-1, vocab_size)
    chord_out = chord_out.contiguous().view(-1, vocab_size)
    melody_y = melody_y.flatten()
    chord_y = chord_y.view(-1, vocab_size)

    return F.nll_loss(melody_out, melody_y) + F.binary_cross_entropy(chord_out, chord_y)
