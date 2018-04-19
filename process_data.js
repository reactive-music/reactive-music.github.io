/* Script which maintains emotion data, determining whether each emotion is significant, and updating music accordingly */

var ticks_maintained = {};  // Format: {"emotion": [number_maintained_ticks, average_over_maintained]}
var NECESSARY_TICKS = 5;
var VERY_VALUE = 50;
var AUDIO_TRACKS = ['angry_guitar', 'angry_piano', 'general_bass', 'happy_piano', 'happy_violin', 'general_guitar'];

function isSignificant(emotion) {
    /* Determine if a givin emotion is significant in the viewer's face */
    return ticks_maintained[emotion][0] > NECESSARY_TICKS;
}

function isVery(emotion) {
    /* Determine if the given emotion is very strong */
    return isSignificant(emotion) && ticks_maintained[emotion][1] > VERY_VALUE;
}


function initValues(emotions) {
    /* Call once to initialize the ticks_maintained object */
    for (var emotion in emotions.keys()) {
        ticks_maintained[emotion] = [0, 0];
    }
}


function updateSmoother(emotions) {
    /* Call every tick to keep isSignificant up-to-date */
    for (var emotion in emotions.keys()) {
        emotion_val = emotions[emotion];
        if (emotion_val > 0) {
            var curr_avg = ticks_maintained[emotion][1];
            var curr_ticks = ticks_maintained[emotion][0];
            var new_average = (curr_avg * curr_ticks + emotion_val) / (curr_ticks + 1);
            ticks_maintained[emotion] = [curr_ticks + 1, new_average];
        } else {
            ticks_maintained[emotion] = [0, 0];
        }
    }
}


function startMusic() {
    /* Begins playing all tracks */
    for (var track in AUDIO_TRACKS) {
        $("#" + track)[0].play();
    }
}

function neutral() {
    /* Update music for neutral */
    for (var track in AUDIO_TRACKS) {
        if (track.startsWith("general")) {
            $("#" + track).prop("volume", 1);
        } else {
            $("#" + track).prop("volume", 0);
        }
    }
}

function veryAngry() {
    /* Update music for very angry */
    for (var track in AUDIO_TRACKS) {
        if (track.startsWith("general") || track.startsWith("angry")) {
            $("#" + track).prop("volume", 1);
        } else {
            $("#" + track).prop("volume", 0);
        }
    }
}

function veryHappy() {
    /* Update music for very happy */
    for (var track in AUDIO_TRACKS) {
        if (track.startsWith("general") || track.startsWith("happy")) {
            $("#" + track).prop("volume", 1);
        } else {
            $("#" + track).prop("volume", 0);
        }
    }
}

function happy() {
    /* Update music for very happy */
    for (var track in AUDIO_TRACKS) {
        if (track.startsWith("general") || track == "happy_piano") {
            $("#" + track).prop("volume", 1);
        } else {
            $("#" + track).prop("volume", 0);
        }
    }
}

function angry() {
    /* Update music for very happy */
    for (var track in AUDIO_TRACKS) {
        if (track.startsWith("general") || track == "angry_piano") {
            $("#" + track).prop("volume", 1);
        } else {
            $("#" + track).prop("volume", 0);
        }
    }
}



function updateMusic(emotions) {
    /* Changes music tracks in accordance with current emotional significance 
    
    Primary function to be called once per tick
    */
    updateSmoother();
    if(isVery("happy")) {
        veryHappy();
    } else if (isVery("anger")) {
        veryAngry();
    } else if (isSignificant("happy")) {
        happy();
    } else if (isSignificant("anger")) {
        angry();
    }
}