#!/usr/bin/env python
import threading
import time
import logging
from collections import deque

d = deque()

formatter = "%(asctime)s - %(name)s (%(threadName)-10s) - %(levelname)s - %(message)s"
logging.basicConfig(level=logging.INFO, format=formatter)
logger = logging.getLogger(__name__)


def thread_one(start_event):

    start_event.wait()
    print("THREAD 1")
    print(d[0])
    print('****')
    d[0] += 1


def thread_two(start_event):
    i = 0
    d.append(i)
    while d[0] < 10:

        print("THREAD 2")
        print(d[0])
        d[0] += 1
        time.sleep(0.5)
        if d[0] > 5:
            start_event.set()


if __name__ == '__main__':
    start_event = threading.Event()
    t_one = threading.Thread(target=thread_one, args=[start_event]).start()
    t_two = threading.Thread(target=thread_two, args=[start_event]).start()
