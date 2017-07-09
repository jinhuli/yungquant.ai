import csv
import threading
from fetchHist import fetchHist
import numpy as np

class QuantThread (threading.Thread):
    def __init__(self, symbols, strategy):
        threading.Thread.__init__(self)
        self.symbols = symbols
        self.strategy = strategy
    def run(self):
        if self.strategy == 'rev':
            reversionToTheMean(self.symbols)

threads = []
buy = []
sell = []
signals = []
close = []

def createThreadsAndScreen(prompt):
	try:
		strategy = prompt.split(' ')[0]
		universe = prompt.split(' ')[1]
		sig = []
		symbols = []

		with open(universe+'.csv') as csvfile: #open file with universe symbols
			file = csv.reader(csvfile, delimiter=',') #file object
			for row in file:
				symbols.append(row[0])

			remainder = len(symbols) % 6
			symPerThread = int((len(symbols) - remainder)/6)

			#create threads
			for i in range(0, 6):
				if i != 5:
					threads.append(QuantThread(symbols[symPerThread*i:symPerThread*(i+1)], strategy))
				else:
					threads.append(QuantThread(symbols[symPerThread*i:symPerThread*(i+1)+remainder], strategy))
			
			#start threads
			for thread in threads:
				thread.start()
			
			#join threads
			for thread in threads:
				while thread.isAlive():
					continue
				thread.join()

			csvfile.close()
			return signals
	except:
		return []

def reversionToTheMean(symbols):
	for symbol in symbols:
		try: 
			close = fetchHist(symbol)
			thirtyDayMA = np.mean(close[0:29])
			if close[0] < thirtyDayMA:
				buy.append(symbol)
			if close[0] > thirtyDayMA:
				sell.append(symbol)
		except:
			continue
	signals.append(buy)
	signals.append(sell)
	return signals
