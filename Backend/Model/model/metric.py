import torch
import sklearn.metrics as metrics

"""
Melody metrics
"""

def melody_accuracy(output, target, extra=None):
    melody_out = output['melody_out'].contiguous().view(-1, output['melody_out'].size(-1))
    melody_y = target['melody_y'].flatten()
    return accuracy(melody_out, melody_y)

def melody_accuracy_topk(output, target, extra=None):
    melody_out = output['melody_out'].contiguous().view(-1, output['melody_out'].size(-1))
    melody_y = target['melody_y'].flatten()
    return accuracy_topk(melody_out, melody_y)

"""
Chord metrics
"""

def chord_multilabel_accuracy(output, target, extra=None, thresh=0.5):
    chord_out = output['chord_out'].flatten()
    chord_y = target['chord_y'].flatten()
    return multilabel_accuracy(chord_out, chord_y, thresh=thresh)

def chord_precision(output, target, extra=None, thresh=0.5):
    chord_out = output['chord_out'].detach().numpy().flatten() > thresh
    chord_y = target['chord_y'].detach().numpy().flatten()
    return metrics.precision_score(chord_y, chord_out)

def chord_recall(output, target, extra=None, thresh=0.5):
    chord_out = output['chord_out'].detach().numpy().flatten() > thresh
    chord_y = target['chord_y'].detach().numpy().flatten()
    return metrics.recall_score(chord_y, chord_out)

def chord_average_precision(output, target, extra=None):
    chord_out = output['chord_out'].detach().numpy().flatten()
    chord_y = target['chord_y'].detach().numpy().flatten()
    return metrics.average_precision_score(chord_y, chord_out)

def chord_auc(output, target, extra=None):
    chord_out = output['chord_out'].detach().numpy().flatten()
    chord_y = target['chord_y'].detach().numpy().flatten()
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
