Part of this code so far is taken from this following webpage: 

https://randolphburt.co.uk/2014/11/20/writing-an-html5-game-with-no-game-engine-just-angularjs-and-the-html5-canvas/

I went through and scrapped all of the miscellaneous features that drove the game to play, and kept the game loop. 

Of course the server.js is still pulled from Nikhil's first iteration of code. 

Started creating functions in graphics-engine.js to emulate drawing the musical interface we want. 

A lot of it is hard coded at the moment, but should be eventually made to be as robust as possible.

This doesn't deal with 2 controllers at the moment, so if we want to go that route we would have to invest some more time to modify it. Another option we can do is to simply have ng-ifs and a boolean state which tells the website which "page" the user wants to access (such as main page, recording page, etc), and just run the directive according to the ng-if and boolean state. Might be easier to do this.


