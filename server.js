const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Statische Dateien (Frontend)
app.use(express.static("public"));

// Spielverwaltung
let games = {};

function createBoard() {
    return Array.from({ length: 6 }, () => Array(7).fill(null));
}

function checkWin(board, player) {
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (board[r][c] !== player) continue;
            for (const [dr, dc] of directions) {
                let count = 0;
                for (let k = 0; k < 4; k++) {
                    const nr = r + dr * k, nc = c + dc * k;
                    if (board[nr] && board[nr][nc] === player) count++;
                }
                if (count === 4) return true;
            }
        }
    }
    return false;
}

io.on("connection", (socket) => {
    console.log("Spieler verbunden:", socket.id);

    socket.on("joinGame", (roomId) => {
        if (!games[roomId]) {
            games[roomId] = { board: createBoard(), players: [] };
        }
        const game = games[roomId];

        if (game.players.length < 2) {
            game.players.push(socket.id);
            socket.join(roomId);
            socket.emit("joined", { player: game.players.length });
            if (game.players.length === 2) {
                io.to(roomId).emit("startGame");
            }
        } else {
            socket.emit("full");
        }
    });

    socket.on("move", ({ roomId, column, player }) => {
        const game = games[roomId];
        if (!game) return;
        for (let r = 5; r >= 0; r--) {
            if (!game.board[r][column]) {
                game.board[r][column] = player;
                io.to(roomId).emit("boardUpdate", { board: game.board });
                if (checkWin(game.board, player)) {
                    io.to(roomId).emit("win", player);
                }
                break;
            }
        }
    });
});

// Port für Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Statische Dateien (Frontend)
app.use(express.static("public"));

// Spielverwaltung
let games = {};

function createBoard() {
    return Array.from({ length: 6 }, () => Array(7).fill(null));
}

function checkWin(board, player) {
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            if (board[r][c] !== player) continue;
            for (const [dr, dc] of directions) {
                let count = 0;
                for (let k = 0; k < 4; k++) {
                    const nr = r + dr * k, nc = c + dc * k;
                    if (board[nr] && board[nr][nc] === player) count++;
                }
                if (count === 4) return true;
            }
        }
    }
    return false;
}

io.on("connection", (socket) => {
    console.log("Spieler verbunden:", socket.id);

    socket.on("joinGame", (roomId) => {
        if (!games[roomId]) {
            games[roomId] = { board: createBoard(), players: [] };
        }
        const game = games[roomId];

        if (game.players.length < 2) {
            game.players.push(socket.id);
            socket.join(roomId);
            socket.emit("joined", { player: game.players.length });
            if (game.players.length === 2) {
                io.to(roomId).emit("startGame");
            }
        } else {
            socket.emit("full");
        }
    });

    socket.on("move", ({ roomId, column, player }) => {
        const game = games[roomId];
        if (!game) return;
        for (let r = 5; r >= 0; r--) {
            if (!game.board[r][column]) {
                game.board[r][column] = player;
                io.to(roomId).emit("boardUpdate", { board: game.board });
                if (checkWin(game.board, player)) {
                    io.to(roomId).emit("win", player);
                }
                break;
            }
        }
    });
});

// Port für Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
