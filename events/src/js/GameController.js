import Position from './Position';

export default class GameController {
  constructor(gamePlay) {
    this.gamePlay = gamePlay;
    this.isGameRunning = false;
    this.goblinDelay = 1000;
    this.position = new Position();
    this.try = { success: false };
    this.hits = 0;
    this.skip = { maxCount: 5, currentCount: undefined };
  }

  init() {
    this.gamePlay.init();
    this.gamePlay.startBtnListeners.push(this.onStartBtnClick.bind(this));
    this.gamePlay.gameBoardListeners.push(this.onGameBoardClick.bind(this));
    this.gamePlay.setInitialValues(this.skip.maxCount);
  }

  onStartBtnClick() {
    if (this.isGameRunning) return;
    this.isGameRunning = true;
    this.gamePlay.setInitialValues(this.skip.maxCount);
    this.hits = 0;
    this.skip.currentCount = this.skip.maxCount;
    this.gamePlay.hideGameMessage();
    setTimeout(() => {
      this.gamePlay.showGoblin();
      this.gamePlay.moveGoblin(this.position.getRandomPosition());
      const intervalID = setInterval(() => {
        if (!this.try.success) {
          this.skip.currentCount -= 1;
          this.gamePlay.setSkipValue(this.skip.currentCount);
          if (this.skip.currentCount === 0) {
            clearInterval(intervalID);
            this.gamePlay.hideGoblin();
            this.gamePlay.showGameMessage();
            this.isGameRunning = false;
          }
        }
        this.try.success = false;
        this.gamePlay.moveGoblin(this.position.getRandomPosition());
      }, this.goblinDelay);
    }, this.goblinDelay);
  }

  onGameBoardClick(target) {
    if (!this.isGameRunning) return;
    if (this.try.success) return;
    if (target.classList.contains('goblin')) {
      this.try.success = true;
      this.hits += 1;
      this.gamePlay.setHitsValue(this.hits);
    }
  }
}
