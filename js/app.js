(() => {
  /* ========== Configuration ========== */
  // Set your API base URL here - change this to point to your backend
  const apiUrl = 'http://192.168.32.151:8041/api/v1';

  /* ----- Elements ----- */
  const authArea = document.getElementById('authArea');
  const appArea = document.getElementById('appArea');
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
  function showApp() {
    authArea.style.display = 'none';
    appArea.style.display = 'block';
    mainNavbar.style.display = 'flex';
    document.body.classList.remove('auth-view');
  }

  function showAuth() {
    authArea.style.display = 'block';
    appArea.style.display = 'none';
    mainNavbar.style.display = 'none';
    document.body.classList.add('auth-view');
  }

  /* ----- Event Listeners for Auth Toggle ----- */
  showRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
  });
  showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
  });

  /* ---- Register form submit -> register user and send OTP ---- */
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fnameInput = document.getElementById('first_name');
    const lnameInput = document.getElementById('last_name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('password_confirmation');

    if (!fnameInput.value || !lnameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    const data = {
      first_name: fnameInput.value.trim(),
      last_name: lnameInput.value.trim(),
      email: emailInput.value.toLowerCase().trim(),
      password: passwordInput.value,
      password_confirmation: confirmPasswordInput.value,

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

  /* ---- Login form submit -> send OTP and show verify email form ---- */
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');

    if (!emailInput.value) {
      showToast('Please enter your email address.', 'warning');
      return;
    }

    const email = emailInput.value.toLowerCase().trim();

    try {
      // Send OTP via API
      await axios.post(API.sendOtp, { email });
      showToast('OTP sent to your email.', 'success');

      // Save "pendingUser" temporarily to localStorage
      localStorage.setItem('pendingUser', JSON.stringify({
        email: email,
        verified: false,
      }));

      showVerifyEmailForm(email);
      loginForm.reset();
    } catch (error) {
      showToast('Failed to send OTP. Please try again.', 'error');
    }
  });

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
  otpForm.addEventListener('submit', async e => {
    e.preventDefault();
    await validateOTP();
  });

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

      // Save session
      setSession({
        email: pendingUser.email,
        name: pendingUser.email.split('@')[0].replace('.', ' ').replace(/^\w/, c => c.toUpperCase()),
        role: 'Applicant',
      });
      localStorage.removeItem('pendingUser');

      showToast('Email verified! You are now logged in.', 'success');
      isValidating = false;
      window.location.href = 'index.html';
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
      await axios.post(API.sendOtp, { email: pendingUser.email });
      showToast('OTP resent to your email.', 'success');

      // Restart countdown
      countdown = 30;
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
        countdown = 30;
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
    countdown = 30;
    countdownEl.textContent = `(${countdown}s)`;
    startCountdown();
    otpInputs[0].focus();
  };

  btnLogout.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      clearSession();
      location.reload();
    }
  });

  /* =============== Application Logic =============== */
  // API endpoints - dynamically built with the apiUrl
  const API = {
    sendOtp: `${apiUrl}/verify_email`,
    registerForm: `${apiUrl}/register`,
    personalDetails: `${apiUrl}/application`,
    educationTraining: `${apiUrl}/application_section`,
    professionalMembership: `${apiUrl}/application_section`,
    employmentHistory: `${apiUrl}/application_section`,
    documents: `${apiUrl}/application_section`,
    referee: `${apiUrl}/application_section`,
    dependants: `${apiUrl}/application_section`,
    selectJob: `${apiUrl}/active_vacancies`,
    checkServerStatus: `${apiUrl}/check-server-status`,
    getActiveVacancies: `${apiUrl}/active_vacancies`,
    postApplication: `${apiUrl}/application`,
    postApplicationSection: `${apiUrl}/application_section`,
    getApplication: (id) => `${apiUrl}/application/${id}`,
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

  /* ----- Generic Table Renderer ----- */
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
      let pd = response.data || {};
      // If no saved data, prefill email/name from session
      if (!pd.email && session) {
        pd.email = session.email;
      }
      formPersonalDetails.firstName.value = pd.firstName || '';
      formPersonalDetails.lastName.value = pd.lastName || '';
      formPersonalDetails.email.value = pd.email || '';
    } catch {
      // show fallback
      formPersonalDetails.firstName.value = '';
      formPersonalDetails.lastName.value = '';
      formPersonalDetails.email.value = '';
    }
  }
  formPersonalDetails.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      firstName: formPersonalDetails.firstName.value.trim(),
      lastName: formPersonalDetails.lastName.value.trim(),
      email: formPersonalDetails.email.value.trim(),
    };
    try {
      await axios.post(API.personalDetails, data);
      showToast('Personal details saved.', 'success');
    } catch {
      showToast('Failed to save personal details.', 'error');
    }
  });

  // Education and Training
  const educationTableBody = document.querySelector('#educationTable tbody');
  document.getElementById('btnAddEducation').addEventListener('click', () => openEducationModal());
  function openEducationModal(editItem = null) {
    crudModalLabel.innerHTML = `<i class="fas fa-graduation-cap me-2"></i>${editItem ? 'Edit Education' : 'Add Education'}`;
    crudItemIdInput.value = editItem ? editItem.id : '';
    crudModalBody.innerHTML = `
     
     
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="from_year" class="form-label fw-bold">From Year</label>
          <select class="form-control form-control" id="from_year" name="from_year" required>
            <option value="">Select Year</option>
            ${Array.from({length: new Date().getFullYear() - 1990 + 1}, (_, i) => 1990 + i).map(year => `<option value="${year}" ${editItem && editItem.from_year == year ? 'selected' : ''}>${year}</option>`).join('')}
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label for="to_year" class="form-label fw-bold">To Year</label>
          <select class="form-control form-control" id="to_year" name="to_year">
            <option value="">Select Year</option>
            ${Array.from({length: new Date().getFullYear() - 1990 + 1}, (_, i) => 1990 + i).map(year => `<option value="${year}" ${editItem && editItem.to_year == year ? 'selected' : ''}>${year}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="qualification" class="form-label fw-bold">Qualification</label>
          <select type="text" class="form-control form-control" id="qualification" name="qualification" placeholder="e.g. University of Example" required value="${editItem ? editItem.qualification : ''}">
            <option value="">Select Qualification</option>
            <option value="PhD">PhD</option>
            <option value="Masters">Masters</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Diploma" >Diploma</option>
            <option value="Certificate">Certificate</option>

          </select>
          </div>
        <div class="col-md-6 mb-3">
          <label for="course" class="form-label fw-bold">Program/Course</label>
          <input type="text" class="form-control form-control" id="course" name="course" placeholder="e.g. Bachelor of Science" required value="${editItem ? editItem.course : ''}">
        </div>
      </div>




      <div class="alert alert-info">
        <i class="fas fa-info-circle me-2"></i>
        Ensure all information is accurate as it will be verified during the application process.
      </div>
    `;
    crudModal.show();
  }
  async function loadEducation() {
    const items = await fetchItems(API.educationTraining, 'educationTraining');
    renderTableRows(items, educationTableBody, [
      { key: 'from_year' },
      { key: 'to_year' },
      { key: 'qualification' },
      { key: 'course' }
    ], openEducationModal, async id => {
      if (confirm('Delete this education record?')) {
        const success = await deleteItem(API.educationTraining, id, 'educationTraining');
        if (success) loadEducation();
      }
    });
  }

  // Professional Membership
  const membershipTableBody = document.querySelector('#membershipTable tbody');
  document.getElementById('btnAddMembership').addEventListener('click', () => openMembershipModal());
  function openMembershipModal(editItem = null) {
    crudModalLabel.innerHTML = `<i class="fas fa-users me-2"></i>${editItem ? 'Edit Membership' : 'Add Membership'}`;
    crudItemIdInput.value = editItem ? editItem.id : '';
    crudModalBody.innerHTML = `
      <div class="text-center mb-4">
        <i class="fas fa-handshake fa-3x text-success mb-3"></i>
        <p class="text-muted">Add your professional memberships and affiliations</p>
      </div>




      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="membershipOrganization" class="form-label fw-bold"><i class="fas fa-building me-1"></i>Organization</label>
          <input type="text" class="form-control form-control-lg" id="membershipOrganization" name="organization" placeholder="e.g. IEEE, ACM" required value="${editItem ? editItem.organization : ''}">
        </div>
        <div class="col-md-6 mb-3">
          <label for="membershipType" class="form-label fw-bold"><i class="fas fa-id-badge me-1"></i>Membership Type</label>
          <input type="text" class="form-control form-control-lg" id="membershipType" name="type" placeholder="e.g. Full Member, Student" required value="${editItem ? editItem.type : ''}">
        </div>
      </div>
      <div class="mb-3">
        <label for="membershipNumber" class="form-label fw-bold"><i class="fas fa-hashtag me-1"></i>Membership Number</label>
        <input type="text" class="form-control form-control-lg" id="membershipNumber" name="number" placeholder="e.g. 123456789" required value="${editItem ? editItem.number : ''}">
      </div>
      <div class="alert alert-success">
        <i class="fas fa-lightbulb me-2"></i>
        Professional memberships demonstrate your commitment to your field and can strengthen your application.
      </div>
    `;
    crudModal.show();
  }
  async function loadMembership() {
    const items = await fetchItems(API.professionalMembership, 'professionalMembership');
    renderTableRows(items, membershipTableBody, [
      { key: 'organization' },
      { key: 'type' },
      { key: 'number' }
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
    crudModalLabel.innerHTML = `<i class="fas fa-briefcase me-2"></i>${editItem ? 'Edit Employment' : 'Add Employment'}`;
    crudItemIdInput.value = editItem ? editItem.id : '';
    crudModalBody.innerHTML = `
      <div class="text-center mb-4">
        <i class="fas fa-building fa-3x text-warning mb-3"></i>
        <p class="text-muted">Share your work experience and career progression</p>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="employer" class="form-label fw-bold"><i class="fas fa-building me-1"></i>Employer</label>
          <input type="text" class="form-control form-control-lg" id="employer" name="employer" placeholder="e.g. Tech Solutions Inc." required value="${editItem ? editItem.employer : ''}">
        </div>
        <div class="col-md-6 mb-3">
          <label for="position" class="form-label fw-bold"><i class="fas fa-user-tie me-1"></i>Position</label>
          <input type="text" class="form-control form-control-lg" id="position" name="position" placeholder="e.g. Software Developer" required value="${editItem ? editItem.position : ''}">
        </div>
      </div>
      <div class="mb-3">
        <label for="duration" class="form-label fw-bold"><i class="fas fa-calendar-alt me-1"></i>Duration</label>
        <input type="text" class="form-control form-control-lg" id="duration" name="duration" placeholder="e.g. Jan 2020 - Dec 2022" required value="${editItem ? editItem.duration : ''}">
      </div>
      <div class="alert alert-warning">
        <i class="fas fa-exclamation-triangle me-2"></i>
        Provide accurate employment details as they may be verified through background checks.
      </div>
    `;
    crudModal.show();
  }
  async function loadEmployment() {
    const items = await fetchItems(API.employmentHistory, 'employmentHistory');
    renderTableRows(items, employmentTableBody, [
      { key: 'employer' },
      { key: 'position' },
      { key: 'duration' }
    ], openEmploymentModal, async id => {
      if (confirm('Delete this employment record?')) {
        const success = await deleteItem(API.employmentHistory, id, 'employmentHistory');
        if (success) loadEmployment();
      }
    });
  }

  // Documents
  const documentsTableBody = document.querySelector('#documentsTable tbody');
  document.getElementById('btnAddDocument').addEventListener('click', () => openDocumentsModal());
  function openDocumentsModal(editItem = null) {
    crudModalLabel.innerHTML = `<i class="fas fa-file-upload me-2"></i>${editItem ? 'Edit Document' : 'Upload Document'}`;
    crudItemIdInput.value = editItem ? editItem.id : '';
    crudModalBody.innerHTML = `

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="qualification" class="form-label fw-bold">Qualification</label>
          <select type="text" class="form-control form-control" id="qualification" name="qualification" placeholder="e.g. University of Example" required value="${editItem ? editItem.qualification : ''}">
            <option value="">Select Qualification</option>
            <option value="PhD">PhD</option>
            <option value="Masters">Masters</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Diploma" >Diploma</option>
            <option value="Certificate">Certificate</option>
            <option value="NationId">Nation Id</option>
            <option value="Cover Page">Cover Page</option>


          </select>
          </div>
        <div class="col-md-6 mb-3">
          <label for="title" class="form-label fw-bold">Document Title</label>
          <input type="text" class="form-control form-control" id="title" name="title" placeholder="e.g. Transcript" required value="${editItem ? editItem.title : ''}">
        </div>
      </div>



      <div class="mb-3">
        <label for="file" class="form-label fw-bold"><i class="fas fa-upload me-1"></i>Choose File</label>
        <input type="file" class="form-control form-control" id="file" name="file" accept="application/pdf" ${editItem ? '' : 'required'}>
      </div>

      <div class="alert alert-info">
        <i class="fas fa-shield-alt me-2"></i>
        All uploaded documents are encrypted and stored securely. Only authorized personnel will have access.
      </div>
    `;
    crudModal.show();

    // Add file validation
    const documentFileInput = document.getElementById('documentFile');
    documentFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type !== 'application/pdf') {
        showToast('Please select a PDF file only.', 'error');
        e.target.value = ''; // Clear the input
      }
    });
  }
  async function loadDocuments() {
    const items = await fetchItems(API.documents, 'documents');
    renderTableRows(items, documentsTableBody, [
      { key: 'name' },
      { key: 'type' },
      { key: 'uploadedOn' }
    ], openDocumentsModal, async id => {
      if (confirm('Delete this document?')) {
        const success = await deleteItem(API.documents, id, 'documents');
        if (success) loadDocuments();
      }
    });
  }

  // Referee
  const refereeTableBody = document.querySelector('#refereeTable tbody');
  document.getElementById('btnAddReferee').addEventListener('click', () => openRefereeModal());
  function openRefereeModal(editItem = null) {
    crudModalLabel.textContent = editItem ? 'Edit Referee' : 'Add Referee';
    crudItemIdInput.value = editItem ? editItem.id : '';
    crudModalBody.innerHTML = `

    <div class="row">
      
        <div class="col-md-6 mb-3">
          <label for="full_name" class="form-label fw-bold">Full Name</label>
          <input type="text" class="form-control form-control" id="full_name" name="full_name"  required value="${editItem ? editItem.full_name : ''}">
        </div>


        <div class="col-md-6 mb-3">
          <label for="relationship" class="form-label fw-bold">Relationship</label>
          <input type="text" class="form-control form-control" id="relationship" name="relationship" placeholder="e.g. University of Example" required value="${editItem ? editItem.relationship : ''}"/>
            
        </div>
    </div>


    <div class="row">
      
        <div class="col-md-6 mb-3">
          <label for="position" class="form-label fw-bold">Position</label>
          <input type="text" class="form-control form-control" id="position" name="position"  required value="${editItem ? editItem.position : ''}">
        </div>


        <div class="col-md-6 mb-3">
          <label for="email" class="form-label fw-bold">Email</label>
          <input type="email" class="form-control form-control" id="email" name="email"  required value="${editItem ? editItem.email : ''}"/>
            
        </div>
    </div>


    <div class="row">
      
        <div class="col-md-6 mb-3">
          <label for="contact" class="form-label fw-bold">Contact</label>
          <input type="text" class="form-control form-control" id="contact" name="contact"  required value="${editItem ? editItem.contact : ''}">
        </div>


       
    </div>



    `;
    crudModal.show();
  }
  async function loadReferee() {
    const items = await fetchItems(API.referee, 'referee');
    renderTableRows(items, refereeTableBody, [
      { key: 'name' },
      { key: 'relationship' },
      { key: 'contact' }
    ], openRefereeModal, async id => {
      if (confirm('Delete this referee?')) {
        const success = await deleteItem(API.referee, id, 'referee');
        if (success) loadReferee();
      }
    });
  }

  // Dependants
  const dependantsTableBody = document.querySelector('#dependantsTable tbody');
  document.getElementById('btnAddDependant').addEventListener('click', () => openDependantModal());
  function openDependantModal(editItem = null) {
    crudModalLabel.textContent = editItem ? 'Edit Dependant' : 'Add Dependant';
    crudItemIdInput.value = editItem ? editItem.id : '';
    crudModalBody.innerHTML = `


    <div class="row">
      
        <div class="col-md-6 mb-3">
          <label for="name" class="form-label fw-bold">Full Name</label>
          <input type="text" class="form-control form-control" id="name" name="name"  value="${editItem ? editItem.name : ''}">
        </div>


        <div class="col-md-6 mb-3">
          <label for="relationship" class="form-label fw-bold">Relationship</label>
          <select type="text" class="form-control form-control" id="relationship" name="relationship"  required value="${editItem ? editItem.relationship : ''}">
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
          <label for="age" class="form-label fw-bold">Age</label>
          <input type="number" class="form-control form-control" id="age" name="age"  required value="${editItem ? editItem.age : ''}">
        </div>


        
    </div>

     
    `;
    crudModal.show();
  }
  async function loadDependants() {
    const items = await fetchItems(API.dependants, 'dependants');
    renderTableRows(items, dependantsTableBody, [
      { key: 'name' },
      { key: 'relationship' },
      { key: 'age' }
    ], openDependantModal, async id => {
      if (confirm('Delete this dependant?')) {
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
    crudModalBody.querySelectorAll('input, select, textarea').forEach(input => {
      if (input.type === 'file') {
        data[input.name] = input.files.length > 0 ? input.files[0].name : '';
      } else {
        data[input.name] = input.value.trim();
      }
    });

    const id = crudItemIdInput.value || null;
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

  /* -------- Init -------- */
  function init() {
    const user = getSession();
    if (user) {
      showApp();
      initAppAfterLogin();
    } else {
      showAuth();
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('register') === 'true') {
        showRegisterForm();
      } else {
        showLoginForm();
      }
    }
  }
  document.addEventListener('DOMContentLoaded', init);

})();
