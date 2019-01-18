# Mixtape
An app that lets anyone become a songwriter.

## Overview

Everyone, no matter their musical training, has come up with a song. From silly, childish, rhymes, to angsty love songs, to impromptu rap, to parody, and much more,
we all have a song to sing. But unless you're a highly trained songwriter,
it's incredibly difficult to take the melody in your head and turn it into a real song
with full accompaniment. 

Mixtape's goal is to let everyone join in the fun of creating music. We train a machine learning algorithm on popular combinations of melody and chord progressions
so that it can listen to a user's own song, and construct a complimentary accompaniment track.  All you have to do is open, the app, sing, and then Mixtape takes care of the rest! 

Mixtape is a collaboration by the E1 Technical Group's founding members: Lisa Fu, Anthony Mayfield, Nikhil Prabala, and Trevor Tsue.

# Project Structure


## Machine Learning: 

Infrastructure: Python, Pytorch, ???

* Employ deep learning on both melody and instrumental files
* Generate feature matrices for each
* Take in melody inputs from server and produce corresponding chord progressions combo.

## Web Page: 

Infrastructure: Node JS, Angular JS, ???

* Record user audio
* Pass Frequency to server
* Share accompaniment track for download

## Server:

Infrastructure: ???

* Collect user melody from web page
* Break melody into discretized features
* Pass feature vector to machine learning model. 



### (Tentative and perhaps ambitious) Goals And Milestones

* (Week 3) 1/21/19: Complete Basic Design and Needfinding. 
* (Week 4) 1/28/19: Each Project Piece Halfway Complete. ML Features Decided Upon.
* (Week 5) 2/4/19: Web Page Functional. Server Functional. Data Sources Collected.
* (Week 6) 2/11/19: First Round of Training Complete. Begin testing.
* (Week 7) 2/18/19: Continue Testing. Consider Advanced Features and designs. Consider additional training.
* (Week 8) 2/25/19: Continue Testing. Sketch out structure for Mobile Platform.


## Useful Links


Paper on Deep Learning with Music. Authors trained on classical composers and generated new songs from scratch 
while we take in inputs, but we might want to use similar sources of data.

https://cs224d.stanford.edu/reports/allenh.pdf


Music Data for top songs. Seems to be divided into parts (ie, chorus, versus main vocals). Could be useful source of data.
https://www.hooktheory.com/theorytab/view/adele/hello

