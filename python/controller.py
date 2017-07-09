import time
from createThreadsAndScreen import createThreadsAndScreen
import sys
import os
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)
prompt = sys.argv[1]

start_time = time.time()
signals = createThreadsAndScreen(prompt)
if signals:
	print('Buy: ' + str(signals[0]))
	print('Sell: ' + str(signals[1]))




