from collections import deque
import time
from tqdm import tqdm

filename = 'F:\\buffer.txt'
max_rows = 10
max_line = 10

d = deque(maxlen=max_rows)



from FileRingBuffer import FileRingBuffer as fbr

fbr = fbr(filename,max_rows,max_line)
x = ''
j = 0
with open(filename, 'r+') as f:
    for i in tqdm(range(100)):
    # for j in range(3):
    #     x = x + str(j) + 'oaljkdfg\n'
          
        # d.append(str(i))
        
        # f.write(d[0])
            
        j = (j+1)%3
        if j == 0:
            colour = '255 0 0'
        elif j == 1:
            colour = '0 0 255'
        elif j == 2:
            colour = '0 255 0'

        # fbr.push(colour)
        d.append(colour)
        j = i % 10
        f.write(d[j] + '\n')
        # if i % 10 == 0:
        #     f.truncate(0)


        time.sleep(0.1)

    
