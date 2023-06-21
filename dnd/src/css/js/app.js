/* eslint-disable no-plusplus */
// import CardType from '/src/CardType.js';

const Folder1 = document.querySelector('[data-id=Folder1]');
const Folder2 = document.querySelector('[data-id=Folder2]');
const Folder3 = document.querySelector('[data-id=Folder3]');
const Col1Add = document.querySelector('[data-id=Col1_add]');
const Col2Add = document.querySelector('[data-id=Col2_add]');
const Col3Add = document.querySelector('[data-id=Col3_add]');

const dndObj = {
  ghostEl: null,
  dragEl: null,
  keepReserveEl: document.createElement('div'),
  keepReserveParent: null,
};

function removeDel() {
  let criteria = true;
  while (criteria) {
    const toDel = document.querySelector('.dragged');
    if (toDel) {
      const parentel = toDel.parentNode;
      parentel.removeChild(toDel);
    } else {
      criteria = false;
    }
  }
}

function SaveContent(name, el) {
  removeDel();
  const saveArr = [];
  const arr = Array.prototype.slice.call(el.childNodes);
  arr.forEach((o) => {
    // console.log(o);
    if (typeof (o.classList) !== 'undefined') {
      const classList = Array.prototype.slice.call(o.classList);
      if (classList.includes('Subfolder-Item')) {
        saveArr.push(JSON.stringify({ item: o.innerHTML }));
      }
    }
  });
  localStorage.setItem(name, saveArr);
}

// Delete selected element by click
function OptDoRemove(evt) {
  evt.preventDefault();
  let el;
  // console.log(evt.target.classList);
  if (evt.target.classList.contains('Subfolder-Item')) {
    el = evt.target;
  } else {
    el = evt.target.parentElement;
  }

  const arr = Array.prototype.slice.call(el.childNodes);
  const p = arr.find((o) => o.nodeName.toUpperCase() === 'P');
  let label = '';
  if (p) {
    label = ` "${p.innerText}"`;
  }
  /* eslint-disable no-alert */
  /* eslint-disable no-restricted-globals */
  if (confirm(`Delete element${label}?`)) {
    el.parentElement.removeChild(el);
    SaveContent('Folder1', Folder1);
    SaveContent('Folder2', Folder2);
    SaveContent('Folder3', Folder3);
  }
}

// ready for deletion
function OptRemove(evt) {
  // evt.preventDefault();
  let el;
  if (evt.target.classList.contains('Subfolder-Item')) {
    el = evt.target;
  } else {
    el = evt.target.parentElement;
  }
  const div = document.createElement('div');
  el.appendChild(div);
  div.classList.add('delete-box');
  div.style.top = `${el.offsetTop + 10}px`;
  div.addEventListener('click', OptDoRemove);
}

// mouse out element
function EndOptRemove(evt) {
  let delbox = evt.target.querySelector('.delete-box');
  while (delbox) {
    evt.target.removeChild(delbox);
    delbox = evt.target.querySelector('.delete-box');
  }
}

// function removeMouseEvents(div) {

// }

// Element drag
function OptMouseMove(evt) {
  evt.preventDefault();
  dndObj.ghostEl = evt.target;
  if (!dndObj.ghostEl) { return; }
  dndObj.ghostEl.style.left = `${evt.pageX - dndObj.ghostEl.offsetWidth / 2}px`;
  dndObj.ghostEl.style.top = `${evt.pageY - dndObj.ghostEl.offsetHeight / 2}px`;
  const ar = document.elementsFromPoint(evt.clientX, evt.clientY);
  const closest = ar.find((o) => o.nodeName.toUpperCase() === 'DIV' && o.classList.contains('Subfolder-Item') && !o.classList.contains('dragged'));
  dndObj.keepReserveParent = ar.find((o) => o.nodeName.toUpperCase() === 'DIV' && o.classList.contains('Subfolder') && !o.classList.contains('dragged'));
  if (closest) {
    const parent = closest.parentElement;
    parent.insertBefore(dndObj.keepReserveEl, closest);
    dndObj.keepReserveEl.style.width = `${dndObj.dragEl.offsetWidth}px`;
    dndObj.keepReserveEl.style.height = `${dndObj.dragEl.offsetHeight}px`;
    // dndObj.keepReserveEl.classList.add('Subfolder-Item');
  } else if (dndObj.keepReserveParent && dndObj.keepReserveEl) {
    dndObj.keepReserveParent.appendChild(dndObj.keepReserveEl);
    dndObj.keepReserveEl.style.width = `${dndObj.dragEl.offsetWidth}px`;
    dndObj.keepReserveEl.style.height = `${dndObj.dragEl.offsetHeight}px`;
    // dndObj.keepReserveEl.classList.add('Subfolder-Item');
  }
}

// Element drag end
function OptDragEnd() {
  if (!dndObj.dragEl) {
    return;
  }
  removeDel();

  if (dndObj.keepReserveEl) {
    const parent = dndObj.keepReserveEl.parentElement;
    parent.insertBefore(dndObj.dragEl, dndObj.keepReserveEl);
  } else if (dndObj.keepReserveParent) {
    dndObj.keepReserveParent.appendChild(dndObj.dragEl);
  }

  if (dndObj.keepReserveEl) {
    const parentel = dndObj.keepReserveEl.parentNode;
    parentel.removeChild(dndObj.keepReserveEl);
  }

  dndObj.ghostEl = null;
  dndObj.dragEl = null;

  // save state here
  SaveContent('Folder1', Folder1);
  SaveContent('Folder2', Folder2);
  SaveContent('Folder3', Folder3);
}

// Element Dragstart (mousedown)
function OptMouseDown(evt) {
  evt.preventDefault();
  if (!evt.target.classList.contains('Subfolder-Item')) {
    if (!evt.target.classList.contains('delete-box')) {
      dndObj.pageX = evt.pageX;
      dndObj.pageY = evt.pageY;
      // console.log(evt.target,evt.pageX,evt.pageY);
      evt.target.parentNode.dispatchEvent(new Event('mousedown'));
    } else {
      evt.target.dispatchEvent(new Event('click'));
    }
    return;
  }
  if (evt.pageX) { dndObj.pageX = evt.pageX; }
  if (evt.pageY) { dndObj.pageY = evt.pageY; }
  // console.log(evt.target, evt.pageX, evt.pageY);
  dndObj.dragEl = evt.target;
  // console.log('DnD', dndObj.dragEl);
  dndObj.ghostEl = dndObj.dragEl.cloneNode(true);
  dndObj.ghostEl.classList.add('dragged');
  let toDel = dndObj.ghostEl.querySelector('.delete-box');
  while (toDel) {
    dndObj.ghostEl.removeChild(toDel);
    toDel = dndObj.ghostEl.querySelector('.delete-box');
  }
  document.body.appendChild(dndObj.ghostEl);
  dndObj.ghostEl.style.left = `${dndObj.pageX - dndObj.ghostEl.offsetWidth / 2}px`;
  dndObj.ghostEl.style.top = `${dndObj.pageY - dndObj.ghostEl.offsetHeight / 2}px`;
  dndObj.ghostEl.addEventListener('mousemove', OptMouseMove); // Element drag
  dndObj.ghostEl.addEventListener('mouseup', OptDragEnd); // Element drag
}

function setMouseEvents(div) {
  div.addEventListener('mouseover', OptRemove); // ready for deletion
  div.addEventListener('mouseout', EndOptRemove); // mouse out element
  // div.addEventListener('click', OptDoRemove);       // Delete selected element by click
  div.addEventListener('mousedown', OptMouseDown); // Element Dragstart
}

function LoadContent(name, el) {
  const app = JSON.parse(`[${localStorage.getItem(name)}]`);
  app.forEach((o) => {
    if (o && Object.keys(o).includes('item')) {
      const div = document.createElement('div');
      div.innerHTML = o.item;
      el.appendChild(div);
      div.classList.add('Subfolder-Item');
      setMouseEvents(div);
    }
  });
  // console.log(name, app);
}

// Adding topic element
function addElement02(evt) {
  evt.preventDefault();
  const ItemEnterForm = document.querySelector('[data-id=Item_Enter_Form]');
  const FormDataTitle = document.querySelector('[data-id=Form_Data_Title]');
  const el = ItemEnterForm.parentNode;
  const text = FormDataTitle.value;
  if (text) {
    const div = document.createElement('div');
    div.innerHTML = `<p class="Item-Content">${text}</p>`;
    el.appendChild(div);
    div.classList.add('Subfolder-Item');
    setMouseEvents(div);
  }
  ItemEnterForm.classList.add('invisible');
  SaveContent('Folder1', Folder1);
  SaveContent('Folder2', Folder2);
  SaveContent('Folder3', Folder3);
}

// Requesting topic
function addElement01(evt) {
  const el = evt.target.parentNode;
  if (el) {
    const ItemEnterForm = document.querySelector('[data-id=Item_Enter_Form]');
    const FormDataTitle = document.querySelector('[data-id=Form_Data_Title]');
    const FormDataButton = document.querySelector('[data-id=Form_Data_Button]');
    FormDataButton.addEventListener('click', addElement02);
    ItemEnterForm.classList.remove('invisible');
    el.appendChild(ItemEnterForm);
    FormDataTitle.value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-console
  console.log('Module started!');
  LoadContent('Folder1', Folder1);
  LoadContent('Folder2', Folder2);
  LoadContent('Folder3', Folder3);
  Col1Add.addEventListener('click', addElement01);
  Col2Add.addEventListener('click', addElement01);
  Col3Add.addEventListener('click', addElement01);
});