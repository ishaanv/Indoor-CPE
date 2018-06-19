from tqdm import tqdm
from FileRingBuffer import FileRingBuffer 

filename = 'test.txt'
max_rows = 100
max_line = 100

frb = FileRingBuffer(filename, max_rows, max_line)

for i in tqdm(range(10000)):
    frb.push(str(i) + "______" + str(i/2) + "______" + str(i/4))
