function selectById(id) {
	return document.getElementById(id);
}

function createElement(tagName, className, textContent) {
	const element = document.createElement(tagName);
	if (className) element.className = className;
	if (textContent !== undefined) element.textContent = textContent;
	return element;
}

function initCurrentDateTime() {
	const dateTimeElement = selectById('current-datetime');
	if (!dateTimeElement) return;

	function updateTime() {
		const now = new Date();
		const formatted = now.toLocaleString(undefined, {
			dateStyle: 'long',
			timeStyle: 'short'
		});
		dateTimeElement.textContent = formatted;
	}

	updateTime();
	setInterval(updateTime, 1000);
}

function initBackgroundColorChanger() {
	const button = selectById('bg-btn');
	if (!button) return;

	const palette = [
		'#0b0c0f',
		'#10131b',
		'#141a24',
		'#1b2230',
		'#222a3a',
		'#2a3548',
		'#4f8cff',
		'#59d4a9'
	];
	const STORAGE_KEY = 'cr_bg_color';
	let currentIndex = 0;

	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved) {
		const idx = palette.indexOf(saved);
		if (idx >= 0) {
			currentIndex = idx;
			document.body.style.background = saved;
		}
	}

	button.addEventListener('click', () => {
		currentIndex = (currentIndex + 1) % palette.length;
		document.body.style.background = palette[currentIndex];
		try {
			localStorage.setItem(STORAGE_KEY, palette[currentIndex]);
		} catch (_) {}
	});
}

function initGuessingGame() {
	const button = selectById('guess-game-btn');
	if (!button) return;

	button.addEventListener('click', () => {
		const secret = Math.floor(Math.random() * 100) + 1;
		let attempts = 0;
		while (true) {
			const input = prompt('Угадайте число от 1 до 100 (Отмена — выйти):');
			if (input === null) {
				alert('Игра отменена.');
				return;
			}
			const trimmed = String(input).trim();
			if (trimmed.length === 0) {
				alert('Введите число.');
				continue;
			}
			const guess = Number(trimmed.replace(',', '.'));
			if (!Number.isFinite(guess)) {
				alert('Пожалуйста, введите корректное число.');
				continue;
			}
			if (guess < 1 || guess > 100) {
				alert('Число должно быть от 1 до 100.');
				continue;
			}
			attempts++;
			if (guess === secret) {
				alert(`Верно! Загаданное число: ${secret}. Попыток: ${attempts}.`);
				break;
			}
			alert(guess < secret ? 'Мало' : 'Много');
		}
	});
}

function initTheme() {
	const THEME_KEY = 'cr_theme_v1';
	const toggle = selectById('theme-toggle');
	const root = document.documentElement;

	function applyTheme(theme) {
		root.setAttribute('data-theme', theme);
		if (toggle) {
			const isDark = theme === 'dark';
			toggle.setAttribute('aria-pressed', String(isDark));
			toggle.textContent = `Тема: ${isDark ? 'Тёмная' : 'Светлая'}`;
		}
	}

	function getPreferred() {
		const saved = localStorage.getItem(THEME_KEY);
		if (saved === 'dark' || saved === 'light') return saved;
		const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		return prefersDark ? 'dark' : 'light';
	}

	let current = getPreferred();
	applyTheme(current);

	if (toggle) {
		toggle.addEventListener('click', () => {
			current = current === 'dark' ? 'light' : 'dark';
			applyTheme(current);
			try { localStorage.setItem(THEME_KEY, current); } catch (_) {}
		});
	}
}

function initRevealOnScroll() {
	const revealables = document.querySelectorAll('.card, .recipe, .plan-col, .widget-card, .demo-block');
	revealables.forEach((el) => el.classList.add('reveal'));
	if (!('IntersectionObserver' in window)) {
		revealables.forEach((el) => el.classList.add('is-revealed'));
		return;
	}
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-revealed');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.15 });
	revealables.forEach((el) => observer.observe(el));
}

function initLatestPosts() {
	const root = selectById('latest-posts');
	if (!root) return;
	const posts = [
		{ title: 'Паста альфредо', text: 'Сливочная классика за 15 минут.', img: 'public/images/carbonara.jpg', href: 'recipes.html#carbonara' },
		{ title: 'Куриный суп-лапша', text: 'Сытный суп для всей семьи.', img: 'public/images/soup.jpg', href: 'recipes.html#chicken-soup' },
		{ title: 'Греческий салат', text: 'Свежий, яркий и быстрый.', img: 'public/images/greck.jpg', href: 'recipes.html#greek-salad' },
		{ title: 'Чизкейк', text: 'Кремовый десерт к чаю.', img: 'public/images/cheese.jpg', href: 'recipes.html#cheesecake' }
	];
	root.innerHTML = '';
	posts.forEach((p) => {
		const a = createElement('a', 'card');
		a.href = p.href;
		const img = createElement('img');
		img.src = p.img;
		img.alt = p.title;
		const body = createElement('div', 'card-body');
		const h3 = createElement('h3', undefined, p.title);
		const desc = createElement('p', undefined, p.text);
		body.appendChild(h3);
		body.appendChild(desc);
		a.appendChild(img);
		a.appendChild(body);
		root.appendChild(a);
	});
}

function initRecipeSearchAndLikes() {
	const searchInput = selectById('recipe-search-input');
	const articles = Array.from(document.querySelectorAll('article.recipe'));
	const LIKE_KEY = 'cr_recipe_likes_v1';

	function loadLikes() {
		try {
			const raw = localStorage.getItem(LIKE_KEY);
			return raw ? JSON.parse(raw) : {};
		} catch (_) {
			return {};
		}
	}
	function saveLikes(likes) {
		try { localStorage.setItem(LIKE_KEY, JSON.stringify(likes)); } catch (_) {}
	}
	const likes = loadLikes();

	function ensureLikeButtons() {
		articles.forEach((article) => {
			if (article.querySelector('.recipe-like')) return;
			const content = article.querySelector('.recipe-content') || article;
			const btn = createElement('button', 'btn recipe-like', '❤ Нравится');
			btn.type = 'button';
			const id = article.id || content.querySelector('h2')?.textContent || Math.random().toString(36);
			if (likes[id]) btn.classList.add('active');
			btn.addEventListener('click', () => {
				const next = !likes[id];
				likes[id] = next;
				if (!next) delete likes[id];
				btn.classList.toggle('active', next);
				saveLikes(likes);
			});
			content.appendChild(btn);
		});
	}

	function filterArticles(query) {
		const q = (query || '').trim().toLowerCase();
		articles.forEach((article) => {
			const text = article.textContent.toLowerCase();
			article.style.display = q && !text.includes(q) ? 'none' : '';
		});
	}

	if (searchInput) {
		searchInput.addEventListener('input', () => filterArticles(searchInput.value));
	}
	ensureLikeButtons();
}

function initTodoApp() {
	const root = selectById('todo-app');
	if (!root) return;

	const input = root.querySelector('#todo-input');
	const addButton = root.querySelector('#todo-add');
	const list = root.querySelector('#todo-list');
	const error = root.querySelector('#todo-error');

	const STORAGE_KEY = 'cr_todo_items_v1';

	function loadItems() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return [];
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed;
			return [];
		} catch (_) {
			return [];
		}
	}

	function saveItems(items) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		} catch (_) {
		}
	}

	let items = loadItems();

	function showError(message) {
		if (error) {
			error.textContent = message || '';
			error.style.display = message ? 'block' : 'none';
		}
	}

	function render() {
		list.innerHTML = '';
		items.forEach((item, index) => {
			const li = createElement('li', 'todo-item');
			if (item.completed) li.classList.add('completed');

			const label = createElement('label', 'todo-label');

			const checkbox = createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = !!item.completed;
			checkbox.setAttribute('aria-label', 'Отметить выполненным');

			const span = createElement('span', 'todo-text', item.text);

			const deleteButton = createElement('button', 'btn danger', 'Удалить');
			deleteButton.type = 'button';
			deleteButton.setAttribute('aria-label', 'Удалить задачу');

			label.appendChild(checkbox);
			label.appendChild(span);

			li.appendChild(label);
			li.appendChild(deleteButton);
			list.appendChild(li);

			checkbox.addEventListener('change', () => {
				items[index].completed = checkbox.checked;
				saveItems(items);
				render();
			});

			deleteButton.addEventListener('click', () => {
				items.splice(index, 1);
				saveItems(items);
				render();
			});
		});
	}

	function addItem() {
		const raw = (input.value || '').trim();
		if (!raw) {
			showError('Введите задачу.');
			return;
		}
		const normalized = raw.replace(/\s+/g, ' ');
		items.push({ text: normalized, completed: false });
		saveItems(items);
		input.value = '';
		showError('');
		render();
	}

	addButton.addEventListener('click', addItem);
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			addItem();
		}
	});

	render();
}

function initSortingTool() {
	const form = selectById('sorting-form');
	if (!form) return;

	const input = selectById('numbers-input');
	const ascRadio = selectById('order-asc');
	const descRadio = selectById('order-desc');
	const resultElement = selectById('sort-result');
	const errorElement = selectById('sort-error');

	function setError(message) {
		if (errorElement) {
			errorElement.textContent = message || '';
			errorElement.style.display = message ? 'block' : 'none';
		}
	}

	function parseNumbers(value) {
		const tokens = (value || '')
			.replace(/\u00A0/g, ' ')
			.split(/[\s,;]+/)
			.filter(Boolean);
		const numbers = [];
		const invalid = [];
		tokens.forEach((t) => {
			const n = Number(String(t).replace(',', '.'));
			if (Number.isFinite(n)) numbers.push(n);
			else invalid.push(t);
		});
		return { numbers, invalid };
	}

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		setError('');
		const { numbers, invalid } = parseNumbers(input.value);
		if (numbers.length === 0) {
			setError('Введите одно или несколько чисел, разделённых запятыми или пробелами.');
			resultElement.textContent = '';
			return;
		}
		if (invalid.length > 0) {
			setError(`Игнорированы нечисловые значения: ${invalid.join(', ')}`);
		}
		const ascending = ascRadio && ascRadio.checked;
		const sorted = numbers.slice().sort((a, b) => ascending ? a - b : b - a);
		resultElement.textContent = sorted.join(', ');
	});
}

function initWeatherWidget() {
	const citySelect = selectById('weather-city');
	const refreshBtn = selectById('weather-refresh');
	const output = selectById('weather-output');
	if (!citySelect || !refreshBtn || !output) return;

	const STORAGE_KEY = 'cr_weather_city_v1';
	const cities = [
		{ key: 'almaty', name: 'Алматы', latitude: 43.238949, longitude: 76.889709, timezone: 'auto' },
		{ key: 'astana', name: 'Астана', latitude: 51.1605, longitude: 71.4704, timezone: 'auto' },
		{ key: 'shymkent', name: 'Шымкент', latitude: 42.3154, longitude: 69.5869, timezone: 'auto' },
		{ key: 'moscow', name: 'Москва', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow' },
		{ key: 'london', name: 'Лондон', latitude: 51.5072, longitude: -0.1276, timezone: 'Europe/London' }
	];

	function getCityByKey(key) {
		return cities.find(c => c.key === key) || cities[0];
	}

	function setLoading(isLoading) {
		output.textContent = isLoading ? 'Загрузка...' : output.textContent;
	}

	async function fetchWeather(cityKey) {
		const city = getCityByKey(cityKey);
		setLoading(true);
		try {
			const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(city.latitude)}&longitude=${encodeURIComponent(city.longitude)}&current_weather=true&timezone=${encodeURIComponent(city.timezone)}`;
			const res = await fetch(url);
			if (!res.ok) throw new Error('Network error');
			const data = await res.json();
			const cw = data && data.current_weather;
			if (!cw) throw new Error('No data');
			const temp = Math.round(Number(cw.temperature));
			const wind = Math.round(Number(cw.windspeed));
			const time = cw.time ? new Date(cw.time).toLocaleString() : '';
			output.textContent = `${city.name}: ${temp}°C, ветер ${wind} м/с${time ? ` (${time})` : ''}`;
		} catch (e) {
			output.textContent = 'Не удалось загрузить погоду. Попробуйте позже.';
		} finally {
			setLoading(false);
		}
	}

	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved) citySelect.value = saved;

	citySelect.addEventListener('change', () => {
		const key = citySelect.value;
		try { localStorage.setItem(STORAGE_KEY, key); } catch (_) {}
		fetchWeather(key);
	});
	refreshBtn.addEventListener('click', () => fetchWeather(citySelect.value));

	fetchWeather(citySelect.value);
}

document.addEventListener('DOMContentLoaded', () => {
	initTheme();
	initCurrentDateTime();
	initBackgroundColorChanger();
	initGuessingGame();
	initContactFormValidation();
	initTodoApp();
	initSortingTool();
	initWeatherWidget();
	initLatestPosts();
	initRecipeSearchAndLikes();
	initRevealOnScroll();
});


