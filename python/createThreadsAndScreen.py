import csv
import threading
from fetchHist import fetchHist
import numpy as np
from io import BytesIO
import base64
import matplotlib.pyplot as plt
import random
from scipy.stats import norm

#threading class
class QuantThread (threading.Thread):
	def __init__(self, symbols, strategy):
		threading.Thread.__init__(self)
		self.symbols = symbols
		self.strategy = strategy
	def run(self):
		if self.strategy == 'rev':
			rev(self.symbols)
		if self.strategy == 'mac':
			mac(self.symbols)
		if self.strategy == 'breakout':
			breakout(self.symbols)
		if self.strategy == 'momentum':
			momentum(self.symbols)
		if self.strategy == 'monte':
			monte(self.symbol)

threads = []
buy = []
sell = []
signals = []
close = []

#main method, opens the universe file, reads symbols and starts process of screening
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

			if universe == 'spdr':
				numThreads = 6
			else:
				numThreads = 15


			remainder = len(symbols) % numThreads
			symPerThread = int((len(symbols) - remainder)/numThreads)

			#create threads
			for i in range(0, numThreads):
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
			signals.append(buy)
			signals.append(sell)
			return signals
	except:
		return []


#reversion to the mean, buy when 7 day low and sp closes higher than its 200 day MA
def rev(symbols):
	sp200close = fetchHist('^GSPC')
	sp200MA = np.mean(sp200close[0:199])
	for symbol in symbols:
		try: 
			close = fetchHist(symbol)
			max7 = max(close[0:6])
			min7 = min(close[0:6])
			if close[0] == min7 and sp200close > sp200MA:
				buy.append(symbol)
			if close[0] == max7:
				sell.append(symbol)
		except:
			continue

#moving average crossover
def mac(symbols):
	for symbol in symbols:
		try:
			close=fetchHist(symbol)
			threeMMA = np.mean(close[0:59])
			tenMMA = np.mean(close[0:199])
			if threeMMA > tenMMA:
				buy.append(symbol)
			if tenMMA > threeMMA:
				sell.append(symbol)
		except:
			continue

#basic momentum
def momentum(symbols):
	for symbol in symbols:
		try:
			close = fetchHist(symbol)
			if close[0] > close[len(close)-1]:
				buy.append(symbol)
			else:
				sell.append(symbol)
		except:
			continue

#donchian channel breakouts
def breakout(symbols):
	for symbol in symbols:
		try:
			close = fetchHist(symbol)
			max50 = max(close[0:49])
			min50 = min(close[0:49])
			if close[0] == max50:
				buy.append(symbol)
			if close[0] == min50:
				sell.append(symbol)
		except:
			continue
