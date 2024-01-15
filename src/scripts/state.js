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
    gameVelocity: 1e3,
    hitPosition: 0,
    result: 0,
    curretTime: 60,
    lives: 3,
  },
  actions: { timerId: null, countDownTimerId: null },
};

export default state;