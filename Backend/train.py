import os
import json
import argparse
import torch
import data_loader.data_loaders as module_data_loader
import data_loader.collate as module_collate
import model.loss as module_loss
import model.metric as module_metric
import model.model as module_model
from trainer import Trainer
from utils import Logger, get_instance


def main(config, resume):
    train_logger = Logger()

    # setup collate function
    collate_fn = getattr(module_collate, config['collate_fn'])

    # setup data_loader instances
    data_loader = get_instance(module_data_loader, 'data_loader', config, collate_fn=collate_fn)
    valid_data_loader = data_loader.split_validation()

    # build model architecture
    model = get_instance(module_model, 'model', config)
    print(model)

    # get function handles of loss and metrics
    loss = getattr(module_loss, config['loss'])
    metrics = [getattr(module_metric, met) for met in config['metrics']]

    # build optimizer, learning rate scheduler. delete every lines containing lr_scheduler for disabling scheduler
    trainable_params = filter(lambda p: p.requires_grad, model.parameters())
    optimizer = get_instance(torch.optim, 'optimizer', config, trainable_params)
    lr_scheduler = get_instance(torch.optim.lr_scheduler, 'lr_scheduler', config, optimizer)

    trainer = Trainer(model, loss, metrics, optimizer,
                      resume=resume,
                      config=config,
                      data_loader=data_loader,
                      valid_data_loader=valid_data_loader,
                      lr_scheduler=lr_scheduler,
                      train_logger=train_logger)

    trainer.train()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='PyTorch Template')
    parser.add_argument('-c', '--config', default='config/config.json', type=str,
                           help='config file path (default: config/config.json)')
    parser.add_argument('-r', '--resume', default=None, type=str,
                           help='path to latest checkpoint (default: None)')
    args = parser.parse_args()

    if args.config:
        # load config file
        config = json.load(open(args.config))
        path = os.path.join(config['trainer']['save_dir'], config['name'])
    else:
        raise ValueError("Configuration file need to be specified. Add '-c config.json', for example.")

    main(config, args.resume)
