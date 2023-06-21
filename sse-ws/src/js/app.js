/* eslint-disable no-plusplus */
import Message from './message';

let WorkStatus = 'off';
let CurrentUser;
const users = [];
const chat = [];

const loginForm = document.querySelector('#login-popup-template');
const chatTemplate = document.querySelector('#chat-template');
const PopupLoginButton = document.querySelector('#popup-loginbutton');
const ChatSubmitButton = document.querySelector('#chat-submitbutton');
const DispUser = document.querySelector('#disp-user');
const MZtbody = document.querySelector('#mz_tbody');
const ChatClearButton = document.querySelector('#chat-clear');

const ws = new WebSocket('wss://anikolaevski-ahj10-ws.herokuapp.com/ws');
// const ws = new WebSocket('ws://localhost:7070/ws');
ws.binaryType = 'blob'; // arraybuffer

function outMessage(text, typ) {
  const mess = new Message({
    user: CurrentUser,
    typ,
    text,
  });
  ws.send(JSON.stringify(mess));
}

function DisplayUsers() {
  if (DispUser) {
    // console.log('users', users);
    let txt = '<ul>';
    for (const user of users) {
      txt += `<li>${user.name} ${(user.isMe) ? ' (Вы)' : ''} </li>`;
    }
    txt += '</ul>';
    DispUser.innerHTML = txt;
  }
}

function SaveContent(name) {
  // console.log('save',chat);
  localStorage.setItem(name, JSON.stringify(chat));
}

function formatCreaDate(d) {
  const dd = d.getDate();
  const mm = (d.getMonth() + 101).toString().substring(1, 3);
  const hh = d.getHours();
  const minutes = d.getMinutes();
  // console.log(mm);
  // eslint-disable-next-line prefer-template
  return [d.getFullYear(), mm, dd < 10 ? `0${dd}` : dd].join('-') + ` ${hh}:${minutes}`;
}

function RefillListTbody() {
  MZtbody.innerHTML = '';

  for (const el of chat) {
    // eslint-disable-next-line no-undef
    const time = formatCreaDate(new Date(el.created));
    const NewMess = document.createElement('div');
    MZtbody.appendChild(NewMess);
    if (el.user === CurrentUser) {
      NewMess.classList.add('showRight');
    } else {
      NewMess.classList.add('showLeft');
    }
    NewMess.innerHTML = `<span class="showUser">${el.user}</span>, ${time} ${el.text}`;
  }
  SaveContent(`Chat${CurrentUser}`);
  // console.log('save chat',chat);
}

function clearChat() {
  chat.splice(0, chat.length);
  RefillListTbody();
}

function LoadContent(name) {
  // const data = JSON.parse(`[${localStorage.getItem(name)}]`);
  const data = JSON.parse(localStorage.getItem(name));
  // console.log('data', data);
  // console.log('before load', chat);
  if (data) {
    chat.splice(0, chat.length);
    for (const row of data) {
      // console.log('row',row);
      chat.push(row);
    }
  }
  // console.log('after load', chat);
}

ws.addEventListener('open', () => {
  // eslint-disable-next-line no-console
  console.log('connected');
  // After this we can send messages
});

ws.addEventListener('close', (evt) => {
  // eslint-disable-next-line no-console
  console.log('connection closed', evt);
  // After this we can't send messages
  // chatTemplate.classList.add('nodisp');
  // loginForm.classList.remove('nodisp');
  window.location.reload();
});

ws.addEventListener('error', () => {
  // eslint-disable-next-line no-console
  console.log('error');
});

// Show Chat UI elements, start chat events
function startUI4chat() {
  loginForm.classList.add('nodisp');
  LoadContent(`Chat${CurrentUser}`);
  chatTemplate.classList.remove('nodisp');
  DispUser.classList.remove('nodisp');
  MZtbody.classList.remove('nodisp');
  const x = () => { outMessage('hello!', 'handshake'); };
  x();
  setInterval(x, (20000 + (Math.random() * 10) - 5)); // бомбимся на сервер, т.к. он рубит коннект
}

function inMessage(data) {
  if (!data.includes('{')) { return; }
  const mess = JSON.parse(data);
  console.log(mess);

  if (!Object.keys(mess).includes('user')) { return; }
  // Разбор сообщения/пользователей

  if (mess.typ === 'userReject' && mess.user === CurrentUser) {
    WorkStatus = 'off';
    // eslint-disable-next-line no-alert
    window.alert(`Пользователь "${CurrentUser}" уже существует! Зайдите под другим именем.`);
  } else if ((mess.typ === 'newUser' && WorkStatus === 'on')
  || (mess.typ === 'userAccept' && mess.user === CurrentUser)) {
    for (const item of JSON.parse(mess.text)) {
      // console.log(item);
      if (!users.find((o) => o.name === item.name)) {
        users.push({
          name: item.name,
          isMe: (item.name === CurrentUser),
        });
        WorkStatus = 'on';
        startUI4chat();
      }
    }
    chat.push({
      id: mess.id,
      created: mess.created,
      user: mess.user,
      typ: mess.typ,
      text: 'Вошел в чат',
    });
  } else if (mess.typ === 'message' && !chat.find((o) => o.id === mess.id)) {
    chat.push(mess);
  } else if (mess.typ === 'released') {
    const released = JSON.parse(mess.text);
    // eslint-disable-next-line no-console
    console.log('released', released);
    for (const remuser of released) {
      const k = users.findIndex((o) => o.name === remuser.name);
      // console.log('remuser', remuser, 'k', k);
      if (k > -1) {
        users.splice(k, 1);
      }
      chat.push({
        id: mess.id,
        created: new Date(),
        user: remuser.name,
        typ: mess.typ,
        text: 'Вышел из чата',
      });
    }
    DisplayUsers();
  }

  // Показ сообщения
  RefillListTbody();

  // Обновление списка пользователей
  DisplayUsers();
}

function requestUser() {
  if (!CurrentUser) {
    if (!loginForm) { return; }
    loginForm.classList.remove('nodisp');
  }
}

function submitLogin(evt) {
  evt.preventDefault();
  const PopupFldName = document.querySelector('#popup_fld_name');
  if (!PopupFldName) { return; }
  CurrentUser = PopupFldName.value;
  outMessage(JSON.stringify([{
    name: CurrentUser,
    isMe: true,
  }]), 'newUser');

  ws.addEventListener('message', (ev) => {
    // handle evt.data
    inMessage(ev.data);
    // console.log(evt.data);
  });

  // startUI4chat();
}

function submitMessage(evt) {
  evt.preventDefault();
  const ChatFldName = document.querySelector('#chat_fld_name');
  if (!ChatFldName) { return; }
  const text = ChatFldName.value;

  if (DispUser && text) {
    outMessage(text, 'message');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-console
  console.log('Module started!');
  requestUser();
});

PopupLoginButton.addEventListener('click', submitLogin);
ChatSubmitButton.addEventListener('click', submitMessage);
ChatClearButton.addEventListener('click', clearChat);