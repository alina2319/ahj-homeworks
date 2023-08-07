import goblin from '../img/goblin.png';

export default class GamePlay {
  constructor() {
    this.gameEls = {
      hits: null,
      skip: null,
      gameBoard: null,
      startBtn: null,
      gameMessage: null,
      goblin: null,
    };
    this.startBtnListeners = [];
    this.gameBoardListeners = [];
    this.boardSize = 4;
    this.cells = [];
  }

  init() {
    this.gameEls.startBtn = document.querySelector('.start');
    this.gameEls.startBtn.addEventListener('click', this.onStartBtnClick.bind(this));

    this.gameEls.hits = document.querySelector('.hits');
    this.gameEls.skip = document.querySelector('.skip');

    this.gameEls.gameBoard = document.querySelector('.game-board');
    this.gameEls.gameBoard.addEventListener('click', this.onGameBoardClick.bind(this));

    this.gameEls.gameMessage = document.querySelector('.game-message');
    this.createGoblin();
    this.drawBoard();
  }

  onStartBtnClick() {
    this.startBtnListeners.forEach((callback) => callback());
  }

  onGameBoardClick(event) {
    this.gameBoardListeners.forEach((callback) => callback(event.target));
  }

  setInitialValues(skipCount) {
    this.gameEls.hits.textContent = '0';
    this.gameEls.skip.textContent = `${skipCount}`;
  }

  setHitsValue(value) {
    this.gameEls.hits.textContent = `${value}`;
  }

  setSkipValue(value) {
    this.gameEls.skip.textContent = `${value}`;
  }

  showGameMessage() {
    this.gameEls.gameMessage.classList.remove('hidden');
  }

  hideGameMessage() {
    this.gameEls.gameMessage.classList.add('hidden');
  }

  drawBoard() {
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      this.cells.push(cell);
    }
    this.gameEls.gameBoard.append(...this.cells);
  }

  createGoblin() {
    this.gameEls.goblin = document.createElement('img');
    this.gameEls.goblin.classList.add('goblin');
    this.gameEls.goblin.src = goblin;
  }

  showGoblin() {
    this.gameEls.goblin.classList.remove('hidden');
  }

  hideGoblin() {
    this.gameEls.goblin.classList.add('hidden');
  }

  moveGoblin(position) {
    this.cells[position].append(this.gameEls.goblin);
  }
}
