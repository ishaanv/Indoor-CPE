import math
import time
import sys

from FileRingBuffer import FileRingBuffer 

filename = 'E:/buffer.txt'
max_rows = 1
max_line = 10

frb = FileRingBuffer(filename, max_rows, max_line)

i = 0
c = "255 0 0"
while(True):

	if i == 1:
		c = "100000"
	elif i == 2:
		c = "001000"
	elif i == 3:
		c = "000010"
		
	frb.push(c)
	i = (i % 3) + 1
	print(i)
	time.sleep(2)
