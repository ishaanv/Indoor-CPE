"""
EventQueue contains three internal objects
- Queue: will handle the enqueuing and dequeuing operations
    (with no real knowledge of what kind of element it's moving around)
- Results: has to memorize all the function results,
    and return them when asked. By an authorized entity.
- Runner: will be the main gear of our event queue. Will run whenever needed,
    take the next element from the `Queue`
    and store the results in `Results`
"""


class EventQueue:
    def __init__(self):
        self._queue = self.Queue()
        self._results = self.Results()
        self._runner = self.Runner(self._queue.dequeue)

        self._runner.start()

    def enqueue(self, func, args=[], kwargs={}, highPriority=False):
        (setResultFunc, getResultFunc) = self._results.getResultContainer()
        element = self.Runner.packCall(func, args, kwargs, setResultFunc)
        self._queue.enqueue(element, highPriority)

        return getResultFunc

    def stop(self, highPriority=False):
        (setResultFunc, getResultFunc) = self._results.getResultContainer()
        element = self._runner.getStopCall(setResultFunc)
        self._queue.enqueue(element, highPriority)

        return getResultFunc

    class Queue:
        """
        Queue is simply a length n list
        with the highest priority objects at
        index 0, and lowest at index n.
        enqueue inserts at index 0 for high priority
        and appends otherwise
        """
        def __init__(self):
            self._list = []

        def enqueue(self, element, highPriority):
            if highPriority:
                self._list.insert(0, element)
            else:
                self._list.append(element)
            return
        """
        tests if queue is non-empty
        """
        def hasMore(self):
            return len(self._list) > 0
        """
        pops from index 0
        """
        def dequeue(self):
            return self._list.pop(0)

    class Results:

        def getResultContainer(self):
            container = self._Container()
            return (container.setResult, container.getResult)

        class _Container:
            def __init__(self):
                self._hasResult = False
                self._resultIsException = False
                self._result = None

            def setResult(self, result, resultIsException):
                self._hasResult = True
                self._resultIsException = resultIsException
                self._result = result

            def getResult(self):
                if self._hasResult:
                    if self._resultIsException:
                        raise self._result
                    else:
                        return self._result
