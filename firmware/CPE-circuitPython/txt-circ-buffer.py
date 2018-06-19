    #!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#       fifo(.py)
#       
#       Copyright 2011 Fabio Di Bernardini <fdb@altraqua.com>
#       
#       This program is free software; you can redistribute it and/or modify
#       it under the terms of the GNU General Public License as published by
#       the Free Software Foundation; either version 2 of the License, or
#       (at your option) any later version.
#       
#       This program is distributed in the hope that it will be useful,
#       but WITHOUT ANY WARRANTY; without even the implied warranty of
#       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#       GNU General Public License for more details.
#       
#       You should have received a copy of the GNU General Public License
#       along with this program; if not, write to the Free Software
#       Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#       MA 02110-1301, USA.
import sys
import os

def string_conditioned(string):
    '''
    Ensures ends with \n only
    '''
    # return string.decode('string_escape').rstrip() + '\n'
    print("STR: {}".format(string))
    return string.rstrip() + '\n'

def pop(n, size_rows, filename):
    with open(filename, 'r+U') as fd:
        rows = fd.readlines()
    with open(filename, 'w') as fd:
        n = int(n)
        fd.writelines(rows[n:])
        return ''.join(rows[:n])

def trim_fifo(row, size_rows, filename):
    size_rows = int(size_rows)
    with open(filename, 'rU') as fd:
        rows = fd.readlines()
    num_rows = len(rows)
    print(row)
    if num_rows >= size_rows:
        n = string_conditioned(row).count('\n')
        pop(num_rows + n - size_rows, size_rows, filename)

def push(row, size_rows, filename, size_line=100):
    size_line = int(size_line)
    row = row[:size_line]
    trim_fifo(row, size_rows, filename)
    with open(filename, 'a') as fd:
        fd.write(string_conditioned(row))
    return ''

def flush(filename):
    with open(filename, 'w') as fd:
        fd.truncate(0)  

def delete(filename):
    os.rmdir(filename)

def main():
    import sys
    # try:
    command   = sys.argv[1]
    param     = sys.argv[2]
    size_rows = sys.argv[3]
    filename  = sys.argv[4]

    # print("cmd: {}\nparam: {}\nsize_rows: {}\nfile: {}".format(command,param,size_rows,filename))

    if len(sys.argv) > 5:
        size_line  = sys.argv[5]
        sys.stdout.write({
        '--push': push,
        '--pop' : pop,
        }[command](param, size_rows, filename, size_line))
    else:
        sys.stdout.write({
        '--push': push,
        '--pop' : pop,
        }[command](param, size_rows, filename))
    # except Exception as e:
    #     # print(r)
    #     print(e)
"""
Use:
       fifo --push ROW MAX_ROWS FILE
       fifo --pop  NUM MAX_ROWS FILE


fifo implements a ring buffer of lines of text, when inserted
a line that exceeds the maximum number of lines (MAX_ROWS) deletes the line
older.

Commands:
  --push    queues the ROW text line in the FILE by removing the oldest lines
            if the file exceeds MAX_ROWS. Use '\n' to separate multiple lines.
  --pop     prints the first NUM lines and removes them from the FILE. MAX_ROWS comes
            ignored but must still be specified.

Examples:
       fifo --push 'row_one \n row_two' 10 fifo.txt
       fifo --pop 2 10 fifo.txt
"""


if __name__ == '__main__':
    main()