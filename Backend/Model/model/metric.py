import torch
import sklearn.metrics as metrics

def melody_accuracy(output, target, extra=None):
    melody_out = output['melody_out']
    melody_y = target['melody_y']
    with torch.no_grad():
        return metrics.accuracy_score(melody_y, melody_out)

def chord_accuracy(output, target, extra=None):
    chord_out = output['chord_out']
    chord_y = target['chord_y']
    with torch.no_grad():
        return metrics.accuracy_score(chord_y, chord_out)


def my_metric(output, target):
    with torch.no_grad():
        pred = torch.argmax(output, dim=1)
        assert pred.shape[0] == len(target)
        correct = 0
        correct += torch.sum(pred == target).item()
    return correct / len(target)

def my_metric2(output, target, k=3):
    with torch.no_grad():
        pred = torch.topk(output, k, dim=1)[1]
        assert pred.shape[0] == len(target)
        correct = 0
        for i in range(k):
            correct += torch.sum(pred[:, i] == target).item()
    return correct / len(target)
