import torch
import sklearn.metrics as metrics
from data_loader.dataset import MidiDataset

"""
Melody metrics
"""
def melody_preprocess(output, target, extra=None):
    '''
    Preprocessing for all melody metrics
    Returns
        flat_melody_out (batch_size * seq_len, vocab_size)
        flat_melody_y (batch_size * seq_len)
    '''
    seq_lengths = extra['seq_lengths']
    melody_out = torch.exp(output['melody_out'].detach())
    melody_y = target['melody_y'].detach()

    batch_size = len(seq_lengths)

    if MidiDataset.USE_SEQUENCE:
        flat_melody_out = melody_out
        flat_melody_y = melody_y
    else:
        flat_melody_out = torch.tensor([])
        flat_melody_y = torch.tensor([]).long()
        for i in range(batch_size):
            flat_melody_out = torch.cat((flat_melody_out, melody_out[i, :seq_lengths[i]]))
            flat_melody_y = torch.cat((flat_melody_y, melody_y[i, :seq_lengths[i]].long()))

    return flat_melody_out, flat_melody_y

def melody_accuracy(output, target, extra=None):
    melody_out, melody_y = melody_preprocess(output, target, extra=extra)
    return accuracy(melody_out, melody_y)

def melody_accuracy_topk(output, target, extra=None):
    melody_out, melody_y = melody_preprocess(output, target, extra=extra)
    return accuracy_topk(melody_out, melody_y)

"""
Chord metrics
"""
def chord_preprocess(output, target, extra=None):
    '''
    Preprocessing for all melody metrics
    Returns
        flat_chord_out (batch_size * seq_len * vocab_size)
        flat_chord_y (batch_size * seq_len * vocab_size)
    '''
    seq_lengths = extra['seq_lengths']
    chord_out = output['chord_out'].detach()
    chord_y = target['chord_y'].detach()

    batch_size = len(seq_lengths)

    if MidiDataset.USE_SEQUENCE:
        flat_chord_out = chord_out
        flat_chord_y = chord_y
    else:
        flat_chord_out = torch.tensor([])
        flat_chord_y = torch.tensor([])
        for i in range(batch_size):
            flat_chord_out = torch.cat((flat_chord_out, chord_out[i, :seq_lengths[i]]))
            flat_chord_y = torch.cat((flat_chord_y, chord_y[i, :seq_lengths[i]].float()))

    if MidiDataset.USE_CHORD_ONEHOT:
        flat_chord_out = torch.exp(flat_chord_out)
        flat_chord_y = flat_chord_y.long()
    else:
        flat_chord_out = flat_chord_out.flatten()
        flat_chord_y = flat_chord_y.flatten()

    return flat_chord_out, flat_chord_y

def chord_accuracy(output, target, extra=None):
    chord_out, chord_y = chord_preprocess(output, target, extra=extra)
    return accuracy(chord_out, chord_y)

def chord_accuracy_topk(output, target, extra=None):
    chord_out, chord_y = chord_preprocess(output, target, extra=extra)
    return accuracy_topk(chord_out, chord_y)

def chord_multilabel_accuracy(output, target, extra=None, thresh=0.5):
    chord_out, chord_y = chord_preprocess(output, target, extra=extra)
    return multilabel_accuracy(chord_out, chord_y, thresh=thresh)

def chord_precision(output, target, extra=None, thresh=0.5):
    chord_out, chord_y = chord_preprocess(output, target, extra=extra)
    return metrics.precision_score(chord_y, chord_out > thresh)

def chord_recall(output, target, extra=None, thresh=0.5):
    chord_out, chord_y = chord_preprocess(output, target, extra=extra)
    return metrics.recall_score(chord_y, chord_out > thresh)

def chord_average_precision(output, target, extra=None):
    chord_out, chord_y = chord_preprocess(output, target, extra=extra)
    return metrics.average_precision_score(chord_y, chord_out)

def chord_auc(output, target, extra=None):
    chord_out, chord_y = chord_preprocess(output, target, extra=extra)
    return metrics.roc_auc_score(chord_y, chord_out)

"""
Generic metrics
"""
def multilabel_accuracy(output, target, thresh=0.5):
    """
    output: torch.tensor
        (batch_size,)
    target: torch.tensor
        (batch_size,)
    """
    with torch.no_grad():
        pred = (output > 0.5).float()
        assert pred.shape == target.shape
        correct = 0
        correct += torch.sum(pred == target).item()
    return correct / len(target)

def accuracy(output, target):
    with torch.no_grad():
        pred = torch.argmax(output, dim=1)
        assert pred.shape[0] == len(target)
        correct = 0
        correct += torch.sum(pred == target).item()
    return correct / len(target)

def accuracy_topk(output, target, k=3):
    with torch.no_grad():
        pred = torch.topk(output, k, dim=1)[1]
        assert pred.shape[0] == len(target)
        correct = 0
        for i in range(k):
            correct += torch.sum(pred[:, i] == target).item()
    return correct / len(target)
