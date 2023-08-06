import getTicket from "./functionGetTicket";
import getRemoveTicketWidget from "./removeTicketWidget";
import getAddTicketWidget from "./addTicketWidget";
import getEditTicketWidget from "./editTicketWidget";
import changeTicketStatus from "./functionChangeTicketStatus";
import showTicketDescription from "./functionShowTicketDescription";

// const port = 7070;// for devserver  work
// const serverUrl = `http://localhost:${port}`;// for devserver  work
const serverUrl = "https://ahj-hw-http.herokuapp.com/";

const mainContainer = document.querySelector(".container");
const ticketsContainer = document.querySelector(".tickets-container");
const addTicketButton = document.querySelector(".add-ticket-button");

//  page onload request loading tickets from server
document.addEventListener("DOMContentLoaded", () => {
  // console.log('DOMContentLoaded');
  const xhrLoadTickets = new XMLHttpRequest();
  xhrLoadTickets.open("GET", `${serverUrl}/?method=allTickets`);
  xhrLoadTickets.responseType = "json";
  xhrLoadTickets.addEventListener("load", () => {
    if (xhrLoadTickets.status >= 200 && xhrLoadTickets.status < 300) {
      try {
        // console.log('load from server is ok');
        const responsedTickets = xhrLoadTickets.response;
        // console.log('xhrLoadTickets.response: ', xhrLoadTickets.response);
        if (!responsedTickets.length) return;
        responsedTickets.forEach((ticket) => {
          // console.log(ticket);
          getTicket(ticket, ticketsContainer);

          const currentTicket = ticketsContainer.lastElementChild;
          const ticketStatus = currentTicket.querySelector(".ticket-status");
          const ticketStatusCheckbox = ticketStatus.querySelector(
            ".ticket-status-checkbox"
          );
          if (ticketStatus.dataset.status === "true")
            ticketStatusCheckbox.classList.remove("hidden");
          const ticketName = currentTicket.querySelector(".ticket-name");
          const ticketEdit = currentTicket.querySelector(".ticket-edit-button");
          const ticketRemove = currentTicket.querySelector(
            ".ticket-remove-button"
          );

          //  CHANGE TICKET STATUS

          ticketStatus.addEventListener("click", () => {
            // console.log('ticketStatus.dataset.status: ', ticketStatus.dataset.status);
            changeTicketStatus(
              mainContainer,
              currentTicket,
              ticketStatus,
              ticketStatusCheckbox,
              serverUrl
            );
          });

          //  SHOW DESCRIPTION

          ticketName.addEventListener("click", () => {
            showTicketDescription(
              mainContainer,
              currentTicket,
              ticketName,
              serverUrl
            );
          });

          //  TICKET EDITING

          ticketEdit.addEventListener("click", () => {
            //  pop-up modal window
            getEditTicketWidget(
              mainContainer,
              currentTicket,
              ticketEdit,
              serverUrl
            );
          });

          //  TICKET REMOVING

          ticketRemove.addEventListener("click", () => {
            getRemoveTicketWidget(mainContainer, currentTicket, serverUrl);
          });
        }); // forEach endline
      } catch (e) {
        console.error(e);
        // throw e;
      }
    }
  }); // END OF TICKET LOADING
  xhrLoadTickets.send();

  //  ADD TICKET BUTTON LOGIC
  addTicketButton.addEventListener("click", () => {
    getAddTicketWidget(mainContainer, serverUrl);
  });
}); // DOMload endline
