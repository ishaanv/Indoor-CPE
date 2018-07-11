
import os


class FileRingBuffer():
    def __init__(self, filename, size_rows, size_line=100,clear=False):
        # check if file exists
        if not os.path.isfile(filename):
            open(filename, 'w').close()
        self.filename = filename
        
        self.size_rows = int(size_rows)
        self.size_line = int(size_line)
        if clear:
            self.flush()

    def pop(self, n):
        with open(self.filename, 'r+U') as fd:
            rows = fd.readlines()
        with open(self.filename, 'w') as fd:
            n = int(n)
            fd.writelines(rows[n:])
            return ''.join(rows[:n])

    def _trim_fifo(self, row):
        with open(self.filename, 'rU') as fd:
            rows = fd.readlines()
        num_rows = len(rows)
        if num_rows >= self.size_rows:
            n = self._string_conditioned(row).count('\n')
            self.pop(num_rows + n - self.size_rows)
    
    def _string_conditioned(self,string):
        '''
        Ensures ends with \n only
        '''
        return string.rstrip() + '\n'

    def push(self, row):
        try:
            row = row[:self.size_line]
            self._trim_fifo(row)
            with open(self.filename, 'a') as fd:
                fd.write(self._string_conditioned(row))
            return ''
        except NameError:
            raise RuntimeError("Incorrect usage, push requires a string")

    def flush(self):
        with open(self.filename, 'w') as fd:
            fd.truncate(0)  

    def delete(self):
        os.rmdir(self.filename)