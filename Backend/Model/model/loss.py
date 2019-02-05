import torch.nn.functional as F

def binary_cross_entropy_loss(output, target):
    return F.binary_cross_entropy(output, target)

def nll_loss(output, target):
    return F.nll_loss(output, target)
