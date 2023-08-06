import Posts from '../components/Posts/Posts';

export default function main() {
	const posts = new Posts();
	posts.getDataAndRefresh();
}
