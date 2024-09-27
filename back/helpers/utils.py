import os
import inspect

def getCurrdir():
    caller_frame = inspect.currentframe().f_back
    return os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(caller_frame.f_globals['__file__'])))

def getCurrFile():
    caller_frame = inspect.currentframe().f_back
    return os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(caller_frame.f_globals['__file__']), caller_frame.f_globals["__name__"]))

def getRelative(path : str):
    caller_frame = inspect.currentframe().f_back
    return os.path.realpath(os.path.join(caller_frame.f_globals['__location__'], path))