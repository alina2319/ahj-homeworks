export default class Position {
  constructor() {
    this.prevRandomPosition = 0;
  }

  getRandomPosition() {
    let randomPosition;
    do randomPosition = Math.floor(Math.random() * 16);
    while (this.prevRandomPosition === randomPosition);
    this.prevRandomPosition = randomPosition;
    return randomPosition;
  }
}
