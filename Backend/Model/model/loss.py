import torch.nn.functional as F

def midi_loss(output, target, extra=None):
    melody_out = output['melody_out']
    chord_out = output['chord_out']
    melody_y = target['melody_y']
    chord_y = target['chord_y']

    return nll_loss(melody_out, melody_y) + binary_cross_entropy_loss(chord_out, chord_y)

def binary_cross_entropy_loss(output, target):
    return F.binary_cross_entropy(output, target)

def nll_loss(output, target):
    return F.nll_loss(output, target)
