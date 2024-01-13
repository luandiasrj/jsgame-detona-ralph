const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
    start: document.querySelector("#start"),
    startGame: document.querySelector("#start-game"),
    gameOver: document.querySelector("#game-over"),
    restartGame: document.querySelector("#restart-game"),
    panelRows: document.querySelectorAll(".panel-row"),
    gameTitle: document.querySelector("#game-title"),
    pontuacao: document.querySelector("#pontuacao"),
    ralphImage: document.querySelector("#ralph"),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    result: 0,
    curretTime: 60,
    lives: 3,
  },
  actions: {
    timerId: null,
    countDownTimerId: null,
  },
};
/* Soms e musicas  */
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


/* Nova implementação Funcionando perfeitamente */
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

// Função para tocar um som aleatório de uma lista
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

// Função para parar um som aleatório de uma lista
function stopRandomSound(sound) {
  stopMusic(sound);
}

/* ===================== */

var imagePath = "./src/images/";

function countDown() {
  state.values.curretTime--;
  state.view.timeLeft.textContent = state.values.curretTime;

  if (state.values.curretTime <= 0 || state.values.lives <= 0) {
    stopMusic(musics.inGameSound, 1, true);
    startMusic(musics.gameOverSound, 1, true);
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    state.view.gameOver.classList.remove("hide");
    state.view.panelRows.forEach((panelRow) => panelRow.classList.add("hide"));
    const highScore = updateHighScore();
    updateView(state.values.result <= 60, highScore);
  }
}

function updateView(gameOver, highScore) {
  state.view.ralphImage.src = gameOver
    ? imagePath + "gameover.gif"
    : imagePath + "win.png";
  state.view.ralphImage.style.width = gameOver ? "198px" : "231px";
  state.view.gameTitle.textContent = gameOver ? "Game Over" : "Parabéns!";
  state.view.pontuacao.innerHTML = gameOver
    ? `Você não detonou o Ralph e marcou ${state.values.result} pontos!<br><br>Recorde anterior:<br>${highScore} pontos`
    : `Você detonou o Ralph! <br> Marcou ${state.values.result} pontos! <br><br>Recorde anterior:<br>${highScore} pontos`;
}

var randomHitSound = null;
function randomSquare() {
  state.view.squares.forEach((square) => square.classList.remove("enemy"));
  const randomNumber = Math.floor(Math.random() * 9);
  const randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
  randomHitSound = playRandomSound(screams, 0.2);
}

function handleSquareClick(square) {
  if (square.id === state.values.hitPosition) {
    state.values.result++;
    state.view.score.textContent = state.values.result;
    state.values.hitPosition = null;
    randomHitSound.pause();
    randomHitSound = playRandomSound(hitSounds, 1);
    playSound(audioPath + "hit.m4a", 0.1);
    randomSquare();
  } else {
    if (state.values.lives > 0) {
      state.values.lives--;
      state.view.lives.textContent = state.values.lives;
      const erroSound = playSound(audioPath + "game-fail-sounds-104952.mp3");
      setTimeout(() => erroSound.pause(), 500);
    }
  }
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => handleSquareClick(square));
  });
}

function updateHighScore() {
  const currentScore = state.values.result;
  let highScore = localStorage.getItem("highScore") || 0;

  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem("highScore", highScore);
  }

  return highScore;
}

function startGameHandler() {
  stopMusic(musics.startGameSound, 1, true);
  startMusic(musics.inGameSound, 1, true);
  state.view.start.classList.add("hide");
  state.view.panelRows.forEach((panelRow) => panelRow.classList.remove("hide"));
  state.actions.timerId = setInterval(randomSquare, 1500);
  state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function restartGameHandler() {
  stopMusic(musics.gameOverSound, 1, true);
  startMusic(musics.startGameSound, 1, true);
  state.view.gameOver.classList.add("hide");
  state.view.start.classList.remove("hide");
  state.view.panelRows.forEach((panelRow) => panelRow.classList.add("hide"));
  state.values.curretTime = 60;
  state.values.lives = 3;
  state.values.result = 0;
  state.view.lives.textContent = state.values.lives;
  state.view.timeLeft.textContent = state.values.curretTime;
  state.view.score.textContent = state.values.result;
}

function initialize() {
  startMusic(musics.startGameSound, 1, true);

  state.view.startGame.addEventListener("click", startGameHandler);
  state.view.restartGame.addEventListener("click", restartGameHandler);

  addListenerHitBox();
}

initialize();
