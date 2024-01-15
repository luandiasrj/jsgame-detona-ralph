function startMusic(music, volume = 1, loop = false) {
  music.volume = volume;
  music.loop = loop;
  music.play();
}

function playSound(path, volume = 1) {
  const sound = new Audio(path);
  sound.volume = volume;
  sound.play();
  return sound;
}


function playRandomSound(soundArray, volume = 1) {
  const randomIndex = Math.floor(Math.random() * soundArray.length);
  const randomSound = soundArray[randomIndex];
  startMusic(randomSound, volume);
  return randomSound;
}

function stopMusic(music) {
  music.pause();
  music.currentTime = 0;
}

function stopRandomSound(sound) {
  stopMusic(sound);
}


export { startMusic, stopMusic, playSound, playRandomSound, stopRandomSound };