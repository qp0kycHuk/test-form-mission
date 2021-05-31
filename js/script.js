
const text = {
	required: 'Заполните поле',
	isEmail: 'Введите корректный e-mail',
	isMobilePhone: 'Введите корректный номер',
}

function addHelper(input, text, error) {
	const field = input.closest('.form-field');
	if (!field) return;
	const helper = field.querySelector('.form-helper') || document.createElement('div');
	helper.classList.add('form-helper');
	helper.textContent = text;
	if (error) field.classList.add('form-field--error')
	if (error) helper.style.color = '#EA4D3D'
	if (!error) helper.style.color = ''
	field.appendChild(helper);


}
function removeHelper(input, text) {
	const field = input.closest('.form-field');

	if (!field) return;
	field.classList.remove('form-field--error');
	const helper = field.querySelector('.form-helper');
	if (!helper) return
	if (text && helper.textContent != text) return


	helper.parentElement.removeChild(helper)

}


function validateInput(input) {
	if (!input.getAttribute('data-validate')) return true;

	let isReady = true;
	if (input.getAttribute('data-validate').includes('is-email')) {
		if (!validator.isEmail(input.value)) {
			isReady = false
			addHelper(input, text.isEmail, true)
		}
	}

	if (input.getAttribute('data-validate').includes('is-phone')) {
		if (!validator.isMobilePhone(input.value.replace(/[^0-9]/g, ''))) {
			isReady = false
			addHelper(input, text.isMobilePhone, true)
		}
	}


	if (input.getAttribute('data-validate').includes('required')) {
		if (validator.isEmpty(input.value)) {
			isReady = false
			addHelper(input, text.required, true)
		}
	}

	if (isReady) {
		removeHelper(input)
	}

	return isReady
}

function validateForm(form) {
	let isReady = true;
	let focusInput;

	const fields = [
		...form.querySelectorAll('input'),
		...form.querySelectorAll('select'),
		...form.querySelectorAll('textarea'),
	]

	fields.map((input) => {
		const isInputReady = validateInput(input)
		if (!isInputReady) isReady = false
		if (!focusInput && !isInputReady) focusInput = input

	})

	if (!isReady) focusInput.focus()


	return isReady
}


function inputHandler(event) {
	const input = event.target;
	validateInput(input)
}



function submitHandler() {
	let flag = true;

	return (event) => {
		event.preventDefault()

		if (!flag) return
		flag = false

		const isReady = validateForm(event.target)
		if (!isReady) {
			flag = true
			return;
		}

		event.target.classList.add('loading')

		const result = document.getElementById('result')
		result.innerHTML = ''

		const promise = new Promise((resolve, reject) => {
			let random = Math.random()
			if (random < 0.1) {
				setTimeout(() => {
					reject({ status: 200, message: 'error' })
				}, 1000)
			}
			else {
				setTimeout(() => {
					resolve({ status: 666, message: 'success' })
				}, 1000)
			}
		})
			.then((response) => {
				result.innerHTML = '<div class="message message-success">' + response.message + '</div>'

			})
			.catch((error) => {
				result.innerHTML = '<div class="message message-error">' + error.message + '</div>'

			})
			.finally(() => {
				flag = true
				event.target.classList.remove('loading')
			})

	}
}

document.addEventListener('input', inputHandler)
document.addEventListener('submit', submitHandler())