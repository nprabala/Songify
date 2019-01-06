# Jukebox
An app for party playlists

## TBD

* Determine User Music Service. Likely Candidate: Spotify
* Determine Language Platform. Likely Candidates: iOS native (Swift), React Native

# Project Breakdown

## Build Guest Side

* Make an app that can read from user music service
* Generate some kind of Preferences Object from user music library.
* Optional: Allow users to select specific playlists to be scanned by the app.

## Build Host Side

* Compile Preference Objects into a single Preference Object.
* Generate a Playlist from combined preference Object.
* Optional: Build the host side as part of the app.

## Build Interphone Networking

* Hosts can poll for guests
* Guests can send Preferences to Host




### Useful Links

iOS to web API interface:

https://github.com/spotify/ios-sdk


App Credentials and Data Management:

https://developer.spotify.com/dashboard/applications

React Native Spotify API package:

https://github.com/lufinkey/react-native-spotify





