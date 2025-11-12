function initContactFormValidation() {
	const form = document.getElementById('contact-form');
	if (!form) return;

	const nameInput = form.querySelector('input[name="name"]');
	const emailInput = form.querySelector('input[name="email"]');
	const passwordInput = form.querySelector('input[name="password"]');
	const confirmInput = form.querySelector('input[name="confirmPassword"]');
	const messageInput = form.querySelector('textarea[name="message"]');
	const formStatus = document.getElementById('form-status');

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
			try {
				const draft = {
					name: nameInput.value,
					email: emailInput.value,
					password: passwordInput.value,
					confirmPassword: confirmInput.value,
					message: messageInput ? messageInput.value : ''
				};
				localStorage.setItem('cr_contact_draft_v1', JSON.stringify(draft));
			} catch (_) {}
		});
	});

	try {
		const raw = localStorage.getItem('cr_contact_draft_v1');
		if (raw) {
			const draft = JSON.parse(raw);
			if (draft && typeof draft === 'object') {
				if (typeof draft.name === 'string') nameInput.value = draft.name;
				if (typeof draft.email === 'string') emailInput.value = draft.email;
				if (typeof draft.password === 'string') passwordInput.value = draft.password;
				if (typeof draft.confirmPassword === 'string') confirmInput.value = draft.confirmPassword;
				if (typeof draft.message === 'string' && messageInput) messageInput.value = draft.message;
			}
		}
	} catch (_) {}

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		clearFormStatus();
		const isValid = validateForm();
		if (isValid) {
			setFormSuccess('Форма успешно проверена и отправлена (демо).');
			form.reset();
			try { localStorage.removeItem('cr_contact_draft_v1'); } catch (_) {}
		}
	});
}


