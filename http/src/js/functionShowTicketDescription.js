export default function showTicketDescription(
  mainContainer,
  currentTicket,
  ticketName,
  serverUrl
) {
  if (mainContainer.querySelector(".modal")) return;

  const ticketDescriptionElement = ticketName
    .closest(".ticket-wrapper")
    .querySelector(".ticket-description");
  if (!ticketDescriptionElement.classList.contains("hidden")) {
    ticketDescriptionElement.classList.add("hidden");
    return;
  }

  const requestGetTicketDescriptionUrl = `${serverUrl}/?method=ticketById&id=${currentTicket.dataset.id}`;
  const xhrGetDescription = new XMLHttpRequest();
  xhrGetDescription.open("GET", requestGetTicketDescriptionUrl);
  document.body.style.cursor = "wait";

  xhrGetDescription.addEventListener("load", () => {
    if (xhrGetDescription.status >= 200 && xhrGetDescription.status < 300) {
      try {
        // console.log('description recieved');
        const responsedDescription = xhrGetDescription.response;
        // console.log('xhrGetDescription.response: ', responsedDescription);
        setTimeout(() => {
          document.body.style.cursor = "";
        }, 1000);
        if (!responsedDescription) return;
        ticketDescriptionElement.textContent = responsedDescription;
        ticketDescriptionElement.classList.toggle("hidden");
      } catch (e) {
        console.error(e);
        // throw e;
      }
    }
  });

  xhrGetDescription.send();
}
