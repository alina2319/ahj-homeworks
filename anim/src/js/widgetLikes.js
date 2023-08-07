import heart from "../img/heart.png";

export default class WidgetLikes {
  constructor() {
    this.container = document.querySelector(".main_container");
    this.like = `<img src='${heart}' data-id="heart" class="heart" alt='heart'>`;
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initWidget();
    });
  }

  createLike() {
    this.widgetLikes = this.container.querySelector(
      "[data-widget=widgetLikes]"
    );
    this.widgetLikes.insertAdjacentHTML("afterBegin", this.like);
    this.likeElement = this.widgetLikes.querySelector("[data-id=heart]");
    const randomFlight = Math.ceil(4 * Math.random());
    this.likeElement.classList.add(`heart_flight${randomFlight}`);
    return this.likeElement;
  }

  initWidget() {
    if (!this.container) return;
    const widgetLikesHtml = `
    <div data-widget="widgetLikes" class="widget_likes">
      <button data-id="widgetLikesButton" class="widget_likes_button">Like</button>    
    </div>
    `;

    this.container.insertAdjacentHTML("beforeEnd", widgetLikesHtml);
    this.likesButton = this.container.querySelector(
      "[data-id=widgetLikesButton]"
    );

    this.likesButton.addEventListener("mousedown", (evt) => {
      evt.preventDefault();
    });

    this.likesButton.addEventListener("click", () => {
      if (!this.like) return;
      this.createLike().addEventListener("animationend", ({ target }) => {
        target.remove();
      });
    });
  }
}
