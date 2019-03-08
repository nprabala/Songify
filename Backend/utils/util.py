import os

def get_instance(module, name, config, *args, **kwargs):
    return getattr(module, config[name]['name'])(*args, **kwargs, **config[name]['args'])

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)
