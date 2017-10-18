import matplotlib
matplotlib.use('Agg')
from fetchHist import fetchHist
import numpy as np
from io import BytesIO
import base64
import matplotlib.pyplot as plt
import random
from scipy.stats import norm
import sys
import os
import math


def monte(symbol):
	data = fetchHist(symbol) #get last 60 days
	data = data[0:60]
	data = list(reversed(data))
	numSims = 0
	MC = {'price': -1}
	expect = []
	#hundred simulations
	while numSims < 100:
		numSims = numSims + 1
		MC[str(numSims)] = monte_carlo(data, 60)
		del(data[-60:])
	for i in range(0,60):
		today = []
		for key in MC:
			if key != 'price':
				today.append(MC[key][i])
		expect.append(np.mean(today))
	image = BytesIO()
	plt.plot(np.arange(0,60,1), expect)
	plt.title(symbol.upper())
	plt.xlabel('Days')
	plt.ylabel('Price ($)')
	plt.savefig(image, format='png')
	img = base64.b64encode(image.getvalue())
	return img

def monte_carlo(orig, days):
	count = 0
	mc = []
	while count<days:
		pdr = []
		count = count + 1
		for i in range(1,len(orig)-1):
			pdr.append(math.log(orig[i]/orig[i-1])) #periodic daily return
		adr = np.mean(pdr) #average daily return
		standDev = np.std(pdr)
		x = random.random()
		drift = 0 #small look ahead period
		Rval = norm.ppf(x, loc=adr, scale=standDev)
		price = orig[len(orig)-1]*np.exp(Rval+drift)
		orig.append(price)
		mc.append(orig[len(orig)-1])
	return mc

abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)
prompt = sys.argv[1]
symbol = prompt.split(' ')[1]
print(monte(symbol))