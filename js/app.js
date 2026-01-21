(() => {
	// let apiUrl = 'https://hrmis.ppda.go.ug/api/v1';
	// let api = 'http://hrmis.local';
	let api = 'https://hrmis.ppda.go.ug';
	let apiUrl = api+'/api/v1';
    // Axios interceptor is defined below with comprehensive error handling
	/* =============== Document Management Module =============== */
	const DocumentManager = {
		getApiBaseUrl() {
			const origin = window.location.origin;
			// If running on a dev server (not on port 8041), point to the backend
			if (!origin.includes(':8041')) {
				// Applicant-side: running on dev server, point to Laravel backend
				return api;
			}
			return origin;
		},

		/**
		 * Fetch document types from API
		 * @returns {Promise<Object>} Document types grouped by section
		 */
		async fetchDocumentTypes() {
			try {
				const baseUrl = this.getApiBaseUrl();
				const response = await fetch(`${baseUrl}/api/v1/document-types`);
				
				if (!response.ok) {
					console.error(`API returned status ${response.status}: ${response.statusText}`);
					return null;
				}
				
				const result = await response.json();
				
				if (result.status === 'success') {
					return result.data;
				} else {
					console.error('Error fetching document types:', result.message);
					return null;
				}
			} catch (error) {
				console.error('Failed to fetch document types:', error);
				return null;
			}
		},

		/**
		 * Fetch document types for a specific section
		 * @param {string} section - The recruitment section name
		 * @returns {Promise<Array>} Array of document types for the sectionF
		 */
		async fetchDocumentTypesBySection(section) {
			try {
				const baseUrl = this.getApiBaseUrl();
				const response = await fetch(`${baseUrl}/api/v1/document-types/${encodeURIComponent(section)}`);
				const result = await response.json();
				
				if (result.status === 'success') {
					return result.data;
				} else {
					console.error('Error fetching document types for section:', result.message);
					return [];
				}
			} catch (error) {
				console.error('Failed to fetch document types for section:', error);
				return [];
			}
		},

		/**
		 * Populate a dropdown with document types
		 * @param {string|HTMLElement} selector - CSS selector or HTML element for the dropdown
		 * @param {Array} documentTypes - Array of document type objects
		 * @param {string} selectedValue - Optional: value to select by default
		 */
		populateDropdown(selector, documentTypes, selectedValue = null) {
			const element = typeof selector === 'string' 
				? document.querySelector(selector) 
				: selector;

			if (!element) {
				console.warn('Dropdown element not found:', selector);
				return;
			}

			// Clear existing options except the first placeholder
			const placeholder = element.options[0];
			element.innerHTML = '';
			if (placeholder) {
				element.appendChild(placeholder.cloneNode(true));
			}

			// Add document type options
			documentTypes.forEach(docType => {
				const option = document.createElement('option');
				option.value = docType.id;
				option.textContent = docType.name;
				
				if (selectedValue && docType.id == selectedValue) {
					option.selected = true;
				}
				
				element.appendChild(option);
			});

			// Trigger change event if Select2 or similar is initialized
			if (typeof jQuery !== 'undefined' && element.classList.contains('select2-hidden-accessible')) {
				jQuery(element).trigger('change');
			}
		},

		/**
		 * Populate a dropdown with document types from a specific section
		 * @param {string|HTMLElement} selector - CSS selector or HTML element for the dropdown
		 * @param {string} section - The recruitment section
		 * @param {string} selectedValue - Optional: value to select by default
		 */
		async populateDropdownBySection(selector, section, selectedValue = null) {
			const documentTypes = await this.fetchDocumentTypesBySection(section);
			this.populateDropdown(selector, documentTypes, selectedValue);
		},

		/**
		 * Initialize all document type dropdowns on the page
		 * Looks for dropdowns with data-section attribute
		 */
		async initializeAllDropdowns() {
			const dropdowns = document.querySelectorAll('[data-section]');
			
			for (const dropdown of dropdowns) {
				const section = dropdown.getAttribute('data-section');
				const selectedValue = dropdown.getAttribute('data-selected');
				await this.populateDropdownBySection(dropdown, section, selectedValue);
			}
		},

		/**
		 * Initialize a single dropdown and populate it with document types
		 * @param {string|HTMLElement} selector - CSS selector or HTML element for the dropdown
		 */
		async initializeDropdown(selector) {
			const element = typeof selector === 'string' 
				? document.querySelector(selector) 
				: selector;

			if (!element) {
				console.warn('Dropdown element not found:', selector);
				return;
			}

			const section = element.getAttribute('data-section');
			const selectedValue = element.getAttribute('data-selected');

			if (section) {
				await this.populateDropdownBySection(selector, section, selectedValue);
			} else {
				// If no section specified, fetch all and populate
				const documentTypes = await this.fetchDocumentTypes();
				if (documentTypes) {
					// Flatten the grouped data
					const flatDocTypes = Object.values(documentTypes).flat();
					this.populateDropdown(selector, flatDocTypes, selectedValue);
				}
			}
		},

		/**
		 * Create and display a document type section selector
		 * @param {string|HTMLElement} container - Container element for the selector
		 * @param {Function} onSectionSelect - Callback function when section is selected
		 */
		async createSectionSelector(container, onSectionSelect) {
			const containerEl = typeof container === 'string'
				? document.querySelector(container)
				: container;

			if (!containerEl) {
				console.warn('Container element not found:', container);
				return;
			}

			const documentTypes = await this.fetchDocumentTypes();
			
			if (!documentTypes) {
				containerEl.innerHTML = '<p class="text-danger">Failed to load document sections</p>';
				return;
			}

			const sections = Object.keys(documentTypes).sort();
			
			let html = '<div class="mb-3">';
			html += '<label class="form-label">Document Section</label>';
			html += '<select class="form-select" id="docSectionSelector">';
			html += '<option value="">-- Select a Section --</option>';
			
			sections.forEach(section => {
				html += `<option value="${section}">${section}</option>`;
			});
			
			html += '</select></div>';
			
			containerEl.innerHTML = html;
			
			const selector = containerEl.querySelector('#docSectionSelector');
			selector.addEventListener('change', (e) => {
				if (onSectionSelect && typeof onSectionSelect === 'function') {
					onSectionSelect(e.target.value);
				}
			});
		},

		/**
		 * Open document viewer modal with PDF viewer
		 * @param {string} filePath - Path to document file
		 * @param {string} fileName - Name of document
		 */
		openDocumentViewer(filePath, fileName) {
			let modal = document.getElementById('documentViewerModal');
			
			// Create modal if it doesn't exist
			if (!modal) {
				const modalHTML = `
					<div class="modal fade" id="documentViewerModal" tabindex="-1" aria-labelledby="documentViewerModalLabel" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered modal-xl">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="documentViewerModalLabel">Document Viewer</h5>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body" id="documentViewerBody" style="min-height: 500px; display: flex; align-items: center; justify-content: center;">
									<div class="spinner-border text-primary" role="status">
										<span class="visually-hidden">Loading...</span>
									</div>
								</div>
								<div class="modal-footer">
									<a id="documentDownloadBtn" href="#" class="btn btn-primary" download target="_blank">
										<i class="fas fa-download"></i> Download
									</a>
									<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
								</div>
							</div>
						</div>
					</div>
				`;
				
				document.body.insertAdjacentHTML('beforeend', modalHTML);
				modal = document.getElementById('documentViewerModal');
			}
			
			// Update title
			const titleEl = modal.querySelector('#documentViewerModalLabel');
			titleEl.textContent = fileName || 'Document Viewer';
			
			const bodyEl = modal.querySelector('#documentViewerBody');
			const downloadBtn = modal.querySelector('#documentDownloadBtn');
			
			const baseUrl = this.getApiBaseUrl();
			const fullPath = filePath.startsWith('http') ? filePath : `${baseUrl}/storage/${filePath}`;
			
			// Set download button
			downloadBtn.href = fullPath;
			downloadBtn.download = fileName || 'document.pdf';
			
			// Display PDF with embedded viewer
			bodyEl.innerHTML = `
				<iframe 
					src="${fullPath}#toolbar=1&navpanes=0&scrollbar=1" 
					style="width: 100%; height: 600px; border: none; border-radius: 4px;"
					title="PDF Viewer">
				</iframe>
			`;
			
			// Show modal
			const bsModal = new bootstrap.Modal(modal);
			bsModal.show();
		},
	};
/* =====================================================
   ELEMENTS
===================================================== */
const authArea = document.getElementById('authArea');
const applicationDashboard = document.getElementById('applicationDashboard');
const userDropdown = document.getElementById('userDropdown');
const btnLogout = document.getElementById('btnLogout');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const verifyEmailForm = document.getElementById('verifyEmailForm');
const showLoginBtn = document.getElementById('showLogin');
const showRegisterBtn = document.getElementById('showRegister');
const forgotPassword = document.getElementById('forgotPassword');
const showForgotPasswordBtn = document.getElementById('showForgotPassword');
const passwordResetForm = document.getElementById('passwordResetForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');

/* =====================================================
   APP STATE
===================================================== */
let currentUser = null;

const urlParams = new URLSearchParams(window.location.search);
const isBrowseMode = urlParams.get('mode') === 'browse';

let hasSelectedJob = false;
let selectedJob = null;

/* =====================================================
   BOOTSTRAP MODALS
===================================================== */
const crudModalEl = document.getElementById('crudModal');
const crudModal = new bootstrap.Modal(crudModalEl);
const crudForm = document.getElementById('crudForm');
const crudModalLabel = document.getElementById('crudModalLabel');
const crudModalBody = document.getElementById('crudModalBody');
const crudItemIdInput = document.getElementById('crudItemId');
const crudSaveBtn = document.getElementById('crudSaveBtn');

const jobDetailsModalEl = document.getElementById('jobDetailsModal');
const jobDetailsModal = new bootstrap.Modal(jobDetailsModalEl);

/* =====================================================
   SESSION MANAGEMENT
===================================================== */
function getSession() {
  const data = localStorage.getItem('userSession');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function setSession(sessionObj) {
  localStorage.setItem('userSession', JSON.stringify(sessionObj));
}

function clearSession() {
  localStorage.removeItem('userSession');
  localStorage.removeItem('token');
  localStorage.removeItem('lastActivity');
}

function getUser() {
  const session = getSession();
  return session ? session.user : null;
}

function getToken() {
  const session = getSession();
  return session ? session.token : null;
}

currentUser = getUser();

/* =====================================================
   UI HELPERS
===================================================== */
// showLoginForm is defined below with full auth form handling

// showDashboard is defined below with full dashboard handling

// showToast is defined below with Bootstrap toast support

/* =====================================================
   AUTO LOGOUT – PRODUCTION SAFE
===================================================== */
const INACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutes
const LAST_ACTIVITY_KEY = 'lastActivity';

// Update last activity whenever user interacts
const activityEvents = [
  'mousemove','mousedown','keypress','scroll','touchstart','click'
];

let activityTimeout = null;
function recordActivity() {
  if (!currentUser) return;
  if (activityTimeout) return; // Debounce
  activityTimeout = setTimeout(() => {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now());
    activityTimeout = null;
  }, 1000);
}

activityEvents.forEach(e =>
  document.addEventListener(e, recordActivity, { passive: true })
);

// Check inactivity every 10 seconds
function checkInactivity() {
  if (!currentUser) return;

  const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
  if (!last) return;

  if (Date.now() - last >= INACTIVITY_THRESHOLD) {
    autoLogout();
  }
}

setInterval(checkInactivity, 10 * 1000);

// Also check when user returns to tab
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) checkInactivity();
});

window.addEventListener('focus', checkInactivity);

/* =====================================================
   LOGOUT
===================================================== */
function autoLogout() {
  clearSession();
  currentUser = null;
  showToast('You have been automatically logged out due to inactivity.', 'warning');
  showLoginForm();

  const ud = document.getElementById('userDropdownContainer');
  if (ud) ud.style.display = 'none';
}

/* =====================================================
   MULTI-TAB LOGOUT SUPPORT
===================================================== */
window.addEventListener('storage', (e) => {
  if (e.key === LAST_ACTIVITY_KEY) checkInactivity();
  if (e.key === 'userSession' && !e.newValue) autoLogout();
});

/* =====================================================
   LOGIN / LOGOUT HANDLERS
===================================================== */
function onLoginSuccess(user, token) {
  setSession({ user, token, loginTime: Date.now() });
  currentUser = user;
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now());
  showDashboard();
}

if (btnLogout) {
  btnLogout.addEventListener('click', autoLogout);
}

/* =====================================================
   RESTORE SESSION ON PAGE LOAD
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  currentUser = getUser();
  if (currentUser) {
    showDashboard();
    checkInactivity();
  } else {
    showLoginForm();
  }
});


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

// Attractive confirm modal returning a Promise<boolean>
function confirmModal(message, title = 'Please Confirm', confirmText = 'Yes, Delete') {
		return new Promise(resolve => {
				const id = 'confirmModal-' + Date.now();
				const modalHtml = `
				<div class="modal fade" id="${id}" tabindex="-1" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content border-0 shadow-sm">
							<div class="modal-header bg-danger text-white">
								<h5 class="modal-title"><i class="fas fa-exclamation-triangle me-2"></i>${title}</h5>
								<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<p class="mb-0">${message}</p>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
								<button type="button" class="btn btn-danger btn-confirm">${confirmText}</button>
							</div>
						</div>
					</div>
				</div>
				`;

				document.body.insertAdjacentHTML('beforeend', modalHtml);
				const modalEl = document.getElementById(id);
				const bsModal = new bootstrap.Modal(modalEl);

				const cleanup = (result) => {
						try { bsModal.hide(); } catch (e) {}
						setTimeout(() => { modalEl.remove(); }, 300);
						resolve(result);
				};

				modalEl.querySelector('.btn-confirm').addEventListener('click', () => cleanup(true));
				modalEl.addEventListener('hidden.bs.modal', () => cleanup(false), { once: true });

				bsModal.show();
		});
}

	/* ----- Authentication UI Toggle ----- */
	function showLoginForm() {
		loginForm.style.display = 'block';
		registerForm.style.display = 'none';
		verifyEmailForm.style.display = 'none';
		forgotPassword.style.display = 'none';
		passwordResetForm.style.display = 'none';
	}

	function showRegisterForm() {
		loginForm.style.display = 'none';
		registerForm.style.display = 'block';
		verifyEmailForm.style.display = 'none';
	}
	function showForgotPasswordForm() {
		loginForm.style.display = 'none';
		registerForm.style.display = 'none';
		forgotPassword.style.display = 'block';
	}

	function showPasswordResetForm() {
		loginForm.style.display = 'none';
		registerForm.style.display = 'none';
		forgotPassword.style.display = 'none';
		passwordResetForm.style.display = 'block';
	}


	/* ----- Display logic based on session ----- */
	function showDashboard() {
		// Hide login form
		authArea.style.display = 'none';

		// Hide home page
		const homePage = document.getElementById('homePage');
		if (homePage) homePage.style.display = 'none';

		// Show application dashboard
		applicationDashboard.style.display = 'block';

		// Show navbar
		// mainNavbar.style.display = 'flex';
		document.body.classList.remove('auth-view');

		// Update navigation items for logged-in user
		const userDropdownContainer = document.getElementById('userDropdownContainer');
		const homeNavItem = document.getElementById('homeNavItem');
		if (userDropdownContainer) userDropdownContainer.style.display = 'block';
		if (homeNavItem) homeNavItem.style.display = 'none';
		loadPositions(currentUser.applicant_type);
	}

	function showAuth() {
		// Hide all other areas
		applicationDashboard.style.display = 'none';
		// mainNavbar.style.display = 'none';
		const homePage = document.getElementById('homePage');
		if (homePage) homePage.style.display = 'block';

		// Show auth area
		authArea.style.display = 'block';
		document.body.classList.add('auth-view');
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
	if (showForgotPasswordBtn) {
		showForgotPasswordBtn.addEventListener('click', (e) => {
			e.preventDefault();
			showForgotPasswordForm();
		});
	}

	// Event listeners for auth toggles in forgot password form
	const forgotPasswordShowLogin = document.querySelector('#forgotPassword #showLogin');
	if (forgotPasswordShowLogin) {
		forgotPasswordShowLogin.addEventListener('click', (e) => {
			e.preventDefault();
			showLoginForm();
		});
	}

	const forgotPasswordShowRegister = document.querySelector('#forgotPassword #showRegister');
	if (forgotPasswordShowRegister) {
		forgotPasswordShowRegister.addEventListener('click', (e) => {
			e.preventDefault();
			showRegisterForm();
		});
	}

	// Event listener for back to login in password reset form
	const backToLoginFromReset = document.getElementById('backToLoginFromReset');
	if (backToLoginFromReset) {
		backToLoginFromReset.addEventListener('click', (e) => {
			e.preventDefault();
			showLoginForm();
		});
	}

	function showVerifyEmailForm(email) {
		const loginForm = document.getElementById('loginForm');
		const registerForm = document.getElementById('registerForm');
		const verifyForm = document.getElementById('verifyEmailForm');
		const emailText = document.getElementById('verifyEmailText');
		if (loginForm) loginForm.style.display = 'none';
		if (registerForm) registerForm.style.display = 'none';
		if (verifyForm) verifyForm.style.display = 'block';
		if (emailText) emailText.textContent = email;
		if (otpInputs[0]) otpInputs[0].focus();
		if (countdownEl) countdownEl.textContent = '(60s)';
		startCountdown();
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
			const response = await axios.post(API.login, { email, password: loginPasswordInputValue });
			
			// Check if response contains error message (backend returns 200 with error message)
			if (response.data.message && response.data.message.toLowerCase().includes('invalid credentials')) {
				showToast(response.data.message, 'error');
				return; // Don't proceed with OTP
			}
			
			showToast('OTP sent to your email.', 'success');

			// Save "pendingUser" temporarily to localStorage
			localStorage.setItem('pendingUser', JSON.stringify({
				email: email,
				verified: false,
			}));

			// showAuth();
			showVerifyEmailForm(email);
			// formElement.reset();
		} catch (error) {
			// Error is already handled by Axios interceptor
			// Just prevent form submission from continuing
			console.error('Login error:', error);
		}
	}

	async function handleForgotPasswordSubmit(e, emailId, formElement) {
		e.preventDefault();
		const emailInput = document.getElementById(emailId);
		if (!emailInput.value) {
			showToast('Please enter your email address.', 'warning');
			return;
		}

		const email = emailInput.value.toLowerCase().trim();

		try {
			// Send forgot password request
			let response = await axios.post(API.forgotPassword, { email });
			// Backend may return the user data in response.data.data when email exists
			if (response.data && response.data.data) {
				// Save under userSession so reset flow can read user.id and user.email
				localStorage.setItem('userSession', JSON.stringify({ user: response.data.data, token: null }));
				showPasswordResetForm();
				// formElement.reset();
			} else {
				showToast('Email not found in our records.', 'error');
			}
		} catch (error) {
			// Provide more detailed logging and surface backend message to the user
			console.error('Forgot password error:', error);
			if (error.response) {
				const resp = error.response;
				const backendMsg = resp.data?.message || resp.data || resp.statusText || error.message;
				console.error('Forgot password response body:', resp.data);
				showToast(backendMsg, 'error', 6000);
			} else if (error.request) {
				showToast('No response from server. Check your network connection.', 'error');
			} else {
				showToast(error.message || 'Failed to process forgot password. Please try again.', 'error');
			}
		}
	}

	async function handlePasswordResetSubmit(e, formElement) {
		e.preventDefault();
		const newPasswordInput = document.getElementById('newPassword');
		const confirmNewPasswordInput = document.getElementById('confirmNewPassword');

		if (!newPasswordInput.value || !confirmNewPasswordInput.value) {
			showToast('Please fill in all password fields.', 'warning');
			return;
		}

		if (newPasswordInput.value !== confirmNewPasswordInput.value) {
			showToast('Passwords do not match.', 'warning');
			return;
		}

		const userSession = localStorage.getItem('userSession') ? JSON.parse(localStorage.getItem('userSession')) : null;
		if (!userSession) {
			showToast('No user details found. Please try forgot password again.', 'error');
			showLoginForm();
			return;
		}
		const user = userSession.user;
		const userId = user.id;
		const userEmail = user.email;
		const newPassword = newPasswordInput.value;
		const confirmNewPassword = confirmNewPasswordInput.value;

		try {
			await axios.post(API.resetPassword, { user_id:userId,user_email:userEmail, new_password: newPassword, new_password_confirmation: confirmNewPassword });
			showToast('Password reset successfully! Please log in with your new password.', 'success');
			// Clear reset email
			localStorage.removeItem('userSession');
			// Show login form
			showLoginForm();
		} catch (error) {
			console.error('Password reset error:', error);
			showToast('Failed to reset password. Please try again.', 'error');
		}
	}

	/**
	 * Checks whether all application sections are completed for a given applicant.
	 * @param {number|string} applicantId - The current user's ID.
	 * @returns {Promise<{completed: boolean, incompleteSections: string[]}>} 
	 */
	async function allSectionsCompleted(applicantId) {
		const tablesToCheck = {
			personalDetails: API.personalDetails(applicantId),
			educations: API.getEducationTraining(applicantId),
			employments: API.getEmploymentHistory(applicantId),
			references: API.getReferees(applicantId),
			documents: API.getDocuments(applicantId),
			// dependants: API.getDependants(applicantId),
			// memberships: API.getProfessionalMemberships(applicantId)
		};

		const incompleteSections = [];

		// Loop through each table/endpoint
		for (const [section, endpoint] of Object.entries(tablesToCheck)) {
			try {
				const response = await axios.get(endpoint);
				const data = response.data;

				// Check if the section is empty
				if (!data || (Array.isArray(data) && data.length === 0)) {
					incompleteSections.push(section);
				}
			} catch (error) {
				console.error(`Error checking section ${section}:`, error);
				incompleteSections.push(section); // treat error as incomplete
			}
		}

		return {
			completed: incompleteSections.length === 0,
			incompleteSections
		};
	}
	
	async function applicantApplicationExists(applicantId,positionId) {
	if (!applicantId) return false;
	if (!positionId) return false;
	// Check cache first
	const cachedApplications = dataCache['submittedApplications'];
	if (Array.isArray(cachedApplications)) {
		// Check if any application matches both applicantId and positionId
		return cachedApplications.some(app => {
			// Try to match applicant and position fields (API may use different keys)
			const appApplicantId = app.applicant_id || app.applicantId || app.user_id || app.userId;
			const appPositionId = app.position_id || app.positionId || app.job_id || app.jobId;
			return String(appApplicantId) === String(applicantId) && String(appPositionId) === String(positionId);
		});
	}

	// Fallback: fetch from API if not in cache
	try {
		const response = await axios.get(API.getApplications(applicantId));
		console.log('API response for applications:', response.data);
		const items = Array.isArray(response.data?.data) ? response.data.data : [];
		console.log('Fetched applications:', items);
		dataCache['submittedApplications'] = items; // cache it
		// Check if any application matches both applicantId and positionId
		return items.some(app => {
			const appApplicantId = app.applicant_id || app.applicantId || app.user_id || app.userId;
			const appPositionId = app.position_id || app.positionId || app.job_id || app.jobId;
			return String(appApplicantId) === String(applicantId) && String(appPositionId) === String(positionId);
		});
	} catch (error) {
		console.error('Error checking application existence:', error);
		return false;
	}
}

	// Prevent multiple applications for the same position
	async function handleApplicationSubmit(applicantId, positionId, formElement) {
		// Check if application already exists
		const exists = await applicantApplicationExists(applicantId, positionId);
		if (exists) {
			showToast('You have already submitted your application for this position.', 'warning');
			return;
		}
		// ...proceed with application submission logic here...
		// e.g., await axios.post(API.postApplication, { applicantId, positionId, ... });
		// showToast('Application submitted successfully!', 'success');
	}

	if (loginForm) {
		loginForm.addEventListener('submit', async e => {
			await handleLoginSubmit(e, 'loginEmail', 'loginPassword', loginForm);
		});
	}

	if (forgotPassword) {
		forgotPassword.addEventListener('submit', async e => {
			await handleForgotPasswordSubmit(e, 'forgotEmail', forgotPassword);
		});
	}
	if (passwordResetForm) {
		passwordResetForm.addEventListener('submit', async e => {
			await handlePasswordResetSubmit(e, passwordResetForm);
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
			const code = otpCode.value;
			const pendingUserStr = localStorage.getItem('pendingUser');
			if (!pendingUserStr) {
				showToast('No pending verification found.', 'error');
				showLoginForm();
				return;
			}
			const pendingUser = JSON.parse(pendingUserStr);

			try {
				// Verify OTP via API
				const response = await axios.post(API.verifyEmail, { code, email: pendingUser.email });

				// Check if the API indicates failure (even with 200 status)
				// Handle various error message patterns
				if (response.data.error || 
					response.data.message === 'Invalid OTP code.' || 
					(response.data.message && response.data.message.toLowerCase().includes('invalid')) ||
					!response.data.success) {
					showToast(response.data.message || response.data.error || 'Invalid OTP code.', 'error');
					// Clear OTP inputs
					otpInputs.forEach(input => {
						input.value = '';
						input.classList.remove('filled');
					});
					if (otpCode) otpCode.value = '';
					if (verifyBtn) verifyBtn.disabled = true;
					if (otpInputs[0]) otpInputs[0].focus();
					return;
				}

				// Save session to localStorage
				setSession({
					role: 'Applicant',
					user: response.data.user || null,
					token: response.data.token || null
				});
				localStorage.removeItem('pendingUser');

				showToast('Email verified! You are now logged in.', 'success');

				// Redirect to index.html to show logged-in navigation
				window.location.href = 'index.html';
			} catch (error) {
				// Error is already handled by Axios interceptor for HTTP errors
				console.error('OTP verification error:', error);
			}
		});
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
		countdown = 300;
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
			countdown = 300;
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
		countdown = 300;
		countdownEl.textContent = `(${countdown}s)`;
		startCountdown();
		otpInputs[0].focus();
	};

	if (btnLogout) {
		btnLogout.addEventListener('click', () => {
			clearSession();
			currentUser = null; // Clear currentUser
			showToast('Logged out successfully', 'success');
			// Hide logged in navigation and user dropdown
			// const userDropdownContainer = document.getElementById('userDropdownContainer');
			// if (userDropdownContainer) userDropdownContainer.style.display = 'none';
			// Redirect to homepage with login form and auto refresh
			window.location.href = 'index.html';
			showLoginForm();
		});
	}
const API = {
	health: `${apiUrl}/health`,
	login: `${apiUrl}/login`,
	registerForm: `${apiUrl}/register`,
	forgotPassword: `${apiUrl}/forgot-password`,
	resetPassword: `${apiUrl}/reset-password`,
	educationTraining: `${apiUrl}/educations`,
	professionalMembership: `${apiUrl}/memberships`,
	employmentHistory: `${apiUrl}/employments`,
	documents: `${apiUrl}/documents`,
	referee: `${apiUrl}/referees`,
	// dependants: `${apiUrl}/dependants`,
	getActivepositions: `${apiUrl}/positions`,
	postApplication: `${apiUrl}/applications`,
	postApplicationSection: `${apiUrl}/application_section`,
	retrieveApplication: `${apiUrl}/retrieve_application`,
	verifyEmail: `${apiUrl}/verify_email`,

	// === ENDPOINTS FOR FRONTEND RETRIEVAL (DYNAMIC) ===
	getApplicant: (id) => `${apiUrl}/applicants/${id}`,
	personalDetails: (id) => `${apiUrl}/applicants/${id}`,
	getApplications: (id) => `${apiUrl}/applications/${id}`,
	getReferees: (id) => `${apiUrl}/referees/${id}`,
	// getDependants: (id) => `${apiUrl}/dependants/${id}`,
	getDocuments: (id) => `${apiUrl}/documents/${id}`,
	getEmploymentHistory: (id) => `${apiUrl}/employments/${id}`,
	getEducationTraining: (id) => `${apiUrl}/educations/${id}`,
	getProfessionalMemberships: (id) => `${apiUrl}/memberships/${id}`,
	getScreeningQuestions: (positionId) => `${apiUrl}/positions/${positionId}/questions`,
	submitScreeningAnswers: (applicationId) => `${apiUrl}/screening/${applicationId}/answers`,
	selectPosition: (positionId) => `${apiUrl}/positions/${positionId}`,
	viewPositions: (applicant_type) =>`${apiUrl}/positions_by/${applicant_type}`,
};

let dataCache = {};

	/* ========== Axios Interceptor for Global Error Handling ========== */
	/**
	 * Response interceptor to catch all API errors globally
	 * Handles 401 (unauthorized), 404 (not found), validation errors, and other errors
	 */
	axios.interceptors.response.use(
		response => response, // Pass through successful responses
		error => {
			// Handle error responses
			if (error.response) {
				const status = error.response.status;
				const data = error.response.data;
				const message = data?.message || 'An error occurred';

				// Handle 401 Unauthorized - invalid credentials or expired token
				if (status === 401) {
					showToast(message || 'Invalid credentials. Please try again.', 'error');
					return Promise.reject(error);
				}

				// Handle 404 Not Found - user doesn't exist
				if (status === 404) {
					showToast(message || 'User not found. Please check your credentials.', 'error');
					return Promise.reject(error);
				}

				// Handle 422 Unprocessable Entity - Validation errors
				if (status === 422) {
					// Check if backend returns validation errors object
					if (data?.errors && typeof data.errors === 'object') {
						// Format validation errors: combine all error messages
						const errorMessages = Object.entries(data.errors)
							.map(([field, errors]) => {
								// errors can be an array or a string
								const errorArray = Array.isArray(errors) ? errors : [errors];
								return errorArray.join(', ');
							})
							.join(' | ');
						showToast(errorMessages || 'Validation failed. Please check your input.', 'error');
					} else {
						// Fallback to message if no errors object
						showToast(message || 'Validation failed. Please check your input.', 'error');
					}
					return Promise.reject(error);
				}

				// Handle other client errors (400, etc.)
				if (status >= 400 && status < 500) {
					showToast(message || 'Request failed. Please check your input.', 'error');
					return Promise.reject(error);
				}

				// Handle server errors (500+)
				if (status >= 500) {
					showToast('Server error. Please try again later.', 'error');
					return Promise.reject(error);
				}
			} else if (error.request) {
				// Request made but no response received
				showToast('No response from server. Please check your connection.', 'error');
			} else {
				// Error in request setup
				showToast('An error occurred. Please try again.', 'error');
			}

			return Promise.reject(error);
		}
	);

	// function getSection(key) {
	// 	const map = {
	// 		educationTraining: 'education',
	// 		professionalMembership: 'memberships',
	// 		employmentHistory: 'employment',
	// 		documents: 'documents',
	// 		referee: 'references',
	// 		// dependants: 'dependants',
	// 		personalDetails: 'personal',
	// 	};
	// 	return map[key] || '';
	// }

	/* ----- Sidebar Navigation ----- */
function showStep(step) {
		currentStep = step;
		sidebarNav.querySelectorAll('a.nav-link').forEach(a => {
			const stepAttr = a.getAttribute('data-step');
			a.classList.toggle('active', stepAttr === step);
		});
		mainPanel.querySelectorAll('section[data-step-content]').forEach(sec => {
		sec.classList.toggle('d-none', sec.getAttribute('data-step-content') !== step);
		});

	// Show sidebar for viewPositions and previewApplication to allow navigation, hide for other steps on desktop
	// On phone (width <= 767px), always show sidebar
	const sidebar = document.querySelector('aside.sidebar');
	if (window.innerWidth <= 767) {
		sidebar.classList.remove('d-none');
	} else {
		if (step === 'viewPositions' || step === 'previewApplication') {
			sidebar.classList.remove('d-none');
		} else {
			sidebar.classList.add('d-none');
		}
	}

		loadStepData(step);
	}

	sidebarNav.addEventListener('click', e => {
		const a = e.target.closest('a.nav-link');
		if (!a) return;
		e.preventDefault();
		const step = a.getAttribute('data-step');
		if (isBrowseMode && step !== 'viewPositions') {
		showToast('You can only browse positions in this mode. Please click View to Continue', 'warning');
		return;
		}
		showStep(step);
	});

function renderTableRows(items, tbodyEl, columns, editCb, deleteCb, customActionsCb) {
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
        
        // Add custom actions if callback provided
        if (customActionsCb && typeof customActionsCb === 'function') {
            const customAction = customActionsCb(item);
            if (customAction) {
                if (customAction instanceof HTMLElement) {
                    tdActions.appendChild(customAction);
                } else {
                    tdActions.insertAdjacentHTML('beforeend', customAction);
                }
                tdActions.insertAdjacentHTML('beforeend', '&nbsp;');
            }
        }
        
		// Add Edit button only when edit callback provided
		if (typeof editCb === 'function') {
			const btnEdit = document.createElement('button');
			btnEdit.className = 'btn btn-sm btn-primary me-2';
			btnEdit.type = 'button';
			btnEdit.innerHTML = '<i class="fa fa-edit"></i>';
			btnEdit.addEventListener('click', () => editCb(item));
			tdActions.appendChild(btnEdit);
		}

		// Add Delete button only when delete callback provided
		if (typeof deleteCb === 'function') {
			const btnDelete = document.createElement('button');
			btnDelete.className = 'btn btn-sm btn-danger';
			btnDelete.type = 'button';
			btnDelete.innerHTML = '<i class="fa fa-trash"></i>';
			btnDelete.addEventListener('click', () => deleteCb(item.id));
			tdActions.appendChild(btnDelete);
		}
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
		console.error('fetchItems error for', key, ':', e);
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
			console.error('createItem error:', e);
			throw e;
		}
	}

	async function updateItem(apiUrl, id, item, key) {
		try {
			const fullUrl = `${apiUrl}/${id}`;
			const response = await axios.put(fullUrl, item);
			const index = dataCache[key].findIndex(i => i.id === id);
			if (index > -1) dataCache[key][index] = response.data;
			return response.data;
		} catch (e) {
			showToast(`Error updating item`, 'error');
			console.error('updateItem error:', e);
			throw e;
		}
	}

	async function deleteItem(apiUrl, id, key) {
		try {
			// If id is a local-only (fallback) id, skip server call
			if (typeof id === 'string' && id.startsWith('user-')) {
				dataCache[key] = (dataCache[key] || []).filter(i => i.id !== id);
				return true;
			}
			await axios.delete(`${apiUrl}/${id}`);
			dataCache[key] = (dataCache[key] || []).filter(i => i.id !== id);
			return true;
		} catch (e) {
		showToast(`Error deleting item`, 'error');
		console.error('deleteItem error:', e);
		return false;
		}
	}

	/* -------- Show Step Data Loaders & Modals -------- */

	// Personal Details
	const formPersonalDetails = document.getElementById('formPersonalDetails');
	async function loadPersonalDetails(){
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
		try {
		// Fetch personal details or create default from session
		const response = await axios.get(API.personalDetails(currentUser.id));
		const session = getSession();
		let pd = response.data || {};
		
		// Normalize property names - handle both camelCase and snake_case from API
		pd.firstName = pd.firstName || pd.first_name || '';
		pd.middleName = pd.middleName || pd.middle_name || '';
		pd.lastName = pd.lastName || pd.last_name || '';
		pd.email = pd.email || '';
		pd.contact = pd.contact || pd.phone_number || '';
		pd.nin = pd.nin || '';
		pd.gender = pd.gender || '';
		pd.dob = pd.dob || '';
		pd.status = pd.status || pd.marital_status || '';
		
		// If no saved data, prefill from user object in localStorage
		if (!pd.firstName && currentUser) {
			pd.firstName = currentUser.first_name || '';
			pd.middleName = currentUser.middle_name || '';
			pd.lastName = currentUser.last_name || '';
			pd.email = currentUser.email || '';
			pd.contact = currentUser.phone_number || '';
			pd.nin = currentUser.nin || '';
			pd.gender = currentUser.gender || '';
			pd.dob = currentUser.dob || '';
			pd.status = currentUser.marital_status || '';
		} else if (!pd.firstName && session) {
			pd.email = session.email;
		}
		
		// Fill form fields
		document.getElementById('firstName').value = pd.first_name || '';
		document.getElementById('middleName').value = pd.middle_name || '';
		document.getElementById('lastName').value = pd.last_name || '';
		document.getElementById('emailDetail').value = pd.email || '';
		document.getElementById('contact').value = pd.contact || '';
		document.getElementById('ninDetail').value = pd.nin || '';
		document.getElementById('genderDetail').value = pd.gender || '';
		document.getElementById('dobDetail').value = pd.dob || '';
		document.getElementById('statusDetail').value = pd.status || '';

		// Store in dataCache for preview - only normalized fields
		const cleanPd = {
			firstName: pd.firstName,
			middleName: pd.middleName,
			lastName: pd.lastName,
			email: pd.email,
			contact: pd.contact,
			nin: pd.nin,
			gender: pd.gender,
			dob: pd.dob,
			status: pd.status
		};
		dataCache['personalDetails'] = [cleanPd];
		} catch (error) {
		// show fallback - try to populate from user object if available
		console.error('Error loading personal details:', error);
		const session = getSession();
		
		if (currentUser) {
			document.getElementById('firstName').value = currentUser.first_name || '';
			document.getElementById('middleName').value = currentUser.middle_name || '';
			document.getElementById('lastName').value = currentUser.last_name || '';
			document.getElementById('emailDetail').value = currentUser.email || '';
			document.getElementById('contact').value = currentUser.phone_number || '';
			document.getElementById('ninDetail').value = currentUser.nin || '';
			document.getElementById('genderDetail').value = currentUser.gender || '';
			document.getElementById('dobDetail').value = currentUser.dob || '';
			document.getElementById('statusDetail').value = currentUser.marital_status || '';
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
			first_name: document.getElementById('firstName').value.trim(),
			middle_name: document.getElementById('middleName').value.trim(),
			last_name: document.getElementById('lastName').value.trim(),
			email: document.getElementById('emailDetail').value.trim(),
			phone_number: document.getElementById('contact').value.trim(),
			nin: document.getElementById('ninDetail').value.trim(),
			gender: document.getElementById('genderDetail').value,
			dob: document.getElementById('dobDetail').value,
			marital_status: document.getElementById('statusDetail').value,
			};
			try {
			await axios.put(API.personalDetails(currentUser.id), data);
			showToast('Personal details saved.', 'success');
			} catch {
			showToast('Failed to save personal details.', 'error');
			}
		});
	}

// ==============================
// Education and Training Module
// ==============================

// Table body reference
const educationTableBody = document.querySelector('#educationTable tbody');

// Open Education Modal
document.getElementById('btnAddEducation').addEventListener('click', () => openEducationModal());

function openEducationModal(editItem = null) {
    crudModalLabel.innerHTML = `
        <i class="fas fa-graduation-cap me-2"></i>
        ${editItem ? 'Edit Education' : 'Add Education'}
    `;

    crudItemIdInput.value = editItem ? editItem.id : '';

    crudModalBody.innerHTML = `
        <form id="educationForm">
            <input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">

            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" value="" id="ongoing" name="ongoing" ${editItem?.ongoing ? 'checked' : ''}>
                <label class="form-check-label fw-bold" for="ongoing">Ongoing</label>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
					<label class="form-label fw-bold">From Year <span class="text-danger">*</span></label>
                    <select class="form-select" id="start_year" name="start_year" required>
                        <option value="">Select Year</option>
                        ${Array.from({length: new Date().getFullYear() - 1980 + 1}, (_, i) => 1980 + i)
                            .map(year => `<option value="${year}" ${editItem?.start_year == year ? 'selected' : ''}>${year}</option>`).join('')}
                    </select>
                </div>

                <div class="col-md-6 mb-3" id="end_year_container">
                    <label class="form-label fw-bold">To Year</label>
                    <select class="form-select" id="end_year" name="end_year">
                        <option value="">Select Year</option>
                        ${Array.from({length: new Date().getFullYear() - 1980 + 1}, (_, i) => 1980 + i)
                            .map(year => `<option value="${year}" ${editItem?.end_year == year ? 'selected' : ''}>${year}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="row">
                <div class="col-md-8 mb-3">
					<label class="form-label fw-bold">Qualification <span class="text-danger">*</span></label>
                    <select class="form-select" id="qualification" name="qualification" required>
                        <option value="">Select Qualification</option>
                        <option value="PhD" ${editItem?.qualification === 'PhD' ? 'selected' : ''}>PhD</option>
                        <option value="Masters" ${editItem?.qualification === 'Masters' ? 'selected' : ''}>Masters</option>
                        <option value="Bachelors" ${editItem?.qualification === 'Bachelors' ? 'selected' : ''}>Bachelors</option>
                        <option value="Diploma" ${editItem?.qualification === 'Diploma' ? 'selected' : ''}>Diploma</option>
                        <option value="Certificate" ${editItem?.qualification === 'Certificate' ? 'selected' : ''}>Certificate</option>
                        <option value="Transcript" ${editItem?.qualification === 'Transcript' ? 'selected' : ''}>Transcript</option>
                        <option value="Post Graduate" ${editItem?.qualification === 'Post Graduate' ? 'selected' : ''}>Post Graduate</option>
                        <option value="Professional Certification" ${editItem?.qualification === 'Professional Certification' ? 'selected' : ''}>Professional Certification</option>
                    </select>
                </div>

                <div class="col-md-4 mb-3" id="classOfDegreeContainer" style="display: none;">
                    <label class="form-label fw-bold">Class of Degree</label>
                    <select class="form-control" id="degree_class" name="degree_class">
                        <option value="">Select Class</option>
                        <option value="First Class" ${editItem?.degree_class === 'First Class' ? 'selected' : ''}>First Class</option>
                        <option value="Second Class Upper" ${editItem?.degree_class === 'Second Class Upper' ? 'selected' : ''}>Second Class Upper</option>
                        <option value="Second Class Lower" ${editItem?.degree_class === 'Second Class Lower' ? 'selected' : ''}>Second Class Lower</option>
                        <option value="Distinction" ${editItem?.degree_class === 'Distinction' ? 'selected' : ''}>Distinction</option>
                        <option value="Merit" ${editItem?.degree_class === 'Merit' ? 'selected' : ''}>Merit</option>
                        <option value="Pass" ${editItem?.degree_class === 'Pass' ? 'selected' : ''}>Pass</option>
                    </select>
                </div>

                <div class="col-md-12 mb-3">
					<label class="form-label fw-bold">Program/Course <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="course" name="course" required value="${editItem?.course || ''}">
                </div>
                <div class="col-md-12 mb-3">
					<label class="form-label fw-bold">Institution <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="institution" name="institution" required value="${editItem?.institution || ''}">
                </div>
            </div>

            
        </form>
    `;

    crudModal.show();

    // --- Class of Degree toggle ---
    const qualificationSelect = document.getElementById('qualification');
    const classContainer = document.getElementById('classOfDegreeContainer');
    function toggleClassOfDegree() {
        classContainer.style.display = qualificationSelect.value === 'Bachelors' ? 'block' : 'none';
    }
    qualificationSelect.addEventListener('change', toggleClassOfDegree);
    toggleClassOfDegree();

    // --- Ongoing checkbox toggle ---
    const ongoingCheckbox = document.getElementById('ongoing');
    const endYearSelect = document.getElementById('end_year');
    const endYearContainer = document.getElementById('end_year_container');

    function toggleEndYear() {
        if (ongoingCheckbox.checked) {
            endYearContainer.style.display = 'none';
            endYearSelect.disabled = true;
            endYearSelect.value = '';
        } else {
            endYearContainer.style.display = '';
            endYearSelect.disabled = false;
        }
    }
    ongoingCheckbox.addEventListener('change', toggleEndYear);
    toggleEndYear();

    // --- End Year validation: end >= start ---
    const startYearSelect = document.getElementById('start_year');
    function updateEndYearOptions() {
        const startYear = parseInt(startYearSelect.value);

        Array.from(endYearSelect.options).forEach(option => {
            if (!option.value) return;
            const year = parseInt(option.value);
            option.disabled = startYear && year < startYear;
        });

        if (endYearSelect.value && parseInt(endYearSelect.value) < startYear) {
            endYearSelect.value = '';
        }
    }
    startYearSelect.addEventListener('change', updateEndYearOptions);
    endYearSelect.addEventListener('change', function () {
        if (startYearSelect.value && this.value < startYearSelect.value) {
            showToast('End year cannot be earlier than start year.', 'warning');
            this.value = '';
        }
    });
    updateEndYearOptions();

    // --- Save Education on form submit ---
    const form = document.getElementById('educationForm');
    if (!form) return;
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const data = {
            applicant_id: form.applicant_id.value,
            start_year: startYearSelect.value,
            end_year: endYearSelect.value || null,
            ongoing: ongoingCheckbox.checked,
            qualification: qualificationSelect.value,
            degree_class: document.getElementById('degree_class').value,
            course: document.getElementById('course').value,
            institution: document.getElementById('institution').value
        };

        try {
            const id = crudItemIdInput.value;
            if (id) {
                await updateItem(API.educationTraining, id, data);
            } else {
                await addItem(API.educationTraining, data);
            }

            crudModal.hide();
            showToast('Education saved successfully', 'success');

            // 🔑 Refresh table after saving
            await loadEducation();

        } catch (error) {
            console.error('Error saving education:', error);
            showToast('Failed to save education', 'error');
        }
    });
}

// ==============================
// Load Education Table
// ==============================
async function loadEducation() {
    if (!currentUser || !currentUser.id) {
        showToast('User not authenticated. Please log in.', 'warning');
        return;
    }

    try {
        let items = [];
        const educationUrl = API.getEducationTraining(currentUser.id);
        items = await fetchItems(educationUrl, 'educationTraining');

        // Fallback to local data if API empty
        if (!items || items.length === 0) {
            if (currentUser.education && Array.isArray(currentUser.education)) {
                items = currentUser.education.map((edu, index) => ({
                    id: `user-edu-${index}`,
                    start_year: edu.start_year || '',
                    end_year: edu.end_year || '',
                    qualification: edu.qualification || edu.degree || '',
                    course: edu.course || edu.program || edu.field_of_study || '',
                    institution: edu.institution || '',
                    degree_class: edu.degree_class || '',
                    ongoing: edu.ongoing || false
                }));
            }
        }

        renderTableRows(
            items,
            educationTableBody,
            [
                { key: 'start_year' },
                { key: 'end_year' },
                { key: 'qualification' },
                { key: 'course' },
                { key: 'institution' },
                { key: 'degree_class' },
                { key: 'ongoing', formatter: val => val ? 'Current' : 'Past' }
            ],
            openEducationModal,
            async id => {
                const confirmed = await confirmModal('Delete this education record?', 'Delete Education', 'Delete');
                if (confirmed) {
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


// ==============================
// Professional Membership Module
// ==============================

// Table body reference
const membershipTableBody = document.querySelector('#membershipTable tbody');

document.getElementById('btnAddMembership').addEventListener('click', () => openMembershipModal());

function openMembershipModal(editItem = null) {

    crudModalLabel.innerHTML = `
        <i class="fas fa-users me-2"></i>
        ${editItem ? 'Edit Membership' : 'Add Membership'}
    `;

    crudItemIdInput.value = editItem ? editItem.id : '';

    crudModalBody.innerHTML = `
        <form id="membershipForm">
            <input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Enrollment Year<span class="text-danger">*</span></label>
                    <select class="form-select" id="enrollment_year" name="enrollment_year" required>
                        <option value="">Select Year</option>
                        ${Array.from({length: new Date().getFullYear() - 1980 + 1}, (_, i) => 1980 + i)
                            .map(year => `<option value="${year}" ${editItem?.enrollment_year == year ? 'selected' : ''}>${year}</option>`).join('')}
                    </select>
                </div>

                <div class="col-md-6 mb-3" id="expiry_year_container">
                    <label class="form-label fw-bold">Year of Expiry</label>
                    <select class="form-select" id="expiry_year" name="expiry_year">
                        <option value="">Select Year</option>
                        ${Array.from({length: new Date().getFullYear() - 1980 + 1}, (_, i) => 1980 + i)
                            .map(year => `<option value="${year}" ${editItem?.expiry_year == year ? 'selected' : ''}>${year}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="col-md-12 mb-3">
                <label class="form-label fw-bold">Institute<span class="text-danger">*</span></label>
                <input type="text" class="form-control" 
                    id="membershipInstitute" 
                    name="institute" 
                    placeholder="Eg, ISACA, Rotary, Lions Club" 
                    required
                    value="${editItem?.institute || ''}">
            </div>

            <div class="col-md-12 mb-3">
                <label class="form-label fw-bold">Membership Type<span class="text-danger">*</span></label>
                <input type="text" class="form-control"
                    id="membershipType" 
                    name="type" 
                    placeholder="Eg, Member, Student, Chairperson"
                    required
                    value="${editItem?.type || ''}">
            </div>

            <div class="col-md-12 mb-3">
                <label class="form-label fw-bold">Membership Number</label>
                <input type="text" class="form-control"
                    id="membershipNumber" 
                    name="membership_number"    
                    placeholder="Eg, 12345"
                    value="${editItem?.membership_number || ''}">
            </div>

           
        </form>
    `;

    crudModal.show();

    // --- Year validation: expiry_year >= enrollment_year ---
    const enrollmentSelect = document.getElementById('enrollment_year');
    const expirySelect = document.getElementById('expiry_year');

    function updateExpiryOptions() {
        const enrollYear = parseInt(enrollmentSelect.value);

        Array.from(expirySelect.options).forEach(option => {
            if (!option.value) return;
            const year = parseInt(option.value);

            option.disabled = enrollYear && year < enrollYear;
        });

        if (expirySelect.value && parseInt(expirySelect.value) < enrollYear) {
            expirySelect.value = '';
        }
    }

    enrollmentSelect.addEventListener('change', updateExpiryOptions);
    expirySelect.addEventListener('change', function () {
        if (enrollmentSelect.value && this.value < enrollmentSelect.value) {
            showToast('Expiry year cannot be earlier than enrollment year.', 'warning');
            this.value = '';
        }
    });

    updateExpiryOptions();

    // --- Save Membership on form submit ---
    const form = document.getElementById('membershipForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const data = {
            applicant_id: enrollmentSelect.value,
            enrollment_year: enrollmentSelect.value,
            expiry_year: expirySelect.value || null,
            institute: document.getElementById('membershipInstitute').value,
            type: document.getElementById('membershipType').value,
            membership_number: document.getElementById('membershipNumber').value
        };

        try {
            const id = crudItemIdInput.value;
            if (id) {
                await updateItem(API.professionalMembership, id, data);
            } else {
                await addItem(API.professionalMembership, data);
            }

            crudModal.hide();
            showToast('Membership saved successfully', 'success');

            // 🔑 Refresh table after saving
            await loadMembership();

        } catch (error) {
            console.error('Error saving membership:', error);
            showToast('Failed to save membership', 'error');
        }
    });
}

// ==============================
// Load Membership Table
// ==============================
async function loadMembership() {
    if (!currentUser || !currentUser.id) {
        showToast('User not authenticated. Please log in.', 'warning');
        return;
    }

    try {
        let items = [];
        const membershipUrl = API.getProfessionalMemberships(currentUser.id);
        items = await fetchItems(membershipUrl, 'professionalMembership');

        // fallback if no API data
        if (!items || items.length === 0) {
            if (currentUser.memberships && Array.isArray(currentUser.memberships)) {
                items = currentUser.memberships.map((mem, index) => ({
                    id: `user-mem-${index}`,
                    enrollment_year: mem.enrollment_year || '',
                    expiry_year: mem.expiry_year || '',
                    membership_number: mem.membership_number || '',
                    type: mem.type || '',
                    institute: mem.institute || ''
                }));
                dataCache['professionalMembership'] = items;
            }
        }

        renderTableRows(
            items,
            membershipTableBody,
            [
                { key: 'enrollment_year' },
                { key: 'expiry_year' },
                { key: 'membership_number' },
                { key: 'type' },
                { key: 'institute' }
            ],
            openMembershipModal,
            async id => {
                const confirmed = await confirmModal('Delete this membership record?', 'Delete Membership', 'Delete');
                if (confirmed) {
                    const success = await deleteItem(API.professionalMembership, id, 'professionalMembership');
                    if (success) loadMembership();
                }
            }
        );

    } catch (error) {
        console.error('Error loading memberships:', error);
    }
}


	// ==============================
// Employment History Module
// ==============================

const employmentTableBody = document.querySelector('#employmentTable tbody');

document.getElementById('btnAddEmployment').addEventListener('click', () => openEmploymentModal());

function openEmploymentModal(editItem = null) {

    crudModalLabel.innerHTML = `
        <i class="fas fa-briefcase me-2"></i>
        ${editItem ? 'Edit Employment' : 'Add Employment'}
    `;

    crudItemIdInput.value = editItem ? editItem.id : '';

    crudModalBody.innerHTML = `
        <form id="employmentForm">
            <input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">

            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" value="" id="is_current" name="is_current" ${editItem?.is_current ? 'checked' : ''}>
                <label class="form-check-label fw-bold" for="is_current">Currently Employed Here</label>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
					<label class="form-label fw-bold">From Date <span class="text-danger">*</span></label>
                    <input type="date" class="form-control" name="start_date" id="start_date" value="${editItem?.start_date || ''}" required>
                </div>

                <div class="col-md-6 mb-3" id="end_date_container" ${editItem?.is_current ? 'style="display: none;"' : ''}>
                    <label class="form-label fw-bold">To Date</label>
                    <input type="date" class="form-control" name="end_date" id="end_date" value="${editItem?.end_date || ''}" ${editItem?.is_current ? 'disabled' : ''}>
                </div>
            </div>

            <div class="mb-3">
				<label for="employer" class="form-label fw-bold">Employer <span class="text-danger">*</span></label>
                <input type="text" class="form-control" name="employer" placeholder="e.g. Tech Solutions Inc." required value="${editItem?.employer || ''}">
            </div>

            <div class="mb-3">
				<label for="position" class="form-label fw-bold">Position Held <span class="text-danger">*</span></label>
                <input type="text" class="form-control" name="position" placeholder="e.g. Software Developer" required value="${editItem?.position || ''}">
            </div>

            <div class="mb-3">
				<label for="duties" class="form-label fw-bold">Duties <span class="text-danger">*</span></label>
                <textarea class="form-control" name="duties" rows="5" placeholder="e.g. Developed web applications" required>${editItem?.duties || ''}</textarea>
            </div>

            
        </form>
    `;

    crudModal.show();

    const isCurrentCheckbox = document.getElementById('is_current');
    const endDateInput = document.getElementById('end_date');
    const endDateContainer = document.getElementById('end_date_container');
    const startDateInput = document.getElementById('start_date');

    // --- Toggle end_date input based on "Currently Employed" ---
    function toggleEndDate() {
        if (isCurrentCheckbox.checked) {
            endDateInput.disabled = true;
            endDateContainer.style.display = 'none';
            endDateInput.value = '';
        } else {
            endDateInput.disabled = false;
            endDateContainer.style.display = '';
        }
    }
    isCurrentCheckbox.addEventListener('change', toggleEndDate);
    toggleEndDate(); // initial

    // --- Validate end_date >= start_date ---
    function validateEndDate() {
        if (endDateInput.value && startDateInput.value && endDateInput.value < startDateInput.value) {
            showToast('End date cannot be earlier than start date.', 'warning');
            endDateInput.value = '';
        }
    }

    startDateInput.addEventListener('change', () => {
        if (endDateInput.value && endDateInput.value < startDateInput.value) {
            endDateInput.value = '';
        }
    });

    endDateInput.addEventListener('change', validateEndDate);

    // --- Handle form submit ---
    const form = document.getElementById('employmentForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const data = {
            applicant_id: form.applicant_id.value,
            start_date: startDateInput.value,
            end_date: endDateInput.value || null,
            employer: form.employer.value,
            position: form.position.value,
            duties: form.duties.value,
            is_current: isCurrentCheckbox.checked
        };

        try {
            const id = crudItemIdInput.value;
            if (id) {
                await updateItem(API.employmentHistory, id, data);
            } else {
                await addItem(API.employmentHistory, data);
            }

            crudModal.hide();
            showToast('Employment history saved successfully', 'success');

            // Refresh table
            await loadEmployment();

        } catch (error) {
            console.error('Error saving employment history:', error);
            showToast('Failed to save employment history', 'error');
        }
    });
}

// ==============================
// Load Employment Table
// ==============================
async function loadEmployment() {
    if (!currentUser || !currentUser.id) {
        showToast('User not authenticated. Please log in.', 'warning');
        return;
    }

    try {
        let items = await fetchItems(API.getEmploymentHistory(currentUser.id), 'employmentHistory');

        // fallback if no API data
        if (!items || items.length === 0) {
            if (currentUser.employments && Array.isArray(currentUser.employments)) {
                items = currentUser.employments.map((emp, index) => ({
                    id: `user-emp-${index}`,
                    start_date: emp.start_date || '',
                    end_date: emp.end_date || '',
                    employer: emp.employer || '',
                    position: emp.position || '',
                    duties: emp.duties || '',
                    is_current: emp.is_current || false
                }));
                dataCache['employmentHistory'] = items;
            }
        }

        renderTableRows(
            items,
            employmentTableBody,
            [
                { key: 'start_date' },
                { key: 'end_date' },
                { key: 'employer' },
                { key: 'position' },
                { key: 'duties' },
                { key: 'is_current', formatter: val => val ? 'Current' : 'Past' }
            ],
            openEmploymentModal,
            async id => {
                const confirmed = await confirmModal('Delete this Employment History record?', 'Delete Employment', 'Delete');
                if (confirmed) {
                    const success = await deleteItem(API.employmentHistory, id, 'employmentHistory');
                    if (success) loadEmployment();
                }
            }
        );

    } catch (error) {
        console.error('Error loading employment history:', error);
    }
}

	

	// Referee 
const refereeTableBody = document.querySelector('#refereeTable tbody');

document.getElementById('btnAddReferee').addEventListener('click', () => openRefereeModal());

function openRefereeModal(editItem = null) {
	const refereesCount = refereeTableBody.querySelectorAll('tr').length;
	const addRefereeBtn = document.getElementById('btnAddReferee');
	// Only block adding when at limit; allow editing existing records even at max
	if (!editItem && refereesCount >= 3) {
		if (addRefereeBtn) addRefereeBtn.disabled = true;
		showToast('You have reached the maximum number of referees.', 'warning');
		return;
	}
	// Ensure Add button is enabled when editing an existing item
	if (editItem && addRefereeBtn) addRefereeBtn.disabled = false;
    crudModalLabel.innerHTML = `
        <i class="fas fa-briefcase me-2"></i>
        ${editItem ? 'Edit Referee' : 'Add Referee'}
    `;	

    // Set ID (used for update)
    crudItemIdInput.value = editItem ? editItem.id : '';

    // Modal form body
    crudModalBody.innerHTML = `
        <input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">

		<div class="row">
		
			<div class="col-md-6 mb-3">
			   <label for="name" class="form-label fw-bold">Full Name <span class="text-danger">*</span></label>
			<input type="text" class="form-control" id="name" name="name"  required value="${editItem?.name || ''}">
			</div>


			<div class="col-md-6 mb-3">
			   <label for="address" class="form-label fw-bold">Address <span class="text-danger">*</span></label>
			<input type="text" class="form-control" id="address" name="address"  required value="${editItem?.address || ''}"/>
				
			</div>
		</div>

		<div class="row">
		
			<div class="col-md-6 mb-3">
				   <label for="position" class="form-label fw-bold">Position <span class="text-danger">*</span></label>
				<input type="text" class="form-control" id="position" name="position"  required value="${editItem?.position || ''}">
			</div>
			<div class="col-md-6 mb-3">
				   <label for="email" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
				<input type="email" class="form-control" id="email" name="email"  required value="${editItem?.email || ''}"/>
				
			</div>
		</div>

		<div class="row">
		
			<div class="col-md-6 mb-3">
			   <label for="tel" class="form-label fw-bold">Contact <span class="text-danger">*</span></label>
			<input type="text" class="form-control" id="tel" name="tel"  required value="${editItem?.tel || ''}">
			</div>

			<div class="col-md-6 mb-3">
			   <label for="relationship" class="form-label fw-bold">Relationship <span class="text-danger">*</span></label>
			<input type="text" class="form-control" id="relationship" name="relationship"  required value="${editItem?.relationship || ''}"/>

		</div>
    `;

	crudModal.show();

	// Focus first input for convenience
	const firstInput = crudModalBody.querySelector('input[name="name"]');
	if (firstInput) firstInput.focus();

	// When modal closes, re-evaluate Add button enabled state
	if (addRefereeBtn) {
		const onHidden = () => {
			const currentCount = refereeTableBody.querySelectorAll('tr').length;
			addRefereeBtn.disabled = currentCount >= 3;
			crudModalEl.removeEventListener('hidden.bs.modal', onHidden);
		};
		crudModalEl.addEventListener('hidden.bs.modal', onHidden);
	}
}
	async function loadReferee() {
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
		let items = [];
		// Use GET route for applicant
		items = await fetchItems(API.getReferees(currentUser.id), 'referee');
		// fallback if no API data
		if (!items || items.length === 0) {
			if (currentUser && currentUser.referees && Array.isArray(currentUser.referees)) {
				items = currentUser.referees.map((mem, index) => ({
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
			const confirmed = await confirmModal('Delete this Referee record?', 'Delete Referee', 'Delete');
			if (confirmed) {
				const success = await deleteItem(API.referee, id, 'referee');
				if (success) loadReferee();
			}
		});
	}


	// Documents 
const documentsTableBody = document.querySelector('#documentsTable tbody');

document.getElementById('btnAddDocument').addEventListener('click', () => openDocumentModal());

async function openDocumentModal(editItem = null) {

    crudModalLabel.innerHTML = `
        <i class="fas fa-file me-2"></i>
        ${editItem ? 'Edit Document' : 'Add Document'}
    `;

    // Set ID (used for update)
    crudItemIdInput.value = editItem ? editItem.id : '';

    // Fetch document types BEFORE showing modal
    let documentTypes = {};
    let documentTypeOptions = '<option value="">-- Select Document Type --</option>';
    
    try {
        documentTypes = await DocumentManager.fetchDocumentTypes();
        
        if (documentTypes && Object.keys(documentTypes).length > 0) {
            // Build options with optgroups for each section
            Object.keys(documentTypes).sort().forEach(section => {
                documentTypeOptions += `<optgroup label="${section}">`;
                documentTypes[section].forEach(docType => {
                    const selected = editItem && editItem.document_type_id == docType.id ? 'selected' : '';
                    documentTypeOptions += `<option value="${docType.id}" ${selected}>${docType.name}</option>`;
                });
                documentTypeOptions += '</optgroup>';
            });
        }
    } catch (error) {
        console.error('Error loading document types:', error);
        documentTypeOptions = '<option value="">Error loading document types. Please refresh.</option>';
    }
    // Modal form body with pre-populated dropdown
    crudModalBody.innerHTML = `
        <input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">
		<div class="row">
        <div class="col-md-6 mb-3">
          <label for="document_type_id" class="form-label fw-bold">Document Type <span class="text-danger">*</span></label>
          <select type="text" class="form-control form-control" id="document_type_id" name="document_type_id" required>
            ${documentTypeOptions}
          </select>
          </div>
        <div class="col-md-6 mb-3">
		  <label for="title" class="form-label fw-bold">Document Title <span class="text-danger">*</span></label>
          <input type="text" class="form-control form-control" id="title" name="title" placeholder="e.g. Transcript" required value="${editItem ? editItem.title : ''}">
        </div>
      </div>
      <div class="mb-3">
		<label for="file_path" class="form-label fw-bold"><i class="fas fa-upload me-1"></i>Choose File <span class="text-danger">*</span></label>
        <input type="file" class="form-control form-control" id="file_path" name="file_path" accept="application/pdf" ${editItem ? '' : 'required'}>
        <small class="form-text text-muted">
          <i class="fas fa-info-circle"></i> PDF files only, maximum 2MB
        </small>
      </div>
    `;

    // Show modal with fully populated dropdown
    crudModal.show();
}
	async function loadDocuments() {
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
		let items = [];
		// Use GET route for applicant
		items = await fetchItems(API.getDocuments(currentUser.id), 'documents');
		// fallback if no API data
		if (!items || items.length === 0) {
			if (currentUser && currentUser.documents && Array.isArray(currentUser.documents)) {
				items = currentUser.documents.map((mem, index) => ({
					id: `user-mem-${index}`,
					doc_name: mem.doc_name || '',
					file_path: mem.file_path || '',
					document_type: mem.document_type || '',
					section: mem.section || ''

				}));
				dataCache['documents'] = items;
			}
		}
		renderTableRows(items, documentsTableBody, [
			{ key: 'section' },
			{key: 'document_type' },
			{ key: 'doc_name' },
		// {key: 'document_type', formatter: val => val ? 'Uploaded' : 'Not Uploaded' },
		], null, async id => {
			const confirmed = await confirmModal('Delete this document record?', 'Delete Document', 'Delete');
			if (confirmed) {
				const success = await deleteItem(API.documents, id, 'documents');
				if (success) loadDocuments();
			}
		}, null);
	}


	// Submitted Applications
	const myApplicationsTableBody = document.querySelector('#myApplicationsTable tbody');
	async function loadSubmittedApplications() {
		if (!currentUser?.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}

		try {
			const response = await axios.get(API.getApplications(currentUser.id));
			// ✅ Laravel Resource Collection shape
			const items = Array.isArray(response.data?.data)
				? response.data.data
				: [];
			if (items.length === 0) {
				myApplicationsTableBody.innerHTML = `
					<tr>
						<td colspan="6" class="text-center text-muted">
							No submitted applications found
						</td>
					</tr>
				`;
				return;
			}

			dataCache['submittedApplications'] = items;
			renderTableRows(
				items,
				myApplicationsTableBody,
				[
					{ key: 'position_title' },
					{ key: 'application_id'},
					{ key: 'submitted_date'},
					{ key: 'deadline_date' },
					{ key: 'deadline_time' },
					{ key: 'status' }
				],
				null,
				null
			);
		} catch (error) {
			console.error('Error loading submitted applications:', error);
			showToast('Failed to load submitted applications.', 'error');
		}
	}


	// Preview Application
	const previewSection = document.querySelector('section[data-step-content="previewApplication"]');
	async function loadPreview() {
		// Automatically fetch all data when reaching preview
		await loadPersonalDetails();
		await loadEducation();
		await loadMembership();
		await loadEmployment();
		// await loadDocuments();
		await loadReferee();
		// await loadDependants();
		await loadSubmittedApplications();
		   // Screening Questions Preview (if available)
		   let screeningHtml = '';
		   if (cachedScreeningAnswers && screeningQuestions && screeningQuestions.length > 0) {
			   screeningHtml += `<div class="mb-4">
				   <h5 class="text-primary"><i class="fa fa-question-circle me-2"></i>Screening Questions & Answers</h5>
				   <table class="table table-bordered">
					   <thead><tr><th>Question</th><th>Your Answer</th></tr></thead>
					   <tbody>`;
			   for (const q of screeningQuestions) {
				   const answerObj = (cachedScreeningAnswers.answers || []).find(a => a.question_id == q.id || a.question_id == q.question_id);
				   let answerText = answerObj ? answerObj.answer_text : '<span class="text-danger">No answer</span>';
				   // Format array answers
				   if (Array.isArray(answerText)) answerText = answerText.map(v => v === 1 ? 'Yes' : v === 0 ? 'No' : v).join(', ');
				   // Show Yes/No for boolean-like answers
				   if (answerText === 1) answerText = 'Yes';
				   else if (answerText === 0) answerText = 'No';
				   else if (typeof answerText === 'string' && (answerText === '1' || answerText === '0')) answerText = answerText === '1' ? 'Yes' : 'No';
				   screeningHtml += `<tr><td>${q.question_text || q.text || ''}</td><td>${answerText}</td></tr>`;
			   }
			   screeningHtml += '</tbody></table></div>';
		   }

		let html = screeningHtml + '<div class="row">';

		const sectionTitles = {
			educationTraining: 'Education & Training',
			professionalMembership: 'Professional Memberships',
			employmentHistory: 'Employment History',
			// documents: 'Documents',
			referee: 'References',
			// dependants: 'Dependants',
			personalDetails: 'Personal Details'
		};

		const excludedFields = ['updated_at', 'created_at', 'applicant_id'];

		for (const key in dataCache) {
			if (!dataCache[key] || dataCache[key].length === 0) continue;
			const sectionTitle = sectionTitles[key] || key.replace(/([A-Z])/g, ' $1').trim();
			const items = dataCache[key];
			let keys = Object.keys(items[0]).filter(k => !excludedFields.includes(k));
			if (key === 'personalDetails') {
				keys = keys.filter(k => ['firstName', 'middleName', 'lastName', 'gender', 'dob', 'contact', 'status'].includes(k));
			}
			html += `
				<div class="col-md-12 mb-4">
					<h5>${sectionTitle}</h5>
					<table class="table table-striped">
						<thead>
							<tr>
								${keys.map(k => {
									let displayKey = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
									return `<th>${displayKey}</th>`;
								}).join('')}
							</tr>
						</thead>
						<tbody>
							${items.map(item => {
								return `<tr>${keys.map(k => {
									let v = item[k];
									if (v === null || v === undefined || v === '') return '<td></td>';
									let displayValue = v;
									// Format dates
									if (k.includes('date') || k.includes('_at')) {
										if (v && !isNaN(Date.parse(v))) {
											displayValue = new Date(v).toLocaleDateString();
										}
									}
									// Format boolean values
									if (typeof v === 'boolean') {
										displayValue = v ? 'Yes' : 'No';
									}
									// Format ongoing field specifically
									if (k === 'ongoing') {
										displayValue = (v == 1 || v === true) ? 'Current' : 'Past';
									}
									return `<td>${displayValue}</td>`;
								}).join('')}</tr>`;
							}).join('')}
						</tbody>
					</table>
				</div>
			`;
		}

		html += '</div>';

		previewSection.innerHTML = `
			<h4 class="mb-4"><i class="fas fa-eye me-2"></i>Preview Application</h4>
			${html}
			<div class="form-check mt-3 font-weight-bold">
				<input class="form-check-input" type="checkbox" value="" id="termsCheckbox">
				<label class="form-check-label" for="termsCheckbox">
					<strong> I certify that the information provided is true and accurate to the best of my knowledge.
					 I understand that false information may result in disqualification or termination if hired</strong>
				</label>
			</div>

			<div class="text-center mt-4">
				<button class="btn btn-success btn-lg" id="btnSubmitApplication">
					<i class="fas fa-paper-plane me-2"></i>Submit Application
				</button>
			</div>
		`;

		// Handle terms checkbox
		const termsCheckbox = document.getElementById('termsCheckbox');
		const submitApplicationBtn = document.getElementById('btnSubmitApplication');
		submitApplicationBtn.addEventListener('click', async (e) => {
			e.preventDefault();
			if (!termsCheckbox.checked) {
				termsCheckbox.style.borderColor = 'red';
				showToast('Please review and certify your application information.', 'warning');
				return;
			}

			if (!currentUser || !currentUser.id) {
				showToast('User not authenticated. Please log in.', 'warning');
				return;
			}

			if (!selectedJob || !selectedJob.id) {
				showToast('Please select a position to apply for.', 'warning');
				return;
			}
			const { completed, incompleteSections } = await allSectionsCompleted(currentUser.id);
			if (!completed) {
				showToast(
					`Please complete the following sections: ${incompleteSections.join(', ')}`,
					'warning'
				);
				return;
			}
			// check if application already exists for this user and position
			if(await applicantApplicationExists(currentUser.id, selectedJob.id)) {
				showToast('You have already applied for this position.', 'error');
				return;
			}

			try {
				// Prepare application data
				const applicationData = {
					applicant_id: parseInt(currentUser.id),
					position_id: parseInt(selectedJob.id),
					personal_details: dataCache.personalDetails ? dataCache.personalDetails[0] : {},
				};
				const response = await axios.post(API.postApplication, applicationData);

				if (response.data && response.data.success && response.data.data && response.data.data.id) {
					// Submit screening answers if present
					if (cachedScreeningAnswers && Array.isArray(cachedScreeningAnswers.answers) && cachedScreeningAnswers.answers.length > 0) {
						try {
							await axios.post(
								API.submitScreeningAnswers(response.data.data.id),
								{ answers: cachedScreeningAnswers.answers }
							);
						} catch (err) {
							showToast('Application submitted, but failed to submit screening answers.', 'warning');
							console.error('Error submitting screening answers:', err);
						}
					}
					showToast('Application submitted successfully!', 'success');
					// Reset application state and clear cache
					hasSelectedJob = false;
					dataCache['submittedApplications'] = undefined;
					cachedScreeningAnswers = null;
				} else {
					showToast('Failed to submit application. Please try again.', 'error');
				}
			} catch (error) {
				console.error('Error submitting application:', error);
				showToast('Failed to submit application. Please try again.', 'error');
			}
		});
	}

	// Select position
	const positionsTableBody = document.querySelector('#positionsTable tbody');

	// Function to show position details modal
	async function showJobDetailsModal(jobId) {
		let position = {};
		const response = await axios.get(API.selectPosition(jobId));
		position = response.data.data;
		showJobDetailsContent(position);
		const applyBtn = document.getElementById('btnPreviewDetails');
		if (isBrowseMode) {
			applyBtn.style.display = 'none';
		} else {
			applyBtn.style.display = 'inline-block';
		}
		jobDetailsModal.show();
	}

	/**
	 * Display position details content
	 */
	function showJobDetailsContent(position) {
		const modal = document.getElementById('jobDetailsModal');
		const modalLabel = document.getElementById('jobDetailsModalLabel');
		const body = document.getElementById('jobDetailsModalBody');
		if (modalLabel) modalLabel.textContent = position.name || 'Position Details';
		let dutiesList = '';
		if (position.duties && Array.isArray(position.duties)) {
			dutiesList = '<ul>' + position.duties.map(duty => `<li>${duty}</li>`).join('') + '</ul>';
		} else {
			dutiesList = '<p>N/A</p>';
		}
		let skillsList = '';
		if (position.skills && Array.isArray(position.skills)) {
			skillsList = '<ul>' + position.skills.map(skill => `<li>${skill}</li>`).join('') + '</ul>';
		} else {
			skillsList = '<p>N/A</p>';
		}
		let qualificationsList = '';
		if (Array.isArray(position.qualifications) && position.qualifications.length) {
			qualificationsList = `
				<ul>
					${position.qualifications.map(q => `
						<li>
							${q.details}
							${q.is_mandatory ? '<strong> (Mandatory)</strong>' : ''}
						</li>
					`).join('')}
				</ul>
			`;
		} else {
			qualificationsList = '<p>N/A</p>';
		}

		let experienceList = '';

		if (Array.isArray(position.experiences) && position.experiences.length) {
			experienceList = `
				<ul>
					${position.experiences.map(e => `
						<li>
							${e.details}
							${e.is_mandatory ? '<strong> (Mandatory)</strong>' : ''}
						</li>
					`).join('')}
				</ul>
			`;
		} else {
			experienceList = '<p>N/A</p>';
		}
		if (body) {
			body.innerHTML = `
				<div class="row">
					<div class="col-md-10">
						<p><strong>Position:&nbsp; ${position.position_title || 'N/A'}</strong></p>
						<p><strong>Vacancy: ${position.available_vacancies || 'N/A'}</strong></p>
						<p><strong>Reports to: ${position.reports_to || 'N/A'}</strong></p> 
						<p><strong>Department: ${position.department || 'N/A'}</strong></p>
						<p><strong>Department Head: ${position.department_head || 'N/A'}</strong></p> 
						<p><strong>Deadline: ${position.deadline_date || ''} ${position.deadline_time || ''}</strong></p>
					</div>
					<hr/>
				<div class="col-md-12">
				<p><strong>Position Purpose:</strong> <br>${position.job_purpose || 'N/A'}</p>
				<p><strong>Duties and Responsibilities:</strong></p>
				${dutiesList}
				<p><strong>Person Specifications:</strong></p>
				<p><strong>Education:</strong></p>
				${qualificationsList}
				<p><strong>Experience:</strong></p>
				${experienceList}
				<p><strong>Skills:</strong></p>
				${skillsList}
				</div>
				</div>
			`;
		}
		// Always show the modal when displaying details
		if (typeof bootstrap !== 'undefined' && modal) {
			const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
			bsModal.show();
		}
		const applyBtn = document.getElementById('btnPreviewDetails');
		if (isBrowseMode) {
			applyBtn.style.display = 'none';
		} else {
			applyBtn.style.display = 'inline-block';
			applyBtn.onclick = (e) => {
				e.preventDefault();
				selectedJob = position;
				hasSelectedJob = true;
				// showStep('previewApplication');
				jobDetailsModal.hide();
				dataCache = {};
				const APPLICANT_ID = currentUser.id;
				const POSITION_ID = selectedJob.id;
				loadScreeningQuestions(POSITION_ID, APPLICANT_ID).then(questions => {
					displayScreeningQuestions(questions,selectedJob,APPLICANT_ID);
				});
			};
		}
	}

	async function loadPositions(applicant_type) {
		try {
			const response = await axios.get(API.viewPositions(applicant_type));
			const positions = response.data.data || [];
			if (!positions.length) {
				positionsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No positions listed currently.</td></tr>`;
				return;
			}
			positionsTableBody.innerHTML = '';
			positions.forEach(position => {
				const tr = document.createElement('tr');
				tr.insertAdjacentHTML('beforeend', `<td>${position.name || ''}</td>`);
				tr.insertAdjacentHTML('beforeend', `<td>${position.location || ''}</td>`);
				tr.insertAdjacentHTML('beforeend', `<td>${position.deadline_date || ''} ${position.deadline_time || ''}</td>`);

				const tdActions = document.createElement('td');
				const btnView = document.createElement('button');
				btnView.className = 'btn btn-sm btn-info me-2';
				btnView.type = 'button';
				btnView.innerHTML = '<i class="fa fa-eye"></i> View';
				btnView.addEventListener('click', () => {
					showJobDetailsModal(position.id);
				});
				tdActions.appendChild(btnView);

				
				tr.appendChild(tdActions);

				positionsTableBody.appendChild(tr);
			});
		} catch {
			positionsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Failed to load positions.</td></tr>`;
		}
	}

	/* ========== Screening Questions Module ========== */
	let currentScreeningPosition = null;
	let currentScreeningApplication = null;
	let screeningQuestions = [];

	/**
	 * Load screening questions for a position
	 */
	async function loadScreeningQuestions(positionId) {
		try {
			const response = await axios.get(API.getScreeningQuestions(positionId));
			const questions = response.data.questions ?? [];
			screeningQuestions = questions;
			return questions;
		} catch (error) {
			showToast('Failed to load screening questions.', 'error');
			return [];
		}
	}


	/**
	 * Render question form based on question type
	 */
	function renderQuestionForm(question, index) {
		// Handle nested question structure from API response
		const questionData = question.question || question;
		const questionId = question.question_id || question.id;
		
		const questionIdEl = `question_${questionId}`;
		let questionHTML = `
			<div class="mb-4 p-3 border rounded bg-light">
				<label class="form-label fw-bold mb-3">
					Q${index + 1}. ${questionData.question_text}
					${questionData.is_required ? '<span class="text-danger">*</span>' : ''}
				</label>
		`;

		// Handle different question format names
		const questionFormat = questionData.question_format || questionData.format || 'text';
		switch (questionFormat.toLowerCase()) {
			case 'text':
			case 'short_text':
				questionHTML += `
					<textarea 
						id="${questionIdEl}" 
						class="form-control screening-question" 
						name="question_${questionId}"
						rows="3"
						data-question-id="${questionId}"
						data-question-type="${questionFormat}"
						${questionData.is_required ? 'required' : ''}
					></textarea>
				`;
				break;

			case 'multiple_choice':
			case 'checkbox':
				const options = questionData.options ? JSON.parse(questionData.options) : [];
				questionHTML += `<div class="question-options">`;
				options.forEach((option, idx) => {
					questionHTML += `
						<div class="form-check">
							<input 
								class="form-check-input screening-question" 
								type="checkbox" 
								id="${questionIdEl}_${idx}"
								name="question_${questionId}"
								value="${option}"
								data-question-id="${questionId}"
								data-question-type="${questionFormat}"
							>
							<label class="form-check-label" for="${questionIdEl}_${idx}">
								${option}
							</label>
						</div>
					`;
				});
				questionHTML += `</div>`;
				break;

			case 'dropdown':
			case 'select':
				const dropdownOptions = questionData.options ? JSON.parse(questionData.options) : [];
				questionHTML += `
					<select 
						id="${questionIdEl}" 
						class="form-select screening-question" 
						name="question_${questionId}"
						data-question-id="${questionId}"
						data-question-type="${questionFormat}"
						${questionData.is_required ? 'required' : ''}
					>
						<option value="">-- Please select --</option>
				`;
				dropdownOptions.forEach(option => {
					questionHTML += `<option value="${option}">${option}</option>`;
				});
				questionHTML += `</select>`;
				break;

			case 'radio':
				const radioOptions = questionData.options ? JSON.parse(questionData.options) : [];
				questionHTML += `<div class="question-options">`;
				radioOptions.forEach((option, idx) => {
					questionHTML += `
						<div class="form-check">
							<input 
								class="form-check-input screening-question" 
								type="radio" 
								id="${questionIdEl}_${idx}"
								name="question_${questionId}"
								value="${option}"
								data-question-id="${questionId}"
								data-question-type="${questionFormat}"
								${questionData.is_required ? 'required' : ''}
							>
							<label class="form-check-label" for="${questionIdEl}_${idx}">
								${option}
							</label>
						</div>
					`;
				});
				questionHTML += `</div>`;
				break;

		case 'boolean': {

	// Default Yes / No options (source of truth)
	const booleanOptions = [
		{ label: 'Yes', value: 1 },
		{ label: 'No', value: 0 }
	];

	questionHTML += `<div class="question-options">`;

	booleanOptions.forEach((option, idx) => {
		const inputId = `${questionIdEl}_${idx}`;

		questionHTML += `
			<div class="form-check">
				<input 
					class="form-check-input screening-question"
					type="radio"
					id="${inputId}"
					name="question_${questionId}"
					value="${option.value}"
					data-question-id="${questionId}"
					data-question-format="boolean"
					${questionData.is_required ? 'required' : ''}
				>
				<label class="form-check-label" for="${inputId}">
					${option.label}
				</label>
			</div>
		`;
	});

	questionHTML += `</div>`;
	break;
}

			default:
				questionHTML += `
					<input 
						type="text" 
						id="${questionIdEl}" 
						class="form-control screening-question" 
						name="question_${questionId}"
						data-question-id="${questionId}"
						data-question-type="${questionFormat}"
						${questionData.is_required ? 'required' : ''}
					>
				`;
		}

		questionHTML += `</div>`;
		return questionHTML;
	}

	/**
	 * Display screening questions in modal
	 */
	function displayScreeningQuestions(questions, selectedJob, applicantId) {
		currentScreeningPosition = selectedJob;
		currentApplicantId = applicantId;
		// Hide all main sections
		document.querySelectorAll('section[data-step-content]').forEach(sec => sec.classList.add('d-none'));
		// Use the existing screeningQuestions section
		const screeningSection = document.querySelector('section[data-step-content="screeningQuestions"]');
		if (!screeningSection) {
			console.error('Screening questions section not found in HTML.');
			return false;
		}
		screeningSection.classList.remove('d-none');

		if (!questions || questions.length === 0) {
			screeningSection.innerHTML = '<div class="alert alert-warning">No screening questions for this position.</div>';
			return false;
		}

		let formHTML = `
			<h3 class="mb-4">Screening Questions for <span class="text-primary">${selectedJob?.position_title || selectedJob?.name || ''}</span></h3>
			<div id="screeningQuestionsForm">
				<div class="alert alert-info" role="alert">
					<i class="fa fa-info-circle me-2"></i>
					Please note that all questions must be answered for you to proceed with this application.
				</div>
				<form id="screeningAnswersForm">
		`;

		questions.forEach((question, index) => {
			formHTML += renderQuestionForm(question, index);
		});

		   formHTML += `
					   <div class="mt-4 d-flex justify-content-between">
						   <button type="button" class="btn btn-secondary" id="btnBackToPositions">
							   <i class="fa fa-arrow-left me-2"></i>Back to Positions
						   </button>
						   <button type="submit" class="btn btn-primary">
							   <i class="fa fa-arrow-right me-2"></i> Next
						   </button>
					   </div>
				   </form>
			   </div>
		   `;

		screeningSection.innerHTML = formHTML;
		// Attach form submit handler
		const form = document.getElementById('screeningAnswersForm');
		if (form) {
			form.addEventListener('submit', handleScreeningSubmit);
		}
		// Attach back button handler
		const btnBack = document.getElementById('btnBackToPositions');
		if (btnBack) {
			btnBack.onclick = function() {
				screeningSection.classList.add('d-none');
				// Show positions section (assume data-step-content="viewPositions")
				const positionsSection = document.querySelector('section[data-step-content="viewPositions"]');
				if (positionsSection) positionsSection.classList.remove('d-none');
			};
		}
		return true;
	}

	/**
	 * Collect answers from form
	 */
	function collectScreeningAnswers() {
		const answers = {};
		const formElements = document.querySelectorAll('.screening-question');

		formElements.forEach(element => {
			const questionId = element.getAttribute('data-question-id');
			const questionType = element.getAttribute('data-question-type');

			if (!answers[questionId]) {
				answers[questionId] = [];
			}

			if (element.type === 'checkbox' && element.checked) {
				answers[questionId].push(element.value);
			} else if (element.type === 'radio' && element.checked) {
				answers[questionId] = element.value;
			} else if (element.type !== 'checkbox' && element.type !== 'radio') {
				if (element.value.trim()) {
					answers[questionId] = element.value.trim();
				}
			}
		});

		return answers;
	}

	/**
	 * Handle screening answers submission (cache answers, proceed to next section)
	 */
	let cachedScreeningAnswers = null;
	function handleScreeningSubmit(e) {
		e.preventDefault();

		if (!currentUser || !currentUser.id) {
			showToast('You must be logged in to proceed.', 'warning');
			return;
		}

		if (!currentScreeningPosition) {
			showToast('Position not selected.', 'error');
			return;
		}

		// Validate required fields
		const form = e.target;
		if (!form.checkValidity()) {
			form.classList.add('was-validated');
			showToast('Please answer all required questions.', 'warning');
			return;
		}

		// Cache answers for later submission
		const answers = collectScreeningAnswers();
		cachedScreeningAnswers = {
			positionId: currentScreeningPosition.id,
			answers: Object.entries(answers).map(([questionId, answer]) => ({
				question_id: questionId,
				answer_text: Array.isArray(answer) ? answer.join(', ') : answer,
			}))
		};

		selectedJob = currentScreeningPosition;
		hasSelectedJob = true;
		// Hide screening section, show personal details section
		const screeningSection = document.querySelector('section[data-step-content="screeningQuestions"]');
		if (screeningSection) screeningSection.classList.add('d-none');
		showStep('personalDetails');
	}

	/* -------- Modal Submit Handler -------- */
	crudForm.addEventListener('submit', async e => {
		e.preventDefault();
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
		if (!crudForm.checkValidity()) {
		crudForm.classList.add('was-validated');
		return;
		}

		const id = crudItemIdInput.value || null;
		// Extract numeric ID if it contains a path (e.g., "educations/2001" -> "2001")
		let numericId = id;
		if (id && typeof id === 'string' && id.includes('/')) {
			numericId = id.split('/').pop(); // Get the last part after /
		}
		
		let key = '';
		let stepApiUrl = '';
		
		switch (currentStep) {
			case 'educationTraining': {
				stepApiUrl = API.educationTraining;
				key = 'educationTraining';
				const data = {};
				data.applicant_id = crudForm.querySelector('input[name="applicant_id"]').value;
				crudModalBody.querySelectorAll('input, select, textarea').forEach(input => {
					if (input.type === 'file') {
						// Skip file inputs for non-document forms
					} else if (input.type === 'checkbox') {
						data[input.name] = input.checked;
					} else {
						data[input.name] = input.value.trim();
					}
				});
				try {
					if (numericId) {
						// If this is a local-only fallback id (e.g., 'user-...'), update cache locally
						if (typeof numericId === 'string' && numericId.startsWith('user-')) {
							data.id = numericId; // preserve local id
							const list = dataCache[key] || [];
							const idx = list.findIndex(i => i.id === numericId);
							if (idx > -1) {
								list[idx] = Object.assign({}, list[idx], data);
							} else {
								list.push(data);
							}
							dataCache[key] = list;
							showToast('Record updated (local).', 'success');
						} else {
							await updateItem(stepApiUrl, numericId, data);
							showToast('Record updated.', 'success');
						}
					} else {
						await createItem(stepApiUrl, data, key);
						showToast('Record created.', 'success');
					}
				} catch (err) {
					console.error('CRUD submit error:', err);
				}
				break;
			}
			
			case 'documents': {
				stepApiUrl = API.documents;
				key = 'documents';
				
				// For documents, use FormData to handle file uploads
				const formData = new FormData();
				formData.append('applicant_id', crudForm.querySelector('input[name="applicant_id"]').value);
				
				let hasFile = false;
				crudModalBody.querySelectorAll('input, select, textarea').forEach(input => {
					if (input.name === 'applicant_id') return; // Skip, already added
					
					if (input.type === 'file') {
						if (input.files.length > 0) {
							formData.append(input.name, input.files[0]);
							hasFile = true;
						}
					} else if (input.type === 'checkbox') {
						formData.append(input.name, input.checked);
					} else {
						formData.append(input.name, input.value.trim());
					}
				});
				
				if (!hasFile) {
					showToast('Please select a file to upload.', 'warning');
					return;
				}
				
				try {
					if (numericId) {
						// For updates, use axios with FormData
						const response = await axios.put(`${stepApiUrl}/${numericId}`, formData, {
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						});
						if (response.data.status === 'success') {
							showToast('Document updated.', 'success');
						} else {
							showToast('Error: ' + response.data.message, 'error');
							return;
						}
					} else {
						// For new documents, use axios with FormData
						const response = await axios.post(stepApiUrl, formData, {
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						});
						if (response.data.status === 'success') {
							showToast('Document uploaded.', 'success');
						} else {
							showToast('Error: ' + response.data.message, 'error');
							return;
						}
					}
				} catch (error) {
					console.error('Document upload error:', error);
					const errorMsg = error.response?.data?.message || error.message;
					showToast('Upload failed: ' + errorMsg, 'error');
					return;
				}
				break;
			}
			
			case 'professionalMembership':
			case 'employmentHistory':
			case 'referee':
			// case 'dependants':
			 	{
				stepApiUrl = (() => {
					switch(currentStep) {
						case 'professionalMembership': return API.professionalMembership;
						case 'employmentHistory': return API.employmentHistory;
						case 'referee': return API.referee;
						// case 'dependants': return API.dependants;
					}
				})();
				key = currentStep;
				
				const data = {};
				data.applicant_id = crudForm.querySelector('input[name="applicant_id"]').value;
				crudModalBody.querySelectorAll('input, select, textarea').forEach(input => {
					if (input.type === 'file') {
						// Skip file inputs
					} else if (input.type === 'checkbox') {
						data[input.name] = input.checked;
					} else {
						data[input.name] = input.value.trim();
					}
				});
				
				try {
					if (numericId) {
						await updateItem(stepApiUrl, numericId, data, key);
						showToast('Record updated.', 'success');
					} else {
						await createItem(stepApiUrl, data, key);
						showToast('Record created.', 'success');
					}
				} catch {}
				break;
			}
			
			default:
				showToast('Unsupported step form.', 'error');
				crudModal.hide();
				return;
		}
		
		crudModal.hide();
		await loadStepData(currentStep);
	});

	

	/* -------- Load Data for step -------- */
	async function loadStepData(step) {
		switch (step) {
			case 'viewPositions': await loadPositions(currentUser.applicant_type); break;
			case 'personalDetails': await loadPersonalDetails(); break;
			case 'educationTraining': await loadEducation(); break;
			case 'professionalMembership': await loadMembership(); break;
			case 'employmentHistory': await loadEmployment(); break;
			case 'documents': await loadDocuments(); break;
			case 'referee': await loadReferee(); break;
			// case 'dependants': await loadDependants(); break;
			case 'previewApplication': await loadPreview(); break;
			case 'myApplications': await loadSubmittedApplications(); break;
			default: break;
		}
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

	/* -------- Global functions for navigation -------- */
	window.showStep = showStep;
	// window.showHomePage = showHomePage;
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

	// Function to handle position click from homepage
	window.handleJobClick = function(jobId) {
		if (!currentUser) {
			document.getElementById('authArea').scrollIntoView({behavior: 'smooth'});
		} else {
			showSection('viewPositions');
		}
	};

	/* -------- Token Validation -------- */
	/**
	 * Validate that user still exists in database
	 * @returns {Promise<boolean>} true if token/user is valid
	 */
	async function validateTokenWithBackend() {
		const token = getToken();
		if (!token || !currentUser || !currentUser.id) {
			return false;
		}

		try {
			// Call API to verify user still exists
			const response = await axios.get(API.personalDetails(currentUser.id), {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			// If successful, update currentUser with fresh DB data
			if (response.data && response.data.id) {
				currentUser = response.data;
				localStorage.setItem('user', JSON.stringify(response.data));
				return true;
			}
			return false;
		} catch (error) {
						console.log('Validating token with backend for user ID:', currentUser.id);
			// 404 = User not found, 401 = Unauthorized
			if (error.response?.status === 404 || error.response?.status === 401) {
				clearSession();
				currentUser = null;
				return false;
			}
			// For other errors, assume token is still valid
			return true;
		}
	}

	/* -------- Init -------- */
	async function init() {
		// 1️⃣ health check runs FIRST
		const serverOk = await checkServerStatus();
		if (!serverOk) {
			console.warn('⚠️ Server is offline');
			showToast('Server is currently unavailable. Please try again later.', 'error');

			// Optional UI handling:
			showLoginForm(); // Or show maintenance page
			return; // STOP init – no more backend calls
		}

		// 2️⃣ now continue with your current logic
		const userSession = getSession();
		if (userSession) {
			try {
				const isValid = await validateTokenWithBackend();
				if (isValid) {
					showDashboard();
				} else {
					showLoginForm();
				}
			} catch (error) {
				console.error('Token validation error:', error);
				showLoginForm();
			}
		} else {
			showLoginForm();
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
	
	async function checkServerStatus() {
		try {
			const response = await fetch(API.health);
			return response.ok;
		} catch (error) {
			return false;
		}
	}

	/* -------- Phone Number Input Formatting -------- */
	const phoneInput = document.getElementById('phone_number');
	if (phoneInput) {
		phoneInput.addEventListener('keydown', function (e) {
			// Allow control keys
			if (
				e.key === 'Backspace' ||
				e.key === 'Delete' ||
				e.key === 'ArrowLeft' ||
				e.key === 'ArrowRight' ||
				e.key === 'Tab'
			) return;

			// Allow only numbers
			if (!/[0-9]/.test(e.key)) {
				e.preventDefault();
			}
		});

		phoneInput.addEventListener('input', function () {
			// Always keep +256
			if (!this.value.startsWith('+256')) {
				this.value = '+256';
			}

			// Remove any non-numeric characters except +
			this.value = '+256' + this.value.slice(4).replace(/\D/g, '');

			// Limit to +256 + 9 digits
			if (this.value.length > 13) {
				this.value = this.value.slice(0, 13);
			}
		});
	}

	/* -------- DOB Age Validation (Registration) -------- */
	const dobInput = document.getElementById('dob');
	if (dobInput) {
		dobInput.addEventListener('change', function () {
			const dobValue = this.value;
			const error = document.getElementById('dobError');

			if (!dobValue) return;

			const dob = new Date(dobValue);
			const today = new Date();

			// Calculate age
			let age = today.getFullYear() - dob.getFullYear();
			const monthDiff = today.getMonth() - dob.getMonth();

			if (
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < dob.getDate())
			) {
				age--;
			}

			if (age < 18) {
				error.classList.remove('d-none');
				this.value = '';
			} else {
				error.classList.add('d-none');
			}
		});
	}

	/* -------- NIN Input Formatting -------- */
	const ninDetailInput = document.getElementById('ninDetail');
	if (ninDetailInput) {
		ninDetailInput.addEventListener('input', function () {
			this.value = this.value
				.toUpperCase()          // force uppercase
				.replace(/[^A-Z0-9]/g, '') // remove symbols
				.slice(0, 14);           // max length
		});
	}

	/* -------- Section Navigation with Validation -------- */
	function goToSection(sectionName) {
		showStep(sectionName);
	}

	// 1. Personal Details Next
	const btnNextPersonalDetails = document.getElementById('btnNextPersonalDetails');
	if (btnNextPersonalDetails) {
		btnNextPersonalDetails.addEventListener('click', function() {
			const form = document.getElementById('formPersonalDetails');
			if (!form.checkValidity()) {
				form.classList.add('was-validated');
				showToast('Please fill all required personal details fields.', 'warning');
				return;
			}
			goToSection('educationTraining');
		});
	}

	// 2. Education Next
	const btnNextEducation = document.getElementById('btnNextEducation');
	if (btnNextEducation) {
		btnNextEducation.addEventListener('click', function() {
			const tbody = document.querySelector('#educationTable tbody');
			if (!tbody || tbody.children.length === 0) {
				showToast('Please add at least one education record.', 'warning');
				return;
			}
			goToSection('professionalMembership');
		});
	}

	// 3. Membership Next
	const btnNextMembership = document.getElementById('btnNextMembership');
	if (btnNextMembership) {
		btnNextMembership.addEventListener('click', function() {
			const tbody = document.querySelector('#membershipTable tbody');
			if (!tbody || tbody.children.length === 0) {
				showToast('Please add at least one professional membership.', 'warning');
				return;
			}
			goToSection('employmentHistory');
		});
	}

	// 4. Employment Next
	const btnNextEmployment = document.getElementById('btnNextEmployment');
	if (btnNextEmployment) {
		btnNextEmployment.addEventListener('click', function() {
			const tbody = document.querySelector('#employmentTable tbody');
			if (!tbody || tbody.children.length === 0) {
				showToast('Please add at least one employment record.', 'warning');
				return;
			}
			goToSection('documents');
		});
	}

	// 5. Documents Next
	const btnNextDocuments = document.getElementById('btnNextDocuments');
	if (btnNextDocuments) {
		btnNextDocuments.addEventListener('click', function() {
			const tbody = document.querySelector('#documentsTable tbody');
			if (!tbody || tbody.children.length === 0) {
				showToast('Please upload at least one document.', 'warning');
				return;
			}
			goToSection('referee');
		});
	}

	// 6. Referee Next
	const btnNextReferee = document.getElementById('btnNextReferee');
	if (btnNextReferee) {
		btnNextReferee.addEventListener('click', function() {
			const tbody = document.querySelector('#refereeTable tbody');
			if (!tbody || tbody.children.length < 3) {
				showToast('Please add at least 3 referees.', 'warning');
				return;
			}
			goToSection('previewApplication');
		});
	}

	document.addEventListener('DOMContentLoaded', init);

})();

