import urllib2
import json
from bs4 import BeautifulSoup

req = urllib2.Request('https://www.swishanalytics.com/optimus/optimus-x')
response = urllib2.urlopen(req)
page = response.read()
soup = BeautifulSoup(page)

variable = str(soup.find_all('script')[8])
data = json.dumps(variable[425:(len(variable)-26301)], sort_keys=True, separators=(',',':'))
dataLoad = json.loads(data)

print dataLoad

