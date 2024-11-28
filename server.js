const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  path: "/socket.io",
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
});

const gameState = {
  players: [],
  p1Life: 100,
  p2Life: 100,
  running: false,
  initialized: false,
  textAction: undefined,
  options: ["FIGHT", "FIGMA", "FIREFOX", "FINAL", "FIGJAM"],
  action: 0,
  timing: 0,
  intervalId: null,
  wordIntervalId: null,
};

function getRandonInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getGameStateForClient() {
  const { intervalId, wordIntervalId, ...state } = gameState;
  return state;
}

function startWordCycle() {
  gameState.wordIntervalId = setInterval(() => {
    gameState.action = getRandonInt(0, gameState.options.length);
    gameState.textAction = gameState.options[gameState.action];
    io.emit("game-update", getGameStateForClient());
  }, 2000);
}

function startMatch() {
  console.log("game started");
  clearIntervals();
  gameState.textAction = undefined;
  gameState.action = 3;
  io.emit("game-update", getGameStateForClient());

  gameState.intervalId = setInterval(() => {
    if (gameState.action === 0) {
      clearInterval(gameState.intervalId);
      gameState.initialized = true;
      startWordCycle();
    } else {
      gameState.action--;
      io.emit("game-update", getGameStateForClient());
    }
  }, 1000);
}

function clearIntervals() {
  if (gameState.intervalId) {
    clearInterval(gameState.intervalId);
  }
  if (gameState.wordIntervalId) {
    clearInterval(gameState.wordIntervalId);
  }
}

function resetGame() {
  gameState.p1Life = 100;
  gameState.p2Life = 100;
  gameState.running = false;
  gameState.initialized = false;
  gameState.textAction = undefined;
  gameState.action = 0;
  clearIntervals();
}

io.on("connection", (socket) => {
  console.log("Client conectado...", socket.id);
  if (gameState.players.length >= 2) {
    socket.emit("connection-rejected");
    return;
  }

  gameState.players.push(socket.id);
  socket.emit("player-assigned", { playerId: gameState.players.length });

  socket.on("start-game", () => {
    console.log(gameState.players);
    if (gameState.players.length === 2) {
      resetGame();
      gameState.running = true;
      gameState.initialized = false;
      startMatch();
    }
  });

  socket.on("player-attack", (data) => {
    // Verifica se já houve ataque neste round
    if (gameState.attackedThisRound) {
      return;
    }

    gameState.attackedThisRound = true;

    if (gameState.textAction === "FIGHT") {
      if (data.key === "a") {
        gameState.p2Life -= 20;
      } else if (data.key === "l") {
        gameState.p1Life -= 20;
      }
    } else {
      if (data.key === "a") {
        gameState.p1Life -= 20;
      } else if (data.key === "l") {
        gameState.p2Life -= 20;
      }
    }

    if (gameState.p1Life <= 0 || gameState.p2Life <= 0) {
      gameState.running = false;
      gameState.initialized = false;
      clearIntervals();
    }

    io.emit("game-update", getGameStateForClient());

    // Reset attackedThisRound na próxima palavra
    setTimeout(() => {
      gameState.attackedThisRound = false;
      startMatch();
    }, 1000);
  });

  socket.on("disconnect", () => {
    gameState.players = gameState.players.filter((id) => id !== socket.id);
    if (gameState.players.length < 2) {
      resetGame();
      io.emit("game-update", getGameStateForClient());
    }
  });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

const port = process.env.PORT || 4444;
http.listen(port, () => {
  console.log("Game Start on port " + port);
});
