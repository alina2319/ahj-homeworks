// eslint-disable-next-line no-console
console.log('Module started!');

const MsgLogContainer = document.querySelector('#msg-log-container');
const MsgTemplate = document.querySelector('#msg-template');
const MsgForm = document.querySelector('#msg-form');
const MsgFormTextButton = MsgForm.querySelector('.msg-form-text-button');
const MsgFormTextArea = MsgForm.querySelector('.msg-form-textarea');
let MessageCounter = 0;

function formatCreaDate(d) {
  const dd = d.getDate();
  const mm = (d.getMonth() + 101).toString().substring(1, 3);
  const hh = d.getHours();
  const minutes = d.getMinutes();
  return `${[d.getFullYear(), mm, dd < 10 ? `0${dd}` : dd].join('-')} ${hh}:${minutes}`;
}

function getGeoLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve(`[${pos.coords.latitude}, ${pos.coords.longitude}]`);
        },
        (err) => { reject(err); },
      );
    } else {
      resolve('');
    }
  });
}

MsgFormTextButton.addEventListener('click', async (evt) => {
  evt.preventDefault();
  const text = MsgFormTextArea.value;
  const dateTime = formatCreaDate(new Date());
  const geo = await getGeoLocation();
  const newMessage = MsgTemplate.cloneNode(true);
  const MsgLogContainerChildren = MsgLogContainer.childNodes;
  if (MsgLogContainerChildren.length > 0) {
    MsgLogContainer.insertBefore(newMessage, MsgLogContainerChildren[0]);
  } else {
    MsgLogContainer.appendChild(newMessage);
  }
  newMessage.classList.remove('nodisp');
  const newMessageDateTime = newMessage.querySelector('.msg-datetime');
  const newMessageText = newMessage.querySelector('.msg-text');
  const newMessageGeo = newMessage.querySelector('.msg-geo');
  newMessageDateTime.innerHTML = dateTime;
  newMessageText.innerHTML = text;
  newMessageGeo.innerHTML = geo;
  // eslint-disable-next-line no-plusplus
  if (++MessageCounter > 6) {
    MsgLogContainer.classList.add('scrollable');
  }
});