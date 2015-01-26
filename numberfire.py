import urllib2
import json
from bs4 import BeautifulSoup

req = urllib2.Request('https://www.numberfire.com/nba/fantasy/full-fantasy-basketball-projections')
response = urllib2.urlopen(req)
page = response.read()
soup = BeautifulSoup(page)

variable = str(soup.find_all('script')[2])
data = json.dumps(variable[48:(len(variable)-35)],sort_keys=True, separators=(',',':'))
dataLoad = json.loads(data)

print dataLoad

#with open('data.txt', 'w') as outfile:
#     json.dump(data, outfile, sort_keys = True, indent = 4, ensure_ascii=False, separators=(',',':'))


#print dataLoad['daily_projections']
