const audioPath = "./src/audios/";

const musics = {
  startGameSound: new Audio(audioPath + "swing-110485.mp3"),
  inGameSound: new Audio(audioPath + "life-of-a-wandering-wizard-15549.mp3"),
  gameOverSound: new Audio(audioPath + "game-fail-sounds-104952.mp3"),
};

const screams = ["male-scream-81836.mp3", "male-scream-in-fear-123079.mp3"].map(sound => new Audio(audioPath + sound));
const hitSounds = [
  "accidentally-punching-the-floor-99814.mp3",
  "male_hurt7-48124.mp3",
  "ough-47202.mp3",
  "person-knocked-down-14798.mp3",
  "umph-47201.mp3",
].map(sound => new Audio(audioPath + sound));

export { audioPath, musics, screams, hitSounds };