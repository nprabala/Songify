02/12//19 (lfu2)

* Created chord object in graphics engine service

* Added rendering functionality for displaying chords (in blue), currently the chords are displayed at the x-coordinate of the note that it corresponds to. And they are displayed as quarter notes. This will change

* Incremental updates/patches to UI (for scaling and rendering) to make sure it doesn't break :(

Known issues:

* Should probably store all misc data about a note (location, length, pitch) in its modular component instead of storing as separate array

* Should have a separate visual cue for the notes with different lengths

02/05/19 (lfu2)

* Added draw note functionality in graphics-engine.js, click on screen draws a correpsonding note

* Changed canvas so that scaling issues were fixed (the canvas is now drawn based on percentages and not pixels)

* Created array/global variable that keeps state of all drawn variables (currently notes so far)

* Ability to clear notes that are drawn to the screen

* Fixed draw note functionality so that note locations correspond to a percentage instead of pixels

* Added offset variables in global setting so that when a note is drawn onto the staff, it is centered on where the cursor is 

* Added function to convert current notes on screen to melody (very lightweight and not robust at all, only works for first row of staff.)

* Added in skeleton code for being able to play back music!

Known issues:

* We need to snap the drawn notes to the corresponding location on the staff

* I think resizing vertically may still pose some issues with rescaling 

* Need to make sure melody converter is scalable to other notes

* Audio playback needs to be revised 

Music Files:

* I downloaded clips from youtube for the piano keys (so far only A4 and B4):

* A4: https://www.youtube.com/watch?v=xF6qfxMHXVs

* B4: https://www.youtube.com/watch?v=KUsepGHpizQ

* And then I modified them with Audacity to cut them to around 1sec wav files.
* Note: To run this code, please download the folder in Google Drive -> Frontend -> aud, and place it in the same folder as 'css', js', etc. :) 



02/01/19 (nprabala)

* Added tags to make manual redownload of node libraries unnecessary.

* Removed hardcoding from graphics-engine

* Now can draw multiple measures and multiple systems dynamically

* Created get pitch utility function that generates pitch based on mouse click

Known Issues:

* Math is off for get pitch. I need to revisit how these coordinate systems are working.


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


