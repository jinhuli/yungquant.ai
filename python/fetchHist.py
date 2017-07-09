import requests

def fetchHist(symbol):
	url = 'http://www.google.com/finance/historical?q='+symbol+'&output=csv'
	response = requests.get(url)
	data = response._content.decode().split('\n')
	data.pop(0)
	data.pop(len(data)-1)
	close = []
	for row in data:
		close.append(float(row.split(',')[4]))

	return close
	
