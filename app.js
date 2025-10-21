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
	let currentIndex = 0;

	button.addEventListener('click', () => {
		currentIndex = (currentIndex + 1) % palette.length;
		document.body.style.background = palette[currentIndex];
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

function initContactFormValidation() {
	const form = selectById('contact-form');
	if (!form) return;

	const nameInput = form.querySelector('input[name="name"]');
	const emailInput = form.querySelector('input[name="email"]');
	const passwordInput = form.querySelector('input[name="password"]');
	const confirmInput = form.querySelector('input[name="confirmPassword"]');
	const messageInput = form.querySelector('textarea[name="message"]');
	const formStatus = selectById('form-status');

	function setFieldError(input, message) {
		const field = input.closest('.field');
		const errorElement = field ? field.querySelector('.error-text') : null;
		if (errorElement) {
			errorElement.textContent = message || '';
			errorElement.style.display = message ? 'block' : 'none';
		}
		if (message) {
			input.setAttribute('aria-invalid', 'true');
		} else {
			input.removeAttribute('aria-invalid');
		}
	}

	function clearFormStatus() {
		if (formStatus) {
			formStatus.textContent = '';
			formStatus.className = 'sr-status';
		}
	}

	function setFormSuccess(message) {
		if (formStatus) {
			formStatus.textContent = message;
			formStatus.className = 'sr-status success-text';
		}
	}

	function validateEmail(value) {
		return /.+@.+\..+/.test(value);
	}

	function validateForm() {
		let isValid = true;

		const nameValue = nameInput.value.trim();
		if (nameValue.length < 2) {
			setFieldError(nameInput, 'Имя обязательно и должно быть не короче 2 символов.');
			isValid = false;
		} else {
			setFieldError(nameInput, '');
		}

		const emailValue = emailInput.value.trim();
		if (!validateEmail(emailValue)) {
			setFieldError(emailInput, 'Введите корректный email.');
			isValid = false;
		} else {
			setFieldError(emailInput, '');
		}

		const passwordValue = passwordInput.value;
		if (passwordValue.length < 6) {
			setFieldError(passwordInput, 'Пароль должен быть не короче 6 символов.');
			isValid = false;
		} else {
			setFieldError(passwordInput, '');
		}

		const confirmValue = confirmInput.value;
		if (confirmValue !== passwordValue || confirmValue.length === 0) {
			setFieldError(confirmInput, 'Подтверждение пароля не совпадает.');
			isValid = false;
		} else {
			setFieldError(confirmInput, '');
		}

		if (messageInput && messageInput.value.trim().length > 0) {
			const normalized = messageInput.value.replace(/\s+/g, ' ').trim();
			if (normalized !== messageInput.value) {
				messageInput.value = normalized;
			}
		}

		return isValid;
	}

	[nameInput, emailInput, passwordInput, confirmInput, messageInput].forEach((input) => {
		if (!input) return;
		input.addEventListener('input', () => {
			setFieldError(input, '');
			clearFormStatus();
		});
	});

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		clearFormStatus();
		const isValid = validateForm();
		if (isValid) {
			setFormSuccess('Форма успешно проверена и отправлена (демо).');
			form.reset();
		}
	});
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

document.addEventListener('DOMContentLoaded', () => {
	initCurrentDateTime();
	initBackgroundColorChanger();
	initGuessingGame();
	initContactFormValidation();
	initTodoApp();
	initSortingTool();
});


