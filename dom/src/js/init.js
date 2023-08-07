export default class Character {
  constructor(elem) {
    this.cell = elem.querySelectorAll(".grid-cell");
    this.icon = elem.querySelector(".icon");
  }

  getRandomPosition() {
    let previous = 0;
    let i = 0;

    setInterval(() => {
      while (i === previous) {
        i = Math.floor(Math.random() * (this.cell.length - 1));
      }

      previous = i;
      this.cell[i].appendChild(this.icon);
    }, 1000);
  }
}
