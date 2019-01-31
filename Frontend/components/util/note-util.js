function NoteUtil () {}

NoteUtil.createNote = function (duration, x, y) {
	Note = {};
	Note.x = x;
	Note.y = y;
	Note.duration = duration;
	Note.pitch = getPitch(y);
	return Note;
}

NoteUtil.getPitch = function (y) {
	//returns string of which pitch
}