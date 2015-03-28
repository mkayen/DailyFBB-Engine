# DailyFBB-Engine

The Purpose of DailyFBB-Engine is to generate "the best lineup", or the lineup with the highest projected point output in a given day. 
The data powering this script is from numberfire (www.numberfire.com) & swish analytics (www.swishanalytics.com).

The current iteration of this script only works with numberfire data & fanduel (www.fanduel.com) pricing. Would love for collaborators to
help broaden the scope of this project. Refer to the bottom for contribution ideas - Would appreciate the help!

Hopefully this script can help set the best lineup without effort.

# How to use it

Prerequisites:
	Node

1) Download all files from this page, and make sure they are at the same level in a folder.

2) In Terminal, move into the folder (ex cd /Downloads/DailyFBB-Engine )

3) Once in the folder in Terminal, make sure to run numberfire.py, and write the results to output.json

		node numberfire.js > output.json

4) Also, you'll need to run the swish file in terminal as well:

		node swish.js > outputSwish.json
		
5) Once the output file is updated, run query.js in terminal

		node query.js
		
That's it.

# Filters

Its important to change the filters to help change the weight of your results. For instance, if you would like to consider SGs who will score 30+ fantasy points but SFs who will score 25+ fantasy points, you can change these levers by changing the third parameter for the executed functions on lines 33-37 in query.js. In a future release, I will be creating a way to change these filters from directly in the command line.

# Ways to Contribute:
There's a million ways, but here's a few. 

1) Use Algorithm for other sports (Baseball, Football)

2) Update Algorithm to report on Draft Kings projections

3) Adding Roto & other data sources.


  
  
