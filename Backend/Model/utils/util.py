import os

def get_instance(module, name, config, *args):
    return getattr(module, config[name]['name'])(*args, **config[name]['args'])

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)
