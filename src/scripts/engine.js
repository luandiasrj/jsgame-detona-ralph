import state from './state.js';
import {audioPath, hitSounds, musics, screams} from './audio.js';
import {playRandomSound, playSound, startMusic, stopMusic} from './musicControl.js';
const squares = document.querySelectorAll(".square");
let userClicked = false,
    intervalTime = 2000,
    slideInDuration = 700,
    slideOutDuration = slideInDuration * 0.5;
const imagePath = "./src/images/";
function countDown() {
    state.values.curretTime --;
    state.view.timeLeft.textContent = state.values.curretTime;
    if (state.values.curretTime<= 0 || state.values.lives <= 0) { stopMusic(musics.inGameSound, 1, true); startMusic(musics.gameOverSound, 1, true); clearInterval(state.actions.countDownTimerId); clearInterval(state.actions.timerId); state.view.gameOver.classList.remove("hide"); state.view.panelRows.forEach((panelRow) => panelRow.classList.add("hide")); const highScore = updateHighScore(); updateView(state.values.result <= 60, highScore); }
}

function updateView(gameOver, highScore) {
    state.view.ralphImage.src = gameOver ? imagePath + "gameover.gif" : imagePath + "win.png"; state.view.ralphImage.style.width = gameOver ? "198px" : "231px"; state.view.gameTitle.textContent = gameOver ? "Game Over" : "Parabéns!"; state.view.pontuacao.innerHTML = gameOver ? `Você não detonou o Ralph e marcou ${state.values.result} pontos!<br><br>Recorde anterior:<br>${highScore} pontos` : `Você detonou o Ralph! <br> Marcou ${state.values.result} pontos! <br><br>Recorde anterior:<br>${highScore} pontos`;
}

let randomHitSound = null;

function randomSquare() {
    if (!userClicked) { clearMole(); if (!document.querySelector(".enemy")) { let randomSquare = squares[Math.floor(Math.random() * squares.length)]; randomSquare.classList.add("enemy"); state.values.hitPosition = randomSquare.id; randomHitSound = playRandomSound(screams, 0.2); setTimeout(() => { }, slideInDuration); } }
}

function clearMole() {
    squares.forEach(square => {
        if (square.classList.contains("enemy")) {
            square.classList.add("enemy-out");
            setTimeout(() => {
                square.classList.remove("enemy-out");
                square.classList.remove("enemy");
            }, slideOutDuration);
        }
    }) 
    
}

function updateGameSettings() {
    slideInDuration = slideInDuration > 66 ? slideInDuration - 10 : 66;
    slideOutDuration = slideInDuration * 0.5;
    intervalTime = Math.max(intervalTime - 19, slideInDuration + slideOutDuration);
    document.documentElement.style.setProperty("--slideIn-duration", `${slideInDuration}ms`);
    document.documentElement.style.setProperty("--slideOut-duration", `${slideOutDuration}ms`);
}

function handleSquareClick(square) {
    if (square.id === state.values.hitPosition) {
        userClicked = true;
        clearInterval(state.actions.timerId);
        updateGameSettings();
        state.values.result ++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        randomHitSound.pause();
        randomHitSound = playRandomSound(hitSounds, 1);
        playSound(audioPath + "hit.m4a", 0.1);
        square.classList.add("enemy-out");
        setTimeout(() => {
            square.classList.remove("enemy");
            square.classList.remove("enemy-out");
            userClicked = false;
            state.actions.timerId = setInterval(randomSquare, intervalTime);
            randomSquare();
        }, slideOutDuration);
    } else {
        if (state.values.lives > 0) {
            state.values.lives --;
            state.view.lives.textContent = state.values.lives;
            const erroSound = playSound(audioPath + "game-fail-sounds-104952.mp3");
            setTimeout(() => erroSound.pause(), 500);
        }
    }
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

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => handleSquareClick(square));
    });
}

function startGameHandler() {
    stopMusic(musics.startGameSound, 1, true);
    startMusic(musics.inGameSound, 1, true);
    state.view.start.classList.add("hide");
    state.view.panelRows.forEach((panelRow) => panelRow.classList.remove("hide"));
    state.actions.timerId = setInterval(randomSquare, intervalTime);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function restartGameHandler() {
    stopMusic(musics.gameOverSound, 1, true);
    startMusic(musics.startGameSound, 1, true);
    state.view.gameOver.classList.add("hide");
    state.view.start.classList.remove("hide");
    state.view.panelRows.forEach((panelRow) => panelRow.classList.add("hide"));
    state.view.lives.textContent = state.values.lives = 3;
    state.view.timeLeft.textContent = state.values.curretTime = 60;
    state.view.score.textContent = state.values.result = 0;
    intervalTime = 2000;
    slideInDuration = 700;
    slideOutDuration = slideInDuration * 0.5;
    document.body.offsetHeight; // leitura forçada
    document.documentElement.style.setProperty("--slideIn-duration", `${slideInDuration}ms`);
    document.documentElement.style.setProperty("--slideOut-duration", `${slideOutDuration}ms`);
}

function initialize() {
    startMusic(musics.startGameSound, 1, true);
    state.view.startGame.addEventListener("click", startGameHandler);
    state.view.restartGame.addEventListener("click", restartGameHandler);
    addListenerHitBox();
}

initialize();
