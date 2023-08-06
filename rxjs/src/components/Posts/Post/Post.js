import './post.css';
import postHTML from './post.html';
import getFormattedDate from '../../utility/getFormattedDate';
import Comment from './Comment/Comment';

export default class Post {
	constructor(data) {
		this.element = null;
		this.els = {
			commentsList: null,
		};

		this.init(data);
	}

	init(data) {
		let tempWrapEl = document.createElement('div');
		tempWrapEl.insertAdjacentHTML('afterbegin', postHTML);
		this.element = tempWrapEl.querySelector('.post');
		tempWrapEl = null;

		this.element.querySelector('.post__avatar img').src = data.avatar;
		this.element.querySelector('.post__author').textContent = data.author;
		this.element.querySelector('.post__content img').src = data.image;

		this.element.querySelector('.post__date').textContent = getFormattedDate(data.created);

		this.els.commentsList = this.element.querySelector('.list-comments-post');
		this.addComments(data.comments);
	}

	addComments(data) {
		const commentsEls = data.reduce((acc, commentDate) => {
			acc.push(new Comment(commentDate).element);
			return acc;
		}, []);

		this.els.commentsList.append(...commentsEls);
	}
}
