const express = require('express');
const cookieParser = require('cookie-parser');
const logRequest = require('./src/utils/logger');

const fs = require('fs');

const createGameHandlers = require('./src/routes/createGameHandlers.js');
const enrollGameHandlers = require('./src/routes/enrollGameHandlers.js');
const joinGameHandlers = require('./src/routes/joinGameHandlers.js');
const verifyPlayersCount = createGameHandlers.verifyPlayersCount;
const verifyGameId = joinGameHandlers.verifyGameId;

const app = express();

app.fs = fs;
app.games = {};
app.idGenerator = ()=>{
  return new Date().getTime();
};

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

app.get('/game',createGameHandlers.serveHomepage);
app.post('/game/new',verifyPlayersCount,createGameHandlers.createGame);
app.get('/game/join/:gameId',enrollGameHandlers.serveEnrollingForm);
app.post('/game/join/:gameId',enrollGameHandlers.addPlayerToGame);
app.get('/game/:gameId/wait',enrollGameHandlers.serveWaitingPage);
app.post('/game/join',verifyGameId,joinGameHandlers.joinGameHandler);


app.use(express.static('public'));

module.exports = app;
