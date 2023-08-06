function editTicketCancelButtonHandler(mainContainer) {
  if (!mainContainer) return;

  const widgetEditTicket = mainContainer.querySelector(
    "[data-widget=editTicket]"
  );
  const editTicketForm = widgetEditTicket.querySelector(
    "[data-id=editTicket-form]"
  );
  const editTicketCancelButton =
    widgetEditTicket.querySelector("[data-id=cancel]");

  editTicketCancelButton.addEventListener("click", () => {
    // console.log('form_click_cancel_button');
    editTicketForm.reset();
    widgetEditTicket.remove();
  });
}

function editTicketSubmitHandler(mainContainer, ticketEdit, serverUrl) {
  if (!mainContainer) return;

  const widgetEditTicket = mainContainer.querySelector(
    "[data-widget=editTicket]"
  );
  const editTicketForm = widgetEditTicket.querySelector(
    "[data-id=editTicket-form]"
  );
  const editTicketNameInput = widgetEditTicket.querySelector("[data-id=name]");
  const editingTicketID = ticketEdit.closest(".ticket-wrapper").dataset.id;
  const editingTicketName = ticketEdit
    .closest(".ticket-wrapper")
    .querySelector(".ticket-name").textContent;
  const editingTicketStatus = ticketEdit
    .closest(".ticket-wrapper")
    .querySelector(".ticket-status").dataset.status;
  editTicketNameInput.value = editingTicketName;

  editTicketForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // console.log('form_submit');
    const inputName = editTicketForm.name.value.trim();
    const inputDescription = editTicketForm.description.value.trim();
    if (inputName === "") return;

    const formData = new FormData();
    formData.append("id", editingTicketID);
    formData.append("name", inputName);
    formData.append("description", inputDescription);
    formData.append("status", editingTicketStatus);
    formData.append("created", new Date().toLocaleString());
    // console.log('EditTicket_formData: ', Array.from(formData.entries()));

    const requestEditTicketUrl = `${serverUrl}/?method=editTicket`;
    const xhrEditTicket = new XMLHttpRequest();
    xhrEditTicket.open("POST", requestEditTicketUrl);
    document.body.style.cursor = "wait";
    widgetEditTicket.style.cursor = "wait";

    xhrEditTicket.addEventListener("load", () => {
      if (xhrEditTicket.status >= 200 && xhrEditTicket.status < 300) {
        try {
          // console.log('ticket edited');
          setTimeout(() => {
            document.body.style.cursor = "";
            widgetEditTicket.style.cursor = "";
            document.location.reload();
          }, 1000);
        } catch (e) {
          console.error(e);
          // throw e;
        }
      }
    });

    editTicketForm.reset();
    widgetEditTicket.remove();

    xhrEditTicket.send(formData);
  }); // SUBMIT endline
}

function createRequestTicketDescription(
  mainContainer,
  currentTicket,
  serverUrl
) {
  //  ********************************************************
  // если описание ранее не было подгружено нажатием на тикет,
  // то его не буддет в editingTicketDescription
  // здесь делаем запрос на сервер,
  // чтобы подгрузить описание для редактирования,
  //  иначе отправка пустого описания затрет описание тикета, хранящееся на сервере
  //  ********************************************************
  if (!mainContainer) return;
  const widgetEditTicket = mainContainer.querySelector(
    "[data-widget=editTicket]"
  );
  const editTicketDescriptionInput = widgetEditTicket.querySelector(
    "[data-id=description]"
  );
  const requestGetTicketDescriptionUrl = `${serverUrl}/?method=ticketById&id=${currentTicket.dataset.id}`;
  const xhrGetDescription = new XMLHttpRequest();
  xhrGetDescription.open("GET", requestGetTicketDescriptionUrl);

  xhrGetDescription.addEventListener("load", () => {
    if (xhrGetDescription.status >= 200 && xhrGetDescription.status < 300) {
      try {
        // console.log('description recieved');
        const responsedDescription = xhrGetDescription.response;
        // console.log('xhrGetDescription.response: ', responsedDescription);
        if (!responsedDescription) return;
        editTicketDescriptionInput.value = responsedDescription;
      } catch (e) {
        console.error(e);
        // throw e;
      }
    }
  });

  xhrGetDescription.send();
}

export default function getEditTicketWidget(
  mainContainer,
  currentTicket,
  ticketEdit,
  serverUrl
) {
  // if active modal already exist
  if (mainContainer.querySelector(".modal")) return;
  //  pop-up modal window
  const widgetEditTicketHtml = `
    <div data-widget="editTicket" class="modal widget-edit">
    <h2>Редактировать тикет</h2>  
    <form data-id="editTicket-form" class="widget-form">
      <label>
        Краткое описание
          <textarea rows=1 data-id="name" name="name" required class="widget-input"></textarea>
      </label>
      <label>
        Подробное описание
          <textarea rows=3 data-id="description" name="description" class="widget-input"></textarea>
      </label>
      <div class="widget-form-controls">
        <button data-id="cancel" class="widget-button">Отмена</button>  
        <button type="submit" data-id="ok" class="widget-button">Ок</button> 
      </div>     
    </form>
    </div>
    `;

  mainContainer.insertAdjacentHTML("beforeEnd", widgetEditTicketHtml);

  createRequestTicketDescription(mainContainer, currentTicket, serverUrl);
  editTicketCancelButtonHandler(mainContainer);
  editTicketSubmitHandler(mainContainer, ticketEdit, serverUrl);
}
