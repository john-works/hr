	(() => {
	/* ========== Configuration ========== */
	// Set your API base URL here - change this to point to your backend
	let apiUrl = 'http://192.168.32.151:8041/api/v1';
	const user = getUser();
	/* ----- Elements ----- */
	const authArea = document.getElementById('authArea');
	const applicationDashboard = document.getElementById('applicationDashboard');
	const mainNavbar = document.getElementById('mainNavbar');
	const userDropdown = document.getElementById('userDropdown');
	const navbarUserName = document.getElementById('navbarUserName');
	const btnLogout = document.getElementById('btnLogout');
	const loginForm = document.getElementById('loginForm');
	const registerForm = document.getElementById('registerForm');
	const verifyEmailForm = document.getElementById('verifyEmailForm');
	const showLoginBtn = document.getElementById('showLogin');
	const showRegisterBtn = document.getElementById('showRegister');

	// Current step in app
	let currentStep = 'selectJob';
	// Check if in browse mode
	const urlParams = new URLSearchParams(window.location.search);
	const isBrowseMode = urlParams.get('mode') === 'browse';

	// Bootstrap modal for CRUD
	const crudModalEl = document.getElementById('crudModal');
	const crudModal = new bootstrap.Modal(crudModalEl);
	const crudForm = document.getElementById('crudForm');
	const crudModalLabel = document.getElementById('crudModalLabel');
	const crudModalBody = document.getElementById('crudModalBody');
	const crudItemIdInput = document.getElementById('crudItemId');
	const crudSaveBtn = document.getElementById('crudSaveBtn');

	// Sidebar nav
	const sidebarNav = document.getElementById('sidebarNav');
	const mainPanel = document.getElementById('mainPanel');

	/* ----- Session Management ---- */
	function getSession() {
		const sessionStr = localStorage.getItem('userSession');
		if (!sessionStr) return null;
		try {
		return JSON.parse(sessionStr);
		} catch {
		return null;
		}
	}

	function setSession(sessionObj) {
		localStorage.setItem('userSession', JSON.stringify(sessionObj));
	}

	function clearSession() {
		localStorage.removeItem('userSession');
		localStorage.removeItem('user');
		localStorage.removeItem('token');
	}

	function getUser() {
		const userStr = localStorage.getItem('user');
		if (!userStr) return null;
		try {
			return JSON.parse(userStr);
		} catch {
			return null;
		}
	}

	function getToken() {
		return localStorage.getItem('token');
	}

	/* ----- Toast Notification Utility ----- */
	function showToast(message, type = 'info', duration = 4000) {
		const toastContainer = document.getElementById('toastContainer');
		
		// Create toast element
		const toastId = 'toast-' + Date.now();
		const toastHTML = `
		<div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
			<div class="toast-header ${type}">
			<strong class="me-auto">
				${type === 'success' ? '<i class="fas fa-check-circle me-2"></i>' : ''}
				${type === 'error' ? '<i class="fas fa-exclamation-circle me-2"></i>' : ''}
				${type === 'warning' ? '<i class="fas fa-exclamation-triangle me-2"></i>' : ''}
				${type === 'info' ? '<i class="fas fa-info-circle me-2"></i>' : ''}
				${type.charAt(0).toUpperCase() + type.slice(1)}
			</strong>
			<button type="button" class="btn-close toast-close" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body">
			${message}
			</div>
		</div>
		`;
		
		toastContainer.insertAdjacentHTML('beforeend', toastHTML);
		const toastEl = document.getElementById(toastId);
		const bsToast = new bootstrap.Toast(toastEl, {
		autohide: true,
		delay: duration
		});
		
		bsToast.show();
		
		// Remove element from DOM after it's hidden
		toastEl.addEventListener('hidden.bs.toast', () => {
		toastEl.remove();
		});
	}

	/* ----- Authentication UI Toggle ----- */
	function showLoginForm() {
		loginForm.style.display = 'block';
		registerForm.style.display = 'none';
		verifyEmailForm.style.display = 'none';
	}
	function showRegisterForm() {
		loginForm.style.display = 'none';
		registerForm.style.display = 'block';
		verifyEmailForm.style.display = 'none';
	}
	function showVerifyEmailForm(email) {
		loginForm.style.display = 'none';
		registerForm.style.display = 'none';
		verifyEmailForm.style.display = 'block';
		document.getElementById('verifyEmailText').textContent = email;
	}

	/* ----- Display logic based on session ----- */
	function showDashboard() {
		// Hide all other areas
		authArea.style.display = 'none';
		const homePage = document.getElementById('homePage');
		if (homePage) homePage.style.display = 'none';
		
		// Show app area and navbar
		applicationDashboard.style.display = 'block';
		mainNavbar.style.display = 'flex';
		document.body.classList.remove('auth-view');
		
		// Show default step (selectJob)
		showStep('personalDetails');
	}

	function showAuth() {
		// Hide all other areas
		applicationDashboard.style.display = 'none';
		mainNavbar.style.display = 'none';
		const homePage = document.getElementById('homePage');
		if (homePage) homePage.style.display = 'none';
		
		// Show auth area
		authArea.style.display = 'block';
		document.body.classList.add('auth-view');
	}

	function showHomePage() {
		// Hide all other areas
		authArea.style.display = 'none';
		applicationDashboard.style.display = 'none';
		
		// Show home page and navbar
		const homePage = document.getElementById('homePage');
		if (homePage) homePage.style.display = 'block';
		
		// Show/hide auth sidebar based on session
		const authSidebar = document.getElementById('authSidebar');
		const user = getSession();
		if (authSidebar) {
			authSidebar.style.display = user ? 'none' : 'block';
			// Reset to login form when showing homepage
			if (!user) {
				showLoginFormSidebar();
			}
		}
		
		mainNavbar.style.display = 'flex';
		document.body.classList.remove('auth-view');
	}

	/* ----- Event Listeners for Auth Toggle ----- */
	if (showRegisterBtn) {
		showRegisterBtn.addEventListener('click', (e) => {
			e.preventDefault();
			showRegisterForm();
		});
	}
	if (showLoginBtn) {
		showLoginBtn.addEventListener('click', (e) => {
			e.preventDefault();
			showLoginForm();
		});
	}

	/* ----- Sidebar Authentication UI Toggle ----- */
	function showLoginFormSidebar() {
		const loginForm = document.getElementById('loginFormSidebar');
		const registerForm = document.getElementById('registerFormSidebar');
		const verifyForm = document.getElementById('verifyEmailFormSidebar');
		if (loginForm) loginForm.style.display = 'block';
		if (registerForm) registerForm.style.display = 'none';
		if (verifyForm) verifyForm.style.display = 'none';
	}

	function showRegisterFormSidebar() {
		const loginForm = document.getElementById('loginFormSidebar');
		const registerForm = document.getElementById('registerFormSidebar');
		const verifyForm = document.getElementById('verifyEmailFormSidebar');
		if (loginForm) loginForm.style.display = 'none';
		if (registerForm) registerForm.style.display = 'block';
		if (verifyForm) verifyForm.style.display = 'none';
	}

	function showVerifyEmailFormSidebar(email) {
		const loginForm = document.getElementById('loginFormSidebar');
		const registerForm = document.getElementById('registerFormSidebar');
		const verifyForm = document.getElementById('verifyEmailFormSidebar');
		const emailText = document.getElementById('verifyEmailTextSidebar');
		if (loginForm) loginForm.style.display = 'none';
		if (registerForm) registerForm.style.display = 'none';
		if (verifyForm) verifyForm.style.display = 'block';
		if (emailText) emailText.textContent = email;
	}

	// Sidebar register toggle
	const showRegisterSidebar = document.getElementById('showRegisterSidebar');
	if (showRegisterSidebar) {
		showRegisterSidebar.addEventListener('click', (e) => {
			e.preventDefault();
			showRegisterFormSidebar();
		});
	}

	// Sidebar login toggle
	const showLoginSidebar = document.getElementById('showLoginSidebar');
	if (showLoginSidebar) {
		showLoginSidebar.addEventListener('click', (e) => {
			e.preventDefault();
			showLoginFormSidebar();
		});
	}

	/* ---- Register form submit -> register user and send OTP ---- */
	if (registerForm) {
		registerForm.addEventListener('submit', async e => {
		e.preventDefault();
		const fnameInput = document.getElementById('first_name');
		const lnameInput = document.getElementById('last_name');
		const emailInput = document.getElementById('email');
		const passwordInput = document.getElementById('password');
		const ninInput = document.getElementById('nin');
		const genderInput = document.getElementById('gender');
		const maritalInput = document.getElementById('marital_status');
		const phoneInput = document.getElementById('phone_number');
		const middleInput = document.getElementById('middle_name');
		const dobInput = document.getElementById('dob');
		const confirmPasswordInput = document.getElementById('password_confirmation');

		// Check each required field individually and show specific error
		const fields = [
		{ input: fnameInput, name: 'first_name' },
		{ input: lnameInput, name: 'last_name' },
		{ input: emailInput, name: 'email' },
		{ input: passwordInput, name: 'password' },
		{ input: confirmPasswordInput, name: 'password_confirmation' },
		{ input: ninInput, name: 'nin' },
		{ input: dobInput, name: 'dob' },
		{ input: genderInput, name: 'gender' },
		{ input: maritalInput, name: 'marital_status' },
		{ input: phoneInput, name: 'phone_number' }

		];

		for (const field of fields) {
		if (!field.input.value.trim()) {
			showToast(`Please fill in the ${field.name} field.`, 'warning');
			field.input.focus();
			return;
		}
		}

		if (passwordInput.value !== confirmPasswordInput.value) {
		showToast('Passwords do not match.', 'warning');
		confirmPasswordInput.focus();
		return;
		}

		const data = {
		first_name: fnameInput.value.trim(),
		last_name: lnameInput.value.trim(),
		email: emailInput.value.toLowerCase().trim(),
		password: passwordInput.value,
		password_confirmation: confirmPasswordInput.value,
		nin: ninInput.value.trim(),
		dob: dobInput.value,
		gender: genderInput.value,
		marital_status: maritalInput.value,
		phone_number: phoneInput.value.trim(),
		middle_name: middleInput.value.trim(),
		};

		try {
		// Register user via API
		await axios.post(API.registerForm, data);
		showToast('Registration successful! OTP sent to your email.', 'success');

		// Save "pendingUser" temporarily to localStorage
		localStorage.setItem('pendingUser', JSON.stringify({
			email: data.email,
			verified: false,
		}));

		showVerifyEmailForm(data.email);
		registerForm.reset();
		} catch (error) {
		showToast('Registration failed. Please try again.', 'error');
		}
		});
	}

	/* ---- Login form submit -> send OTP and show verify email form ---- */
	async function handleLoginSubmit(e, emailId, passwordId, formElement) {
		e.preventDefault();
		const emailInput = document.getElementById(emailId);
		const loginPasswordInput = document.getElementById(passwordId);

		if (!emailInput.value) {
			showToast('Please enter your email address.', 'warning');
			return;
		}

		const email = emailInput.value.toLowerCase().trim();
		const loginPasswordInputValue = loginPasswordInput.value;

		try {
			// Send OTP via API
			await axios.post(API.login, { email, password: loginPasswordInputValue });
			showToast('OTP sent to your email.', 'success');

			// Save "pendingUser" temporarily to localStorage
			localStorage.setItem('pendingUser', JSON.stringify({
				email: email,
				verified: false,
			}));

			showAuth();
			showVerifyEmailForm(email);
			formElement.reset();
		} catch (error) {
			showToast('Failed to send OTP. Please try again.', 'error');
		}
	}

	if (loginForm) {
		loginForm.addEventListener('submit', async e => {
			await handleLoginSubmit(e, 'loginEmail', 'loginPassword', loginForm);
		});
	}

	// Sidebar login form
	const loginFormSidebar = document.getElementById('loginFormSidebar');
	if (loginFormSidebar) {
		loginFormSidebar.addEventListener('submit', async e => {
			e.preventDefault();
			const emailInput = document.getElementById('loginEmailSidebar');
			const passwordInput = document.getElementById('loginPasswordSidebar');

			if (!emailInput.value) {
				showToast('Please enter your email address.', 'warning');
				return;
			}

			const email = emailInput.value.toLowerCase().trim();
			const password = passwordInput.value;

			try {
				// Send OTP via API
				await axios.post(API.login, { email, password });
				showToast('OTP sent to your email.', 'success');

				// Save "pendingUser" temporarily to localStorage
				localStorage.setItem('pendingUser', JSON.stringify({
					email: email,
					verified: false,
				}));

				showVerifyEmailFormSidebar(email);
				loginFormSidebar.reset();
			} catch (error) {
				showToast('Failed to send OTP. Please try again.', 'error');
			}
		});
	}

	// Sidebar register form
	const registerFormSidebar = document.getElementById('registerFormSidebar');
	if (registerFormSidebar) {
		registerFormSidebar.addEventListener('submit', async e => {
			e.preventDefault();
			const fnameInput = document.getElementById('first_name_sidebar');
			const lnameInput = document.getElementById('last_name_sidebar');
			const emailInput = document.getElementById('email_sidebar');
			const passwordInput = document.getElementById('password_sidebar');
			const ninInput = document.getElementById('nin_sidebar');
			const genderInput = document.getElementById('gender_sidebar');
			const maritalInput = document.getElementById('marital_status_sidebar');
			const phoneInput = document.getElementById('phone_number_sidebar');
			const middleInput = document.getElementById('middle_name_sidebar');
			const dobInput = document.getElementById('dob_sidebar');
			const confirmPasswordInput = document.getElementById('password_confirmation_sidebar');

			// Check required fields
			const fields = [
				{ input: fnameInput, name: 'First Name' },
				{ input: lnameInput, name: 'Last Name' },
				{ input: emailInput, name: 'Email' },
				{ input: passwordInput, name: 'Password' },
				{ input: confirmPasswordInput, name: 'Confirm Password' },
				{ input: ninInput, name: 'National ID' },
				{ input: dobInput, name: 'Date of Birth' },
				{ input: genderInput, name: 'Gender' },
				{ input: maritalInput, name: 'Marital Status' },
				{ input: phoneInput, name: 'Phone Number' }
			];

			for (const field of fields) {
				if (!field.input || !field.input.value.trim()) {
					showToast(`Please fill in the ${field.name} field.`, 'warning');
					if (field.input) field.input.focus();
					return;
				}
			}

			if (passwordInput.value !== confirmPasswordInput.value) {
				showToast('Passwords do not match.', 'warning');
				confirmPasswordInput.focus();
				return;
			}

			const data = {
				first_name: fnameInput.value.trim(),
				last_name: lnameInput.value.trim(),
				email: emailInput.value.toLowerCase().trim(),
				password: passwordInput.value,
				password_confirmation: confirmPasswordInput.value,
				nin: ninInput.value.trim(),
				dob: dobInput.value,
				gender: genderInput.value,
				marital_status: maritalInput.value,
				phone_number: phoneInput.value.trim(),
				middle_name: middleInput.value.trim(),
			};

			try {
				// Register user via API
				await axios.post(API.registerForm, data);
				showToast('Registration successful! OTP sent to your email.', 'success');

				// Save "pendingUser" temporarily to localStorage
				localStorage.setItem('pendingUser', JSON.stringify({
					email: data.email,
					verified: false,
				}));

				showVerifyEmailFormSidebar(data.email);
				registerFormSidebar.reset();
			} catch (error) {
				showToast('Registration failed. Please try again.', 'error');
			}
		});
	}



	/* ---- Verify email form submit ---- */
	const otpForm = document.getElementById('otpForm');
	const otpInputs = document.querySelectorAll('.otp-input');
	const otpCode = document.getElementById('otpCode');
	const verifyBtn = document.getElementById('verifyBtn');
	const btnText = document.getElementById('btnText');
	const btnSpinner = document.getElementById('btnSpinner');
	const resendLink = document.getElementById('resendLink');
	const countdownEl = document.getElementById('countdown');
	let countdown = 30;
	let countdownInterval;
	let isValidating = false;

	// OTP input handling
	otpInputs.forEach((input, index) => {
		input.addEventListener('input', (e) => {
		// Strip any non-numeric characters
		const value = e.target.value.replace(/[^0-9]/g, '');
		e.target.value = value;

		// Move to next input if value is entered
		if (value && index < otpInputs.length - 1) {
			otpInputs[index + 1].focus();
		}

		// Update OTP code and check if all fields are filled
		updateOTPCode();
		checkOTPComplete();

		// Add filled class for visual feedback
		if (value) {
			e.target.classList.add('filled');
		} else {
			e.target.classList.remove('filled');
		}
		});

		// Handle backspace
		input.addEventListener('keydown', (e) => {
		if (e.key === 'Backspace' && !e.target.value && index > 0) {
			otpInputs[index - 1].focus();
		}
		});

		// Handle paste
		input.addEventListener('paste', (e) => {
		e.preventDefault();
		const pasteData = e.clipboardData.getData('text').trim();

		if (/^[0-9]{6}$/.test(pasteData)) {
			// Fill all inputs with the pasted code
			for (let i = 0; i < otpInputs.length; i++) {
			if (i < pasteData.length) {
				otpInputs[i].value = pasteData[i];
				otpInputs[i].classList.add('filled');
			}
			}

			// Focus on the last input
			if (pasteData.length === 6) {
			otpInputs[5].focus();
			}

			updateOTPCode();
			checkOTPComplete();
		}
		});
	});

	// Update the hidden OTP code field
	function updateOTPCode() {
		let code = '';
		otpInputs.forEach(input => {
		code += input.value;
		});
		otpCode.value = code;
	}

	// Check if all OTP fields are filled
	function checkOTPComplete() {
		const isComplete = Array.from(otpInputs).every(input => input.value !== '');
		verifyBtn.disabled = !isComplete;
	}

	// Form submission
	if (otpForm) {
		otpForm.addEventListener('submit', async e => {
			e.preventDefault();
			await validateOTP();
		});
	}

	// Validate OTP
	async function validateOTP() {
		if (isValidating) return;
		isValidating = true;

		const code = otpCode.value;
		const pendingUserStr = localStorage.getItem('pendingUser');
		if (!pendingUserStr) {
		showToast('No pending verification found.', 'error');
		showRegisterForm();
		isValidating = false;
		return;
		}
		const pendingUser = JSON.parse(pendingUserStr);

		try {
		// Verify OTP via API
		const response = await axios.post(API.validateCode, { code, email: pendingUser.email });

		// Check if the API indicates failure
		if (response.data.error || response.data.message === 'Invalid OTP code.' || !response.data.success) {
			throw new Error(response.data.error || response.data.message || 'Invalid OTP code.');
		}

		// Save user and token objects to localStorage
		if (response.data.user) {
			localStorage.setItem('user', JSON.stringify(response.data.user));
		}
		if (response.data.token) {
			localStorage.setItem('token', response.data.token);
		}

		// Save session
		setSession({
			email: pendingUser.email,
			name: pendingUser.email.split('@')[0].replace('.', ' ').replace(/^\w/, c => c.toUpperCase()),
			role: 'Applicant',
			user: response.data.user || null,
			token: response.data.token || null
		});
		localStorage.removeItem('pendingUser');

		showToast('Email verified! You are now logged in.', 'success');
		isValidating = false;
		
		// Show app area after successful verification
		showDashboard();
		initAppAfterLogin();
		} catch (error) {
		showToast('Invalid OTP code. Please try again.', 'error');
		clearOTPInputs();
		isValidating = false;
		}
	}

	// Resend code functionality
	resendLink.addEventListener('click', async () => {
		if (resendLink.classList.contains('disabled')) return;

		const pendingUserStr = localStorage.getItem('pendingUser');
		if (!pendingUserStr) {
		showToast('No pending verification found.', 'error');
		return;
		}
		const pendingUser = JSON.parse(pendingUserStr);

		try {
		// Resend OTP via API
		await axios.post(API.login, { email: pendingUser.email });
		showToast('OTP resent to your email.', 'success');

		// Restart countdown
		countdown = 60;
		startCountdown();

		// Clear previous OTP inputs
		clearOTPInputs();
		} catch (error) {
		showToast('Failed to resend OTP. Please try again.', 'error');
		}
	});

	// Countdown timer for resend
	function startCountdown() {
		clearInterval(countdownInterval);
		resendLink.classList.add('disabled');
		
		countdownInterval = setInterval(() => {
		countdown--;
		countdownEl.textContent = `(${countdown}s)`;
		
		if (countdown <= 0) {
			clearInterval(countdownInterval);
			resendLink.classList.remove('disabled');
			countdown = 60;
			countdownEl.textContent = `(${countdown}s)`;
		}
		}, 1000);
	}

	// Clear OTP inputs
	function clearOTPInputs() {
		otpInputs.forEach(input => {
		input.value = '';
		input.classList.remove('filled');
		});
		otpCode.value = '';
		verifyBtn.disabled = true;
		otpInputs[0].focus();
	}

	// Start countdown when verification form is shown
	const originalShowVerifyEmailForm = showVerifyEmailForm;
	showVerifyEmailForm = function(email) {
		originalShowVerifyEmailForm(email);
		countdown = 60;
		countdownEl.textContent = `(${countdown}s)`;
		startCountdown();
		otpInputs[0].focus();
	};

	if (btnLogout) {
		btnLogout.addEventListener('click', () => {
			clearSession();
			showToast('Logged out successfully', 'success');
			// Reset to login form
			showAuth();
			showLoginForm();
		});
	}

	/* =============== Application Logic =============== */
	// API endpoints - dynamically built with the apiUrl
const API = {
	login: `${apiUrl}/login`,
	registerForm: `${apiUrl}/register`,
	personalDetails: `${apiUrl}/application`,

	// === CRUD BASE ENDPOINTS (NO ID INSIDE) ===
	educationTraining: `${apiUrl}/educations`,
	professionalMembership: `${apiUrl}/memberships`,

	employmentHistory: `${apiUrl}/employments`,
	documents: `${apiUrl}/documents`,
	referee: `${apiUrl}/referees`,
	dependants: `${apiUrl}/dependants`,

	// === ENDPOINTS FOR FRONTEND RETRIEVAL (DYNAMIC) ===
	getApplication: (id) => `${apiUrl}/application/${id}`,
	getReferees: (id) => `${apiUrl}/referees/${id}`,
	getDependants: (id) => `${apiUrl}/dependants/${id}`,
	getDocuments: (id) => `${apiUrl}/documents/${id}`,
	getEmploymentHistory: (id) => `${apiUrl}/employments/${id}`,
	getEducationTraining: (id) => `${apiUrl}/educations/${id}`,
	getProfessionalMemberships: (id) => `${apiUrl}/memberships/${id}`,
	getSubmittedApplications: (id) => `${apiUrl}/submitted_applications/${id}`,

	// === JOB/APPLICATION RELATED ===
	selectJob: `${apiUrl}/active_vacancies`,
	getActiveVacancies: `${apiUrl}/active_vacancies`,
	postApplication: `${apiUrl}/application`,
	postApplicationSection: `${apiUrl}/application_section`,
	retrieveApplication: `${apiUrl}/retrieve_application`,
	validateCode: `${apiUrl}/validate_code`,
};


	let dataCache = {};

	function getSection(key) {
		const map = {
		educationTraining: 'education',
		professionalMembership: 'memberships',
		employmentHistory: 'employment',
		documents: 'documents',
		referee: 'references',
		dependants: 'dependants',
		personalDetails: 'personal',
		};
		return map[key] || '';
	}

	/* ----- Sidebar Navigation ----- */
	function showStep(step) {
		currentStep = step;
		sidebarNav.querySelectorAll('a.nav-link').forEach(a => {
		a.classList.toggle('active', a.getAttribute('data-step') === step);
		});
		mainPanel.querySelectorAll('section[data-step-content]').forEach(sec => {
		sec.classList.toggle('d-none', sec.getAttribute('data-step-content') !== step);
		});
		loadStepData(step);
	}

	sidebarNav.addEventListener('click', e => {
		const a = e.target.closest('a.nav-link');
		if (!a) return;
		e.preventDefault();
		const step = a.getAttribute('data-step');
		if (isBrowseMode && step !== 'selectJob') {
		showToast('You can only browse jobs in this mode. Please click View to Continue', 'warning');
		return;
		}
		showStep(step);
	});

function renderTableRows(items, tbodyEl, columns, editCb, deleteCb) {
    tbodyEl.innerHTML = '';
    if (!items.length) {
        const colSpan = columns.length + 1;
        tbodyEl.innerHTML = `<tr><td colspan="${colSpan}" class="text-center text-muted">No records found.</td></tr>`;
        return;
    }

    items.forEach(item => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
            let val = item[col.key];
            if (val === undefined || val === null) val = '';

            // Use formatter if provided
            if (col.formatter && typeof col.formatter === 'function') {
                val = col.formatter(val, item); // pass value and optionally the whole item
            }

            tr.insertAdjacentHTML('beforeend', `<td>${val}</td>`);
        });

        const tdActions = document.createElement('td');
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn btn-sm btn-primary me-2';
        btnEdit.type = 'button';
        btnEdit.innerHTML = '<i class="fa fa-edit"></i>';
        btnEdit.addEventListener('click', () => editCb(item));

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn btn-sm btn-danger';
        btnDelete.type = 'button';
        btnDelete.innerHTML = '<i class="fa fa-trash"></i>';
        btnDelete.addEventListener('click', () => deleteCb(item.id));

        tdActions.appendChild(btnEdit);
        tdActions.appendChild(btnDelete);
        tr.appendChild(tdActions);

        tbodyEl.appendChild(tr);
    });
}

	/* ----- Axios CRUD functions ----- */
	async function fetchItems(apiUrl, key) {
		try {
		const response = await axios.get(apiUrl);
		dataCache[key] = response.data || [];
		return dataCache[key];
		} catch (e) {
		showToast(`Error fetching ${key}`, 'error');
		return [];
		}
	}

	async function createItem(apiUrl, item, key) {
		try {
		const response = await axios.post(apiUrl, item);
		dataCache[key] = dataCache[key] || [];
		dataCache[key].push(response.data);
		return response.data;
		} catch (e) {
		showToast(`Error creating item`, 'error');
		throw e;
		}
	}

	async function updateItem(apiUrl, id, item, key) {
		try {
		const response = await axios.put(`${apiUrl}/${id}`, item);
		const index = dataCache[key].findIndex(i => i.id === id);
		if (index > -1) dataCache[key][index] = response.data;
		return response.data;
		} catch (e) {
		showToast(`Error updating item`, 'error');
		throw e;
		}
	}

	async function deleteItem(apiUrl, id, key) {
		try {
		await axios.delete(`${apiUrl}/${id}`);
		dataCache[key] = dataCache[key].filter(i => i.id !== id);
		return true;
		} catch (e) {
		showToast(`Error deleting item`, 'error');
		return false;
		}
	}

	/* -------- Show Step Data Loaders & Modals -------- */

	// Personal Details
	const formPersonalDetails = document.getElementById('formPersonalDetails');
	async function loadPersonalDetails() {
		try {
		// Fetch personal details or create default from session
		const response = await axios.get(API.personalDetails);
		const session = getSession();
		const user = getUser();
		let pd = response.data || {};
		
		// If no saved data, prefill from user object in localStorage first, then session
		if (!pd.email && user) {
			pd.email = user.email || '';
			pd.firstName = user.first_name || '';
			pd.middleName = user.middle_name || '';
			pd.lastName = user.last_name || '';
			pd.contact = user.phone_number || '';
			pd.nin = user.nin || '';
			pd.gender = user.gender || '';
			pd.dob = user.dob || '';
			pd.status = user.marital_status || '';
		} else if (!pd.email && session) {
			pd.email = session.email;
		}
		
		// Fill form fields
		document.getElementById('firstName').value = pd.firstName || '';
		document.getElementById('middleName').value = pd.middleName || '';
		document.getElementById('lastName').value = pd.lastName || '';
		document.getElementById('emailDetail').value = pd.email || '';
		document.getElementById('contact').value = pd.contact || '';
		document.getElementById('ninDetail').value = pd.nin || '';
		document.getElementById('genderDetail').value = pd.gender || '';
		document.getElementById('dobDetail').value = pd.dob || '';
		document.getElementById('statusDetail').value = pd.status || '';
		} catch {
		// show fallback - try to populate from user object if available
		const user = getUser();
		const session = getSession();
		
		if (user) {
			document.getElementById('firstName').value = user.first_name || '';
			document.getElementById('middleName').value = user.middle_name || '';
			document.getElementById('lastName').value = user.last_name || '';
			document.getElementById('emailDetail').value = user.email || '';
			document.getElementById('contact').value = user.phone_number || '';
			document.getElementById('ninDetail').value = user.nin || '';
			document.getElementById('genderDetail').value = user.gender || '';
			document.getElementById('dobDetail').value = user.dob || '';
			document.getElementById('statusDetail').value = user.marital_status || '';
		} else if (session) {
			document.getElementById('firstName').value = '';
			document.getElementById('middleName').value = '';
			document.getElementById('lastName').value = '';
			document.getElementById('emailDetail').value = session.email || '';
			document.getElementById('contact').value = '';
			document.getElementById('ninDetail').value = '';
			document.getElementById('genderDetail').value = '';
			document.getElementById('dobDetail').value = '';
			document.getElementById('statusDetail').value = '';
		} else {
			// Clear all fields if no data available
			document.getElementById('firstName').value = '';
			document.getElementById('middleName').value = '';
			document.getElementById('lastName').value = '';
			document.getElementById('emailDetail').value = '';
			document.getElementById('contact').value = '';
			document.getElementById('ninDetail').value = '';
			document.getElementById('genderDetail').value = '';
			document.getElementById('dobDetail').value = '';
			document.getElementById('statusDetail').value = '';
		}
		}
	}
	if (formPersonalDetails) {
		formPersonalDetails.addEventListener('submit', async e => {
			e.preventDefault();
			const data = {
			firstName: document.getElementById('firstName').value.trim(),
			middleName: document.getElementById('middleName').value.trim(),
			lastName: document.getElementById('lastName').value.trim(),
			email: document.getElementById('emailDetail').value.trim(),
			contact: document.getElementById('contact').value.trim(),
			nin: document.getElementById('ninDetail').value.trim(),
			gender: document.getElementById('genderDetail').value,
			dob: document.getElementById('dobDetail').value,
			status: document.getElementById('statusDetail').value,
			};
			try {
			await axios.post(API.personalDetails, data);
			showToast('Personal details saved.', 'success');
			} catch {
			showToast('Failed to save personal details.', 'error');
			}
		});
	}

	// Education and Training
	const educationTableBody = document.querySelector('#educationTable tbody');
	document.getElementById('btnAddEducation').addEventListener('click', () => openEducationModal());
	function openEducationModal(editItem = null) {
		crudModalLabel.innerHTML = `
			<i class="fas fa-graduation-cap me-2"></i>
			${editItem ? 'Edit Education' : 'Add Education'}
		`;

		crudItemIdInput.value = editItem ? editItem.id : '';

		crudModalBody.innerHTML = `
			<input type="hidden" name="applicant_id" value="${user.id}">
			<div class="row">
				<div class="col-md-6 mb-3">
					<label class="form-label fw-bold">From Year</label>
					<select class="form-control" id="start_year" name="start_year" required>
						<option value="">Select Year</option>
						${Array.from({length: new Date().getFullYear() - 1990 + 1}, (_, i) => 1990 + i)
							.map(year => `<option value="${year}" ${editItem?.start_year == year ? 'selected' : ''}>${year}</option>`).join('')}
					</select>
				</div>

				<div class="col-md-6 mb-3">
					<label class="form-label fw-bold">To Year</label>
					<select class="form-control" id="end_year" name="end_year">
						<option value="">Select Year</option>
						${Array.from({length: new Date().getFullYear() - 1990 + 1}, (_, i) => 1990 + i)
							.map(year => `<option value="${year}" ${editItem?.end_year == year ? 'selected' : ''}>${year}</option>`).join('')}
					</select>
				</div>
			</div>

			<div class="row">
				<div class="col-md-10 mb-3">
					<label class="form-label fw-bold">Qualification</label>
					<select class="form-control" id="qualification" name="qualification" required>
						<option value="">Select Qualification</option>
						<option value="PhD" ${editItem?.qualification === 'PhD' ? 'selected' : ''}>PhD</option>
						<option value="Masters" ${editItem?.qualification === 'Masters' ? 'selected' : ''}>Masters</option>
						<option value="Bachelors" ${editItem?.qualification === 'Bachelors' ? 'selected' : ''}>Bachelors</option>
						<option value="Diploma" ${editItem?.qualification === 'Diploma' ? 'selected' : ''}>Diploma</option>
						<option value="Certificate" ${editItem?.qualification === 'Certificate' ? 'selected' : ''}>Certificate</option>
						<option value="Certification" ${editItem?.qualification === 'Certification' ? 'selected' : ''}>Certification</option>
						
					</select>
				</div>

				<div class="col-md-12 mb-3">
					<label class="form-label fw-bold">Program/Course</label>
					<input type="text" class="form-control" id="course" name="course"
						required value="${editItem?.course || ''}">
				</div>
				<div class="col-md-12 mb-3">
					<label class="form-label fw-bold">Institution</label>
					<input type="text" class="form-control" id="institution" name="institution"
						required value="${editItem?.institution || ''}">
				</div>
			</div>
			<div class="form-check mb-3">
				<input class="form-check-input" type="checkbox" value="" id="ongoing" name="ongoing" ${editItem?.ongoing ? 'checked' : ''}>
				<label class="form-check-label fw-bold" for="ongoing">
					Ongoing
				</label>
			</div>
		`;

		crudModal.show();
	}

	async function loadEducation() {
		try {
			const user = getUser();
			let items = [];

			if (user && user.id) {
				// Use GET route for applicant
				items = await fetchItems(API.getEducationTraining(user.id), 'educationTraining');
			}

			// fallback if no API data
			if (!items || items.length === 0) {
				if (user && user.education && Array.isArray(user.education)) {
					items = user.education.map((edu, index) => ({
						id: `user-edu-${index}`,
						start_year: edu.start_year || '',
						end_year: edu.end_year || '',
						qualification: edu.qualification || edu.degree || '',
						course: edu.course || edu.program || edu.field_of_study || '',
						institution: edu.institution || '',
						ongoing: edu.ongoing || false
					}));
					dataCache['educationTraining'] = items;
				}
			}

			// Render table
			renderTableRows(
				items,
				educationTableBody,
				[
					{ key: 'start_year' },
					{ key: 'end_year' },
					{ key: 'qualification' },
					{ key: 'course' },
					{ key: 'institution' },
					{ key: 'ongoing', formatter: val => val ? 'Ongoing' : 'Completed' }
				],
				openEducationModal,
				async id => {
					if (confirm('Delete this education record?')) {
						const success = await deleteItem(API.educationTraining, id, 'educationTraining');
						if (success) loadEducation();
						showToast('Education record deleted.', 'success');
					}
				}
			);
		} catch (error) {
			console.error('Error loading education:', error);
		}
	}

	// // Professional Membership
	// const membershipTableBody = document.querySelector('#membershipTable tbody');
	// document.getElementById('btnAddMembership').addEventListener('click', () => openMembershipModal());
	// function openMembershipModal(editItem = null) {
	// 	crudModalLabel.innerHTML = `<i class="fas fa-users me-2"></i>${editItem ? 'Edit Membership' : 'Add Membership'}`;
	// 	crudItemIdInput.value = editItem ? editItem.id : '';
	// 	crudModalBody.innerHTML = `
	// 	<input type="hidden" name="applicant_id" value="${user.id}">
	// 	<div class="row">
	// 		<div class="col-md-12 mb-2">
	// 			<label for="membershipInstitute" class="form-label fw-bold">Institute</label>
	// 			<input type="text" class="form-control" id="membershipInstitute" name="institute" placeholder="ISACA, Rotary, Lions Club" required value="${editItem ? editItem.institute : ''}">
	// 		</div>
	// 		<div class="col-md-6 mb-2">
	// 			<label for="membershipType" class="form-label fw-bold">Membership Type</label>
	// 			<input type="text" class="form-control" id="membershipType" name="type" placeholder="e.g. Full Member, Student" required value="${editItem ? editItem.type : ''}">
	// 		</div>
	// 		<div class="col-md-6 mb-2">
	// 			<label for="membershipNumber" class="form-label fw-bold">Membership Year</label>
	// 			<input type="text" class="form-control" id="membershipNumber" name="year" placeholder="e.g. 2023" required value="${editItem ? editItem.year : ''}">
	// 		</div>
	// 	</div>
	// 	`;
	// 	crudModal.show();
	// }




	// Professional Membership
const membershipTableBody = document.querySelector('#membershipTable tbody');

document.getElementById('btnAddMembership').addEventListener('click', () => openMembershipModal());

function openMembershipModal(editItem = null) {

    crudModalLabel.innerHTML = `
        <i class="fas fa-users me-2"></i>
        ${editItem ? 'Edit Membership' : 'Add Membership'}
    `;

    // Set ID (used for update)
    crudItemIdInput.value = editItem ? editItem.id : '';

    // Modal form body
    crudModalBody.innerHTML = `
        <input type="hidden" name="applicant_id" value="${user.id}">

        <div class="row">
            <div class="col-md-12 mb-3">
                <label class="form-label fw-bold">Institute</label>
                <input type="text" class="form-control" 
                    id="membershipInstitute" 
                    name="institute" 
                    placeholder="ISACA, Rotary, Lions Club" 
                    required
                    value="${editItem?.institute || ''}">
            </div>

            <div class="col-md-8 mb-3">
                <label class="form-label fw-bold">Membership Type</label>
                <input type="text" class="form-control"
                    id="membershipType" 
                    name="type" 
                    placeholder="Full Member, Student"
                    required
                    value="${editItem?.type || ''}">
            </div>

            <div class="col-md-4 mb-3">
                <label class="form-label fw-bold">Membership Year</label>
                <input type="number" class="form-control"
                    id="membershipYear"
                    name="year"
                    placeholder="e.g. 2023"
                    required
                    value="${editItem?.year || ''}">
            </div>
        </div>
    `;

    crudModal.show();
}


	async function loadMembership() {
		const user = getUser();
		let items = [];
		if (user && user.id) {
			// Use GET route for applicant
			items = await fetchItems(API.getProfessionalMemberships(user.id), 'professionalMembership');
		}
		// fallback if no API data
		if (!items || items.length === 0) {
			if (user && user.memberships && Array.isArray(user.memberships)) {
				items = user.memberships.map((mem, index) => ({
					id: `user-mem-${index}`,
					institute: mem.institute || '',
					type: mem.type || '',
					year: mem.year || ''
				}));
				dataCache['professionalMembership'] = items;
			}
		}
		renderTableRows(items, membershipTableBody, [
		{ key: 'institute' },
		{ key: 'type' },
		{ key: 'year' }
		], openMembershipModal, async id => {
		if (confirm('Delete this membership record?')) {
			const success = await deleteItem(API.professionalMembership, id, 'professionalMembership');
			if (success) loadMembership();
		}
		});
	}


	
// Employment History
const employmentTableBody = document.querySelector('#employmentTable tbody');

document.getElementById('btnAddEmployment').addEventListener('click', () => openEmploymentModal());

function openEmploymentModal(editItem = null) {

    crudModalLabel.innerHTML = `
        <i class="fas fa-briefcase me-2"></i>
        ${editItem ? 'Edit Employment' : 'Add Employment'}
    `;

    // Set ID (used for update)
    crudItemIdInput.value = editItem ? editItem.id : '';

    // Modal form body
    crudModalBody.innerHTML = `
        <input type="hidden" name="applicant_id" value="${user.id}">

		<div class="row">
				<div class="col-md-6 mb-3">
					<label class="form-label fw-bold">From Year</label>
					<input type="date" class="form-control calander" name="start_date" value="${editItem?.start_date || ''}"/>	
				</div>
				<div class="col-md-6 mb-3">
					<label class="form-label fw-bold">To Year</label>
					<input type="date" class="form-control calander"  name="end_date" value="${editItem?.end_date || ''}"/>	
		</div>
		</div>

		<div class="row">
			<div class="col-md-12 mb-3">
				<label for="employer" class="form-label fw-bold">Employer</label>
				<input type="text" class="form-control" id="from_date" name="employer" placeholder="e.g. Tech Solutions Inc." required value="${editItem?.employer || ''}">
			
			</div>
		
			<div class="col-md-12 mb-3">
				<label for="position" class="form-label fw-bold">Position Held</label>
				<input type="text" class="form-control" id="position" name="position" placeholder="e.g. Software Developer" required value="${editItem?.position || ''}">			
			</div>
		</div>

		<div class="col-md-12 mb-3">
				<label for="position" class="form-label fw-bold">Duties</label>
				<textarea class="form-control" id="duties" name="duties"  rows="7" placeholder="e.g.  Developed web applications " required>${editItem?.duties || ''}</textarea>			
		</div>
		

		

    `;

    crudModal.show();
}
	async function loadEmployment() {
		const user = getUser();
		let items = [];
		if (user && user.id) {
			// Use GET route for applicant
			items = await fetchItems(API.getEmploymentHistory(user.id), 'employmentHistory');
		}
		// fallback if no API data
		if (!items || items.length === 0) {
			if (user && user.employments && Array.isArray(user.employments)) {
				items = user.employments.map((mem, index) => ({
					id: `user-mem-${index}`,
					start_date: mem.start_date || '',
					end_date: mem.end_date || '',
					employer: mem.employer || '',
					position: mem.position || '',
					duties: mem.duties || '',
					is_current: mem.is_current || false
					
				}));
				dataCache['employmentHistory'] = items;
			}
		}
		renderTableRows(items, employmentTableBody, [
		{ key: 'start_date' },
		{ key: 'end_date' },
		{ key: 'employer' },
		{ key: 'position' },
		{ key: 'duties' },
		{ key: 'is_current', formatter: val => val ? 'Current' : 'Past' }	
		], openEmploymentModal, async id => {
		if (confirm('Delete this employment record?')) {
			const success = await deleteItem(API.employmentHistory, id, 'employmentHistory');
			if (success) loadEmployment();
		}
		});
	}


	
// Referee 
const refereeTableBody = document.querySelector('#refereeTable tbody');

document.getElementById('btnAddReferee').addEventListener('click', () => openRefereeModal());

function openRefereeModal(editItem = null) {

    crudModalLabel.innerHTML = `
        <i class="fas fa-briefcase me-2"></i>
        ${editItem ? 'Edit Referee' : 'Add Referee'}
    `;

    // Set ID (used for update)
    crudItemIdInput.value = editItem ? editItem.id : '';

    // Modal form body
    crudModalBody.innerHTML = `
        <input type="hidden" name="applicant_id" value="${user.id}">

		<div class="row">
		
			<div class="col-md-6 mb-3">
			<label for="name" class="form-label fw-bold">Full Name</label>
			<input type="text" class="form-control" id="name" name="name"  required value="${editItem?.name || ''}">
			</div>


			<div class="col-md-6 mb-3">
			<label for="address" class="form-label fw-bold">Address</label>
			<input type="text" class="form-control" id="address" name="address"  required value="${editItem?.address || ''}"/>
				
			</div>
		</div>

		<div class="row">
		
			<div class="col-md-6 mb-3">
				<label for="position" class="form-label fw-bold">Position</label>
				<input type="text" class="form-control" id="position" name="position"  required value="${editItem?.position || ''}">
			</div>
			<div class="col-md-6 mb-3">
				<label for="email" class="form-label fw-bold">Email</label>
				<input type="email" class="form-control" id="email" name="email"  required value="${editItem?.email || ''}"/>
				
			</div>
		</div>
		position

		<div class="row">
		
			<div class="col-md-6 mb-3">
			<label for="tel" class="form-label fw-bold">Contact</label>
			<input type="text" class="form-control" id="tel" name="tel"  required value="${editItem?.tel || ''}">
			</div>

			<div class="col-md-6 mb-3">
			<label for="relationship" class="form-label fw-bold">Relationship</label>
			<input type="text" class="form-control" id="relationship" name="relationship"  required value="${editItem?.relationship || ''}"/>

		</div>
    `;

    crudModal.show();
}
	async function loadReferee() {
		const user = getUser();
		let items = [];
		if (user && user.id) {
			// Use GET route for applicant
			items = await fetchItems(API.referee(user.id), 'referee');
		}
		// fallback if no API data
		if (!items || items.length === 0) {
			if (user && user.referees && Array.isArray(user.referees)) {
				items = user.referees.map((mem, index) => ({
					id: `user-mem-${index}`,
					name: mem.name || '',
					relationship: mem.relationship || '',
					tel: mem.tel || '',
					email: mem.email || '',
					address: mem.address || '',
					position: mem.position || ''
					
				}));
				dataCache['referee'] = items;
			}
		}
		renderTableRows(items, refereeTableBody, [
		{ key: 'name' },
		{ key: 'relationship' },
		{ key: 'tel' },
		{ key: 'email' },
		{ key: 'address' },
		{ key: 'position' }
		], openRefereeModal, async id => {
		if (confirm('Delete this employment record?')) {
			const success = await deleteItem(API.referee, id, 'referee');
			if (success) loadReferee();
		}
		});
	}




// // Dependants
const dependantsTableBody = document.querySelector('#dependantsTable tbody');

document.getElementById('btnAddDependant').addEventListener('click', () => openDependantModal());

function openDependantModal(editItem = null) {

    crudModalLabel.innerHTML = `
        <i class="fas fa-briefcase me-2"></i>
        ${editItem ? 'Edit Dependant' : 'Add Dependant'}
    `;

    // Set ID (used for update)
    crudItemIdInput.value = editItem ? editItem.id : '';

    // Modal form body
    crudModalBody.innerHTML = `
        <input type="hidden" name="applicant_id" value="${user.id}">

			<div class="row">
		
			<div class="col-md-6 mb-3">
			<label for="name" class="form-label fw-bold">Full Name</label>
			<input type="text" class="form-control" id="name" name="name"  value="${editItem?.name || ''}" required>
			</div>


			<div class="col-md-6 mb-3">
			<label for="relationship" class="form-label fw-bold">Relationship</label>
			<select type="text" class="form-control" id="relationship" name="relationship"  required value="${editItem?.relationship ||''}">
				<option value="">Select Relationship</option>
				<option value="Spouse">Spouse</option>
				<option value="Child">Child</option>
				<option value="Parent" >Parent</option>
				<option value="Friend">Friend</option>

			</select>
			</div>
		</div>
		<div class="row">
		
			<div class="col-md-6 mb-3">
			<label for="birth_date" class="form-label fw-bold">Date of Birth</label>
			<input type="date" class="form-control calender" id="birth_date" name="birth_date"  required value="${editItem?.age || ''}">
			</div>
		</div>
    `;

    crudModal.show();
}
	async function loadDependants() {
		const user = getUser();
		let items = [];
		if (user && user.id) {
			// Use GET route for applicant
			items = await fetchItems(API.getDependants(user.id), 'dependantsdependants');
		}
		dependants:

		// fallback if no API data
		if (!items || items.length === 0) {
			if (user && user.dependants && Array.isArray(user.dependants)) {
				items = user.dependants.map((mem, index) => ({
					id: `user-mem-${index}`,
					name: mem.name || '',
					birth_date: mem.birth_date || '',
					relationship: mem.relationship || ''
					
					
				}));
				dataCache['dependants'] = items;
			}
		}
		renderTableRows(items, dependantsTableBody, [
		{ key: 'name' },
		{ key: 'relationship' },
		{ key: 'birth_date' }	
		], openDependantModal, async id => {
		if (confirm('Delete this dependants record?')) {
			const success = await deleteItem(API.dependants, id, 'dependants');
			if (success) loadDependants();
		}
		});
	}











	// Preview Application
	const previewSection = document.querySelector('section[data-step-content="previewApplication"]');
	async function loadPreview() {
		let html = '<h5>Summary</h5>';
		for (const key in dataCache) {
		if (!dataCache[key] || dataCache[key].length === 0) continue;
		html += `<h6>${key.replace(/([A-Z])/g, ' $1').trim()}</h6><ul>`;
		dataCache[key].forEach(item => {
			html += '<li>' + Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(', ') + '</li>';
		});
		html += '</ul>';
		}
		previewSection.innerHTML = `<h4>Preview Application</h4>${html}<button class="btn btn-primary" id="btnSubmitApplication">Submit Application</button>`;

		document.getElementById('btnSubmitApplication').addEventListener('click', () => {
		showToast('Application submitted successfully!', 'success');
		});
	}

	// Select Job
	const jobTableBody = document.querySelector('#jobTable tbody');
	async function loadJobs() {
		try {
		const response = await axios.get(API.selectJob);
		const jobs = response.data.data || [];
		// console.log(jobs);
		if (!jobs.length) {
			jobTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No jobs listed currently.</td></tr>`;
			return;
		}
		jobTableBody.innerHTML = '';
		jobs.forEach(job => {
			const tr = document.createElement('tr');
			tr.insertAdjacentHTML('beforeend', `<td>${job.name || ''}</td>`);
			tr.insertAdjacentHTML('beforeend', `<td>${job.location || ''}</td>`);
			tr.insertAdjacentHTML('beforeend', `<td>${job.deadline || ''}</td>`);

			const tdActions = document.createElement('td');
			const btnView = document.createElement('button');
			btnView.className = 'btn btn-sm btn-info me-2';
			btnView.type = 'button';
			btnView.innerHTML = '<i class="fa fa-eye"></i> View';
			btnView.addEventListener('click', () => {
			showToast(`Viewing job: ${job.name}`, 'info');
			// Add view logic here, e.g., open modal with job details
			});
			tdActions.appendChild(btnView);

			if (!isBrowseMode) {
			const btnApply = document.createElement('button');
			btnApply.className = 'btn btn-sm btn-success';
			btnApply.type = 'button';
			btnApply.innerHTML = '<i class="fa fa-paper-plane"></i> Apply';
			btnApply.addEventListener('click', () => {
				showToast(`Applying for job: ${job.name}`, 'success');
				// Add apply logic here
			});
			tdActions.appendChild(btnApply);
			}
			tr.appendChild(tdActions);

			jobTableBody.appendChild(tr);
		});
		} catch {
		jobTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Failed to load jobs.</td></tr>`;
		}
	}

	/* -------- Modal Submit Handler -------- */
	crudForm.addEventListener('submit', async e => {
		e.preventDefault();
		if (!crudForm.checkValidity()) {
		crudForm.classList.add('was-validated');
		return;
		}
		const data = {};
		data.applicant_id = crudForm.querySelector('input[name="applicant_id"]').value;
		crudModalBody.querySelectorAll('input, select, textarea').forEach(input => {
			if (input.type === 'file') {
				data[input.name] = input.files.length > 0 ? input.files[0].name : '';
			} else if (input.type === 'checkbox') {
				data[input.name] = input.checked; // true or false
			} else {
				data[input.name] = input.value.trim();
			}
		});


		const id = crudItemIdInput.value || null;
		console.log('Current Item ID:', id);
		let key = '';
		switch (currentStep) {
			case 'educationTraining': apiUrl = API.educationTraining; key = 'educationTraining'; break;
			case 'professionalMembership': apiUrl = API.professionalMembership; key = 'professionalMembership'; break;
			case 'employmentHistory': apiUrl = API.employmentHistory; key = 'employmentHistory'; break;
			case 'documents': apiUrl = API.documents; key = 'documents'; if (!id) data.uploadedOn = new Date().toLocaleDateString(); break;
			case 'referee': apiUrl = API.referee; key = 'referee'; break;
			case 'dependants': apiUrl = API.dependants; key = 'dependants'; break;
			default:
			showToast('Unsupported step form.', 'error');
			crudModal.hide();
			return;
		}
		try {
			if (id) {
				await updateItem(apiUrl, id, data, key);
				showToast('Record updated.', 'success');
			} else {
				await createItem(apiUrl, data, key);
				showToast('Record created.', 'success');
			}
			crudModal.hide();
			await loadStepData(currentStep);
		} catch {}
	});

	/* -------- Load Data for step -------- */
	async function loadStepData(step) {
		switch (step) {
		case 'personalDetails': await loadPersonalDetails(); break;
		case 'educationTraining': await loadEducation(); break;
		case 'professionalMembership': await loadMembership(); break;
		case 'employmentHistory': await loadEmployment(); break;
		case 'documents': await loadDocuments(); break;
		case 'referee': await loadReferee(); break;
		case 'dependants': await loadDependants(); break;
		case 'previewApplication': await loadPreview(); break;
		case 'selectJob': await loadJobs(); break;
		}
	}

	/* -------- Initialize App After Login -------- */
	function initAppAfterLogin() {
		const session = getSession();
		if (!session) return;

		// Show user in navbar dropdown
		navbarUserName.textContent = session.name || session.email;
		userDropdown.textContent = 'Hello ' + session.email;

		// Show default step
		showStep(currentStep);
	}
	/* -------- Validation Error Handling -------- */
	function showValidationErrors(form, errors) {
		clearValidationErrors(form);
		for (const [field, messages] of Object.entries(errors)) {
		const input = form.querySelector(`[name="${field}"]`);
		if (input) {
			input.classList.add('is-invalid');
			const feedback = input.nextElementSibling;
			if (feedback && feedback.classList.contains('invalid-feedback')) {
			feedback.textContent = messages.join(' ');
			}
		}
		}
	}
	function clearValidationErrors(form) {
		form.querySelectorAll('.is-invalid').forEach(input => {
		input.classList.remove('is-invalid');
		});
		form.querySelectorAll('.invalid-feedback').forEach(div => {
		div.textContent = '';
		});
	}


	// Sidebar OTP form handling
	const otpFormSidebar = document.getElementById('otpFormSidebar');
	const otpInputsSidebar = document.querySelectorAll('#verifyEmailFormSidebar .otp-input');
	const otpCodeSidebar = document.getElementById('otpCodeSidebar');
	const verifyBtnSidebar = document.getElementById('verifyBtnSidebar');

	// OTP input handling for sidebar
	otpInputsSidebar.forEach((input, index) => {
		input.addEventListener('input', (e) => {
			// Strip any non-numeric characters
			const value = e.target.value.replace(/[^0-9]/g, '');
			e.target.value = value;

			// Move to next input if value is entered
			if (value && index < otpInputsSidebar.length - 1) {
				otpInputsSidebar[index + 1].focus();
			}

			// Update OTP code and check if all fields are filled
			updateOTPCodeSidebar();
			checkOTPCompleteSidebar();

			// Add filled class for visual feedback
			if (value) {
				e.target.classList.add('filled');
			} else {
				e.target.classList.remove('filled');
			}
		});

		// Handle backspace
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Backspace' && !e.target.value && index > 0) {
				otpInputsSidebar[index - 1].focus();
			}
		});

		// Handle paste
		input.addEventListener('paste', (e) => {
			e.preventDefault();
			const pasteData = e.clipboardData.getData('text').trim();

			if (/^[0-9]{6}$/.test(pasteData)) {
				// Fill all inputs with the pasted code
				for (let i = 0; i < otpInputsSidebar.length; i++) {
					if (i < pasteData.length) {
						otpInputsSidebar[i].value = pasteData[i];
						otpInputsSidebar[i].classList.add('filled');
					}
				}

				// Focus on the last input
				if (pasteData.length === 6) {
					otpInputsSidebar[5].focus();
				}

				updateOTPCodeSidebar();
				checkOTPCompleteSidebar();
			}
		});
	});

	// Update the hidden OTP code field for sidebar
	function updateOTPCodeSidebar() {
		let code = '';
		otpInputsSidebar.forEach(input => {
			code += input.value;
		});
		if (otpCodeSidebar) otpCodeSidebar.value = code;
	}

	// Check if all OTP fields are filled for sidebar
	function checkOTPCompleteSidebar() {
		const isComplete = Array.from(otpInputsSidebar).every(input => input.value !== '');
		if (verifyBtnSidebar) verifyBtnSidebar.disabled = !isComplete;
	}

	// Sidebar OTP form submission
	if (otpFormSidebar) {
		otpFormSidebar.addEventListener('submit', async e => {
			e.preventDefault();
			const code = otpCodeSidebar.value;
			const pendingUserStr = localStorage.getItem('pendingUser');
			if (!pendingUserStr) {
				showToast('No pending verification found.', 'error');
				showLoginFormSidebar();
				return;
			}
			const pendingUser = JSON.parse(pendingUserStr);

			try {
				// Verify OTP via API
				const response = await axios.post(API.validateCode, { code, email: pendingUser.email });

				// Check if the API indicates failure
				if (response.data.error || response.data.message === 'Invalid OTP code.' || !response.data.success) {
					throw new Error(response.data.error || response.data.message || 'Invalid OTP code.');
				}

				// Save user and token objects to localStorage
				if (response.data.user) {
					localStorage.setItem('user', JSON.stringify(response.data.user));
				}
				if (response.data.token) {
					localStorage.setItem('token', response.data.token);
				}

				// Save session
				setSession({
					email: pendingUser.email,
					name: pendingUser.email.split('@')[0].replace('.', ' ').replace(/^\w/, c => c.toUpperCase()),
					role: 'Applicant',
					user: response.data.user || null,
					token: response.data.token || null
				});
				localStorage.removeItem('pendingUser');

				showToast('Email verified! You are now logged in.', 'success');
				
				// Show app area after successful verification
				showDashboard();
				initAppAfterLogin();
			} catch (error) {
				showToast('Invalid OTP code. Please try again.', 'error');
				// Clear OTP inputs
				otpInputsSidebar.forEach(input => {
					input.value = '';
					input.classList.remove('filled');
				});
				if (otpCodeSidebar) otpCodeSidebar.value = '';
				if (verifyBtnSidebar) verifyBtnSidebar.disabled = true;
				if (otpInputsSidebar[0]) otpInputsSidebar[0].focus();
			}
		});
	}

	/* -------- Password Toggle -------- */
	const togglePasswordBtn = document.getElementById('togglePassword');
	const passwordInput = document.getElementById('password');
	const eyeIcon = document.getElementById('eyeIcon');

	if (togglePasswordBtn && passwordInput && eyeIcon) {
		togglePasswordBtn.addEventListener('click', () => {
		const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
		passwordInput.setAttribute('type', type);
		eyeIcon.classList.toggle('fa-eye');
		eyeIcon.classList.toggle('fa-eye-slash');
		});
	}

	// Second password toggle
	const togglePassword2Btn = document.getElementById('togglePassword2');
	const passwordConfirmInput = document.getElementById('password_confirmation');
	const eyeIcon2 = document.getElementById('eyeIcon2');

	if (togglePassword2Btn && passwordConfirmInput && eyeIcon2) {
		togglePassword2Btn.addEventListener('click', () => {
		const type = passwordConfirmInput.getAttribute('type') === 'password' ? 'text' : 'password';
		passwordConfirmInput.setAttribute('type', type);
		eyeIcon2.classList.toggle('fa-eye');
		eyeIcon2.classList.toggle('fa-eye-slash');
		});
	}

	// Sidebar password toggles
	const togglePasswordSidebar = document.getElementById('togglePasswordSidebar');
	const passwordSidebar = document.getElementById('password_sidebar');
	const eyeIconSidebar = document.getElementById('eyeIconSidebar');

	if (togglePasswordSidebar && passwordSidebar && eyeIconSidebar) {
		togglePasswordSidebar.addEventListener('click', () => {
			const type = passwordSidebar.getAttribute('type') === 'password' ? 'text' : 'password';
			passwordSidebar.setAttribute('type', type);
			eyeIconSidebar.classList.toggle('fa-eye');
			eyeIconSidebar.classList.toggle('fa-eye-slash');
		});
	}

	const togglePassword2Sidebar = document.getElementById('togglePassword2Sidebar');
	const passwordConfirmSidebar = document.getElementById('password_confirmation_sidebar');
	const eyeIcon2Sidebar = document.getElementById('eyeIcon2Sidebar');

	if (togglePassword2Sidebar && passwordConfirmSidebar && eyeIcon2Sidebar) {
		togglePassword2Sidebar.addEventListener('click', () => {
			const type = passwordConfirmSidebar.getAttribute('type') === 'password' ? 'text' : 'password';
			passwordConfirmSidebar.setAttribute('type', type);
			eyeIcon2Sidebar.classList.toggle('fa-eye');
			eyeIcon2Sidebar.classList.toggle('fa-eye-slash');
		});
	}

	/* -------- Global functions for navigation -------- */
	window.showStep = showStep;
	window.showHomePage = showHomePage;
	window.showSection = function(sectionName) {
		const user = getSession();
		if (!user) {
			showToast('Please login to access this section', 'warning');
			showAuth();
			showLoginForm();
			return;
		}
		showDashboard();
		showStep(sectionName);
	};

	// Functions for sidebar auth
	window.showAuthenticationForm = function() {
		showAuth();
		showLoginForm();
	};

	window.showRegistrationForm = function() {
		showAuth();
		showRegisterForm();
	};

	/* -------- Init -------- */
	function init() {
		const user = getSession();
		if (user) {
			// If logged in, show home page by default
			showHomePage();
			initAppAfterLogin();
		} else {
			// If not logged in, show home page with login cards
			showHomePage();
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get('register') === 'true') {
				showAuth();
				showRegisterForm();
			} else if (urlParams.get('login') === 'true') {
				showAuth();
				showLoginForm();
			}
		}
	}
	document.addEventListener('DOMContentLoaded', init);

	})();