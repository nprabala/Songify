# Jukebox
An app for party playlists

## TBD

* Determine User Music Service. Likely Candidate: Spotify
* Determine Language Platform. Likely Candidates: iOS native (Swift), React Native
* Determine Communication Channel. Bluetooth or WiFi

# Project Breakdown

## Build Guest Side

* Make an app that can read from user music service
* Generate some kind of Preferences Object from user music library.
* Optional: Allow users to select specific playlists to be scanned by the app.

## Build Host Side

* Compile Preference Objects into a single Preference Object.
* Generate a Playlist from combined preference Object.
* Optional: Build the host side as part of the app.

## Build Host-Guest Communications

* Hosts can poll for guests
* Guests can send Preferences to Host




### Relevant Links

iOS to web API interface:

https://github.com/spotify/ios-sdk


App Credentials and Data Management:

https://developer.spotify.com/dashboard/applications

React Native Spotify API package:

https://github.com/lufinkey/react-native-spotify


Info on Mobile Bluetooth Connections:

* This post comes from the mobile game Spaceteam, which does continuous Bluetooth connections (while we only need quick transfers of data), so not all limitations apply equally.

http://spaceteamadmirals.club/blog/the-spaceteam-networking-post/




