# Jukebox
An app for party playlists


# Project Status

## Infrastructure

* User Music Service: Spotify
* Language: iOS native (Swift 4)
* Communication Channel: Bluetooth

## Build Guest Side: (Unassigned)

* Make an app that can read user profile from Spotify
* Extract top songs, artists, and genres from profile
* Convert extracted items into some combination of Spotify API track features (ie, danceability) and explicit song/artist names.

Nice To Have:

* Allow users to request specific songs for the queue. 

## Build Host Side: (Unassigned)

* Accomplish same work as guest side for Jukebox Host.
* Match Preferencs to the user profile that generated them (beginning with host)
* Compile all Preferences into one seed.
* Generate a Playlist from seed using Spotify API.
* Create remove button to remove a user and their Preferences from the collection.

Nice To Have:

* Make playlist features visible to and adjustable by host.


## Build Host-Guest Communications: (Unassigned)

* Hosts are listening for guests.
* Guests can send Preferences to specific host.
* Create leave button for guests to remove themselves from the collection on this Jukebox





### Relevant Links

Spotify iOS sdk:

https://github.com/spotify/ios-sdk

Other Spotify (Web) Apps:

https://developer.spotify.com/community/showcase/

App Credentials and Data Management:

https://developer.spotify.com/dashboard/applications

Track Features For Developing Group Preferences:

https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/

Get recommendations based on Track Features:

https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/

React Native Spotify API package:

https://github.com/lufinkey/react-native-spotify


Info on Mobile Bluetooth Connections:

* This post comes from the mobile game Spaceteam, which does continuous Bluetooth connections (while we only need quick transfers of data), so not all limitations apply equally.

http://spaceteamadmirals.club/blog/the-spaceteam-networking-post/


* This post comes from someone who made an iOS app for communicating between many phones. This will likely be a good source of guidance moving forward.

https://itnext.io/whos-there-simple-swift-app-for-chatting-with-colleagues-around-a88ff765736f




