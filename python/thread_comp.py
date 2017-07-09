import csv
import time
from fetchHist import fetchHist
import numpy as np

startTime = time.time()
sig = []
symbols = []
signals = []
with open('sp100.csv') as csvfile: #open file with employee postal codes
	file = csv.reader(csvfile, delimiter=',') #file object
	for row in file:
		try:
			close = fetchHist(row[0])
			thirtyDayMA = np.mean(close[0:30])
			if close[0] < thirtyDayMA:
				signals.append(row[0])
		except:
			continue
			
csvfile.close()
print(signals)
print(time.time() - startTime)