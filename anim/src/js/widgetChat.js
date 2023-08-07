export default class WidgetChat {
  constructor() {
    this.container = document.querySelector(".main_container");
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initWidget();
    });
  }

  initWidget() {
    if (!this.container) return;
    const widgetChatHtml = `
    <div data-container="widgetChatContainer" class="widget_chat_container">
      <div data-widget="widgetButton" class="widget_round_button">
      </div>
      <div data-widget="widgetChat" class="widget widget_chat hide">
        <div data-id="widgetChatRemove" class="widget_chat_remove">
          &times;
        </div> 
        <h2>Напишите нам</h2>
        <form data-id="widgetChatForm">  
          <textarea data-id="widgetChatInput" class="widget_chat_input"></textarea>           
          <div class="widget_controls widget_chat_controls"> 
            <button data-id="widgetButton" class="widget_button widget_chat_button">Отправить</button> 
          </div>
        </form>
      </div>
    </div>
    `;

    this.container.insertAdjacentHTML("beforeEnd", widgetChatHtml);

    this.chatWidgetContainer = this.container.querySelector(
      "[data-container=widgetChatContainer]"
    );
    this.chatWidgetButton = this.chatWidgetContainer.querySelector(
      "[data-widget=widgetButton]"
    );
    this.chatWidgetWindow = this.chatWidgetContainer.querySelector(
      "[data-widget=widgetChat]"
    );
    this.chatWidgetWindowCloseBtn = this.chatWidgetWindow.querySelector(
      "[data-id=widgetChatRemove]"
    );

    this.chatWidgetButton.addEventListener("click", ({ target }) => {
      target.classList.add("hide");
      this.chatWidgetWindow.classList.remove("hide");
    });

    this.chatWidgetWindow.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });

    this.chatWidgetWindowCloseBtn.addEventListener("click", () => {
      this.chatWidgetWindow.classList.add("hide");
      this.chatWidgetButton.classList.remove("hide");
    });
  }
}
