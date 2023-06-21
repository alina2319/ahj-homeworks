/* eslint-disable no-plusplus */
import { checkLuhn } from './checkLuhn';
import CardType from './CardType';

function shadowIcons(mode, shadowclass, exclusionClass) {
  const elements = document.querySelectorAll('#logo-group div');
  for (const node of elements) {
    if (!node.classList.contains(exclusionClass)) {
      if (mode) {
        node.classList.add(shadowclass);
      } else {
        node.classList.remove(shadowclass);
      }
      node.classList.remove('selectedcardtype');
    } else {
      node.classList.add('selectedcardtype');
    }
  }
}

document.getElementById('entercard').addEventListener('input', (event) => {
  const entercardTyp = document.getElementById('entercardTyp');
  const text = event.target.value;
  const CardTyp = CardType(text);
  if (CardTyp) {
    entercardTyp.innerText = CardTyp.typ;
    // entercardTyp.classList.remove('invisible');
    shadowIcons(true, 'sn-unselected', CardTyp.classes);
  } else {
    entercardTyp.innerText = '';
    shadowIcons(false, 'sn-unselected', '');
  }
});

document.getElementById('enterbutton').addEventListener('click', (event) => {
  event.preventDefault();
  const myInput = document.getElementById('entercard');
  const checkString = myInput.value;
  const entercardState = document.getElementById('entercardState');
  const result = checkLuhn(checkString);
  if (result.LastDigit === result.calcLastDigit) {
    entercardState.innerText = 'проверено';
    entercardState.classList.remove('invisible');
    entercardState.classList.remove('errormsg');
    entercardState.classList.add('successmsg');
    myInput.classList.remove('invalid');
    myInput.classList.add('valid');
  } else {
    entercardState.innerText = 'ошибка';
    entercardState.classList.remove('invisible');
    entercardState.classList.remove('successmsg');
    entercardState.classList.add('errormsg');
    myInput.classList.add('invalid');
    myInput.classList.remove('valid');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-console
  console.log('Module started!');
});