angular.module("mixTapeApp")
    .factory("transcriptionService", ["globalSettings", "utilsService",
        function(globalSettings, utilsService) {

            return {
                startRecording: function() {
                    console.log("startRecording() called");

                    this.audioControl.hidden = true;
                    this.useRecording.disabled = true;

                    navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
                        this.gumStream = stream;
                        this.input = this.audioContext.createMediaStreamSource(stream);
                        // this.input.connect(this.audioContext.destination)

                        this.recorder = new WebAudioRecorder(this.input, {
                            workerDir: "./node_modules/web-audio-recorder-js/lib/",
                            encoding: this.encodingType
                        });

                        this.recorder.onComplete = (recorder, blob) => {
                            this.blob = blob;
                            this.useRecording.disabled = false;

                            var url = URL.createObjectURL(this.blob);
                            this.audioControl.src = url;
                            this.audioControl.controls = true;
                            this.audioControl.hidden = false;
                        }

                        this.recorder.setOptions({
                            timeLimit:120,
                            encodeAfterRecord: this.encodeAfterRecord,
                            ogg: {quality: 0.5},
                            mp3: {bitRate: 160}
                        });

                        this.recorder.startRecording();

                    }).catch((err) => {
                        console.log(err);
                        this.startButton.disabled = false;
                        this.stopButton.disabled = true;
                    });

                    this.startButton.disabled = true;
                    this.stopButton.disabled = false;
                },

                stopRecording: function() {
                    console.log("stopRecording() called");
                    this.gumStream.getAudioTracks()[0].stop();

                    //disable the stop button
                    this.stopButton.disabled = true;
                    this.startButton.disabled = false;

                    this.recorder.finishRecording();
                },

                sendRecording: function() {
                    var req = new XMLHttpRequest();
                    req.open("POST","http://" + utilsService.getHostname() + ":8081/melody_transcription");
                    req.onreadystatechange = function() {
                        console.log(req.response);
                    }

                    var filename = new Date().toISOString() + '.' + globalSettings.encodingType;
                    var fd = new FormData();
                    fd.append("audio_data", this.blob, filename);
                    req.send(fd);
                },

                initialise: function(startButton, stopButton, audioControl, useRecording) {
                    this.gumStream = null;
                    this.recorder = null;
                    this.input = null;
                    this.encodingType = globalSettings.encodingType;
                    this.audioContext = new AudioContext();
                    this.encodeAfterRecord = true;
                    this.constraints = { audio: true, video:false };
                    this.startButton = startButton;
                    this.stopButton = stopButton;
                    this.audioControl = audioControl;
                    this.blob = null;
                    this.useRecording = useRecording;
                }
            }
    }]);
