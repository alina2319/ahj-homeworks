import './comment.css';
import commentHTML from './comment.html';
import getFormattedDate from '../../../utility/getFormattedDate';

export default class Comment {
	constructor(data) {
		this.element = null;
		this.init(data);
	}

	init(data) {
		let tempWrapEl = document.createElement('div');
		tempWrapEl.insertAdjacentHTML('afterbegin', commentHTML);
		this.element = tempWrapEl.querySelector('.comment');
		tempWrapEl = null;

		this.element.querySelector('.comment__avatar img').src = data.avatar;
		this.element.querySelector('.comment__author').textContent = data.author;
		this.element.querySelector('.comment__date').textContent = getFormattedDate(data.created);
		this.element.querySelector('.comment__content').textContent = data.content;
	}
}
