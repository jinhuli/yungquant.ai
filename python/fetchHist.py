import pandas_datareader.data as web
import datetime
import requests

def fetchHist(symbol):
	year, month, day = str(datetime.date.today()).split('-')
	start = datetime.datetime(int(year)-1, int(month), int(day))
	end = datetime.datetime(int(year), int(month), int(day))
	f = web.DataReader(symbol, 'yahoo', start, end)
	return list(f['Adj Close'])[::-1]


def new():
	url = "https://api.robinhood.com/quotes/historicals/AAPL"
	r = requests.get(url)
	print(r.json)

new()