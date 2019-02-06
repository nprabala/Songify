02/05/19 (lfu2)

-Added draw note functionality in graphics-engine.js, click on screen draws a correpsonding note
-Changed canvas so that scaling issues were fixed
-Created array/global variable that keeps state of all drawn variables (currently notes so far)
-Ability to clear notes that are drawn to the screen

Known issues:
-When canvas is resized, add note functionality does not work. Easy fix would be to add function that rescales canvas when window is resized. 
-I feel like the lines aren't being drawn to the correct scale. Right now everything is pretty blown up 
-We need to snap the drawn notes to the corresponding location on the staff

01/30/19 (lfu2)

Part of this code so far is taken from this following webpage: 

https://randolphburt.co.uk/2014/11/20/writing-an-html5-game-with-no-game-engine-just-angularjs-and-the-html5-canvas/

To run this code: 
-The code currently has a local library for angular files. I put this folder in the Google Drive -> Frontend -> lib. Download the 'lib' folder and put it in the same folder as 'css', 'js', etc. 

About the code:

I went through and scrapped all of the miscellaneous features that drove the game to play, and kept the game loop. 

Of course the server.js is still pulled from Nikhil's first iteration of code. 

Started creating functions in graphics-engine.js to emulate drawing the musical interface we want. 

A lot of it is hard coded at the moment, but should be eventually made to be as robust as possible.

This doesn't deal with 2 controllers at the moment, so if we want to go that route we would have to invest some more time to modify it. Another option we can do is to simply have ng-ifs and a boolean state which tells the website which "page" the user wants to access (such as main page, recording page, etc), and just run the directive according to the ng-if and boolean state. Might be easier to do this.


