// Генерирует и возвращает ссылки для продакшена или разработки в зависимости от того,
// где разворачивается проект.

const url = new URL(window.location.href);

// Параметры для разработки.
if (url.hostname === 'localhost') {
	url.port = '3000';
}

const root = url;
root.pathname = ''; // Убираем ненужный путь (/ru, /en, ...), чтобы ссылка была на корень.

// eslint-disable-next-line import/prefer-default-export
export const links = {
	root: root.href,
};
