<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Recruitment Portal - PPDA</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom CSS -->
    <link href="css/styles.css" rel="stylesheet" />
    <style>
        :root {
            --psc-blue: #0a4a7a;
            --psc-light-blue: #e6f0f9;
            --psc-accent: #ffcc00;
            --psc-dark: #083a5f;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            min-height: 100vh;
        }
        
        .psc-header {
            background: linear-gradient(135deg, var(--psc-blue) 0%, var(--psc-dark) 100%);
            color: white;
            padding: 18px 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
        }
        
        .psc-header::before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 300px;
            height: 100%;
            background: rgba(255, 255, 255, 0.05);
            transform: skewX(-20deg);
        }
        
        .logo-container {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .logo-icon {
            background-color: white;
            width: 60px;
            height: 60px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .logo-icon i {
            font-size: 28px;
            color: var(--psc-blue);
        }
        
        .header-title h1 {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0;
            letter-spacing: 0.5px;
        }
        
        .header-title p {
            font-size: 0.85rem;
            opacity: 0.9;
            margin: 0;
        }
        
        .notification-banner {
            background: linear-gradient(to right, #fff3cd 0%, #ffeaa7 100%);
            border-left: 5px solid var(--psc-accent);
            padding: 18px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        
        .notification-title {
            color: #856404;
            font-weight: 700;
            font-size: 1.2rem;
        }
        
        .main-content {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .section-title {
            color: var(--psc-blue);
            font-weight: 700;
            border-bottom: 2px solid var(--psc-light-blue);
            padding-bottom: 12px;
            margin-bottom: 20px;
            position: relative;
        }
        
        .section-title::after {
            content: "";
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 60px;
            height: 2px;
            background-color: var(--psc-blue);
        }
        
        .alert-custom {
            background-color: #e6f0f9;
            border-left: 4px solid var(--psc-blue);
            border-radius: 0 8px 8px 0;
            padding: 18px;
        }
        
        .important-dates {
            background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 10px;
            padding: 22px;
            margin-top: 25px;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .date-item {
            padding: 14px 0;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .date-item:last-child {
            border-bottom: none;
        }
        
        .date-label {
            font-weight: 600;
            color: var(--psc-dark);
        }
        
        .date-value {
            font-weight: 700;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 0.95rem;
        }
        
        .date-danger {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .date-success {
            background-color: #d4edda;
            color: #155724;
        }
        
        .date-primary {
            background-color: #d1ecf1;
            color: #0c5460;
        }
        
        .auth-section {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            padding: 25px;
            margin-bottom: 20px;
            border-top: 4px solid var(--psc-blue);
        }
        
        .auth-title {
            color: var(--psc-blue);
            font-weight: 700;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .form-control-custom {
            border: 1px solid #ced4da;
            border-radius: 6px;
            padding: 12px 15px;
            transition: all 0.3s;
        }
        
        .form-control-custom:focus {
            border-color: var(--psc-blue);
            box-shadow: 0 0 0 0.25rem rgba(10, 74, 122, 0.15);
        }
        
        .btn-psc {
            background: linear-gradient(to right, var(--psc-blue) 0%, var(--psc-dark) 100%);
            color: white;
            font-weight: 600;
            padding: 12px 25px;
            border-radius: 6px;
            border: none;
            transition: all 0.3s;
            width: 100%;
        }
        
        .btn-psc:hover {
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(10, 74, 122, 0.2);
        }
        
        .btn-psc-secondary {
            background: white;
            color: var(--psc-blue);
            font-weight: 600;
            padding: 12px 25px;
            border-radius: 6px;
            border: 2px solid var(--psc-blue);
            transition: all 0.3s;
            width: 100%;
        }
        
        .btn-psc-secondary:hover {
            background-color: var(--psc-light-blue);
            color: var(--psc-dark);
        }
        
        .forgot-link {
            color: var(--psc-blue);
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .forgot-link:hover {
            text-decoration: underline;
        }
        
        footer {
            background: linear-gradient(135deg, var(--psc-blue) 0%, var(--psc-dark) 100%);
            color: white;
            padding: 25px 0;
            margin-top: 50px;
        }
        
        .footer-title {
            font-weight: 700;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .copyright {
            font-size: 0.85rem;
            opacity: 0.8;
        }
        
        .screenshot-info {
            font-size: 0.85rem;
            color: #666;
            font-style: italic;
            border-left: 3px solid #ddd;
            padding-left: 12px;
            margin-top: 20px;
            padding-top: 10px;
        }
        
        @media (max-width: 768px) {
            .header-title h1 {
                font-size: 1.2rem;
            }
            
            .main-content, .auth-section {
                padding: 10px;
            }
            
            .date-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
            
            .date-value {
                align-self: flex-start;
            }
        }
    </style>
</head>
<body>
    <!-- Toast Container -->
    <div class="toast-container position-fixed top-0 end-0 p-3" id="toastContainer"></div>
    <!-- Main Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" id="mainNavbar">
        <div class="container-fluid">
            <div class="collapse navbar-collapse" id="mainNavbarCollapse">
                <img src="img/logo.png" alt="PPDA Logo" style="display: block; margin: 0; max-width: 60px; height: auto; border-radius: 2px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0">

           
                    <li class="nav-item" id="homeNavItem"><a class="nav-link" href="#" onclick="showHomePage()">Home</a></li>
                    <div id="loggedInNav" style="display:none;">
                        <li class="nav-item" id="homeNavItem"><a class="nav-link" href="#" onclick="showHomePage()">Home</a></li>
                        <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('selectJob')">Jobs</a></li>
                        <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('personalDetails')">My Profile</a></li>
                        <li class="nav-link" href="#" onclick="showSection('myApplication')">My Applications</a></li>
                        <!-- <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('documents')">Documents</a></li> -->
                    </div>
                </ul>
            </div>
            <div class="d-flex align-items-center gap-3">
                <div class="dropdown" id="userDropdownContainer" style="display:none;">
                    <button type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" aria-label="User menu" style="cursor: pointer; color: white; background: none; border: none;">User</button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown" id="userDropdownMenu">
                        <li><h6 class="dropdown-header" id="navbarUserName">User</h6><span class="dropdown-item-text text-muted">Applicant</span></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="showSection('personalDetails')">Profile</a></li>
                        <li><button class="dropdown-item" id="btnLogout" type="button">Logout</button></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <!-- Homepage Area -->
    <div id="homePage">
      
        <!-- Main Content -->
        <div class="container my-5">
            <div class="row">
                <!-- Main Content Area -->
                <div class="col-lg-7 mb-4">
                    <div class="main-content">
                        <h2 class="section-title">
                            <i class="fas fa-calendar-alt me-2"></i> Interview Rescheduling Notice
                        </h2>
                        
                        <p>The Public Procurement and Disposal of Public Assets Authority informs all candidates who were scheduled to attend oral interviews from <strong>Monday, 10th November 2025 up to Friday, 14th November 2025</strong> under the above-mentioned advertisement that the interviews have been rescheduled.</p>
                        
                        <div class="alert alert-custom">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-eye fa-lg me-3" style="color: var(--psc-blue);"></i>
                                <div>

                                    <h1>New positions.</h1>
                                    <strong>Important Notice:</strong> All affected candidates will be contacted directly through the telephone numbers provided in their e-recruitment portals with details of the new interview dates.
                                    <div id="homepageJobList" class="mt-3">
                                        <!-- Available jobs will be listed here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <p>The Authority regrets any inconvenience caused by this change and appreciates the patience and cooperation of all affected candidates.</p>
                        
                        <div class="important-dates">
                            <h5 class="h6 mb-3" style="color: var(--psc-blue); font-weight: 700;">
                                <i class="far fa-calendar-check me-2"></i> Interview Schedule Summary
                            </h5>
                            
                            <div class="date-item">
                                <div class="date-label">Affected Period:</div>
                                <div class="date-value date-danger">10th - 14th Nov 2025</div>
                            </div>
                            
                            <div class="date-item">
                                <div class="date-label">New Interviews Start:</div>
                                <div class="date-value date-success">17th November 2025</div>
                            </div>
                            
                            <div class="date-item">
                                <div class="date-label">Status Updates:</div>
                                <div class="date-value date-primary">Via Phone & Portal</div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <div class="alert alert-light border">
                                <strong><i class="fas fa-info-circle me-2"></i>Please Note:</strong> Only the candidates who had been scheduled for interviews during the period of Monday, 10th November 2025 up to Friday, 14th November 2025 are affected.
                            </div>
                            
                            <p>The rest of the candidates should appear for interviews according to the interview schedules communicated to them earlier, starting from <strong>Monday 17th, November 2025</strong>.</p>
                        </div>

                        <div class="mt-4">
                            <h5 class="h6 mb-3" style="color: var(--psc-blue); font-weight: 700;">
                                <i class="fas fa-history me-2"></i> Activity Log
                            </h5>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">2025-11-01: Interview rescheduling notice posted</li>
                                <li class="list-group-item">2025-11-02: Candidates notified via phone and portal</li>
                                <li class="list-group-item">2025-11-03: New interview schedule communicated</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Authentication Area -->

                <div class="col-lg-5 mb-4">
                    <div id="authArea" style="display:block;">
                        <div class="auth-container">
                            <!-- Login Form -->
                            <form id="loginForm" style="display:block;">
                                <div class="text-center mb-4">
                                    <img src="img/logo.png" alt="Recruitment Portal Logo" class="img-fluid" style="max-width: 150px; border-radius: 10%;">
                                </div>
                                <h3 class="auth-form-title text-center" style="color: var(--psc-blue);">Recruitment Portal</h3>

                                <div class="security-notice">
                                    <p>Please enter your E-mail and Password to proceed...</p>
                                </div>
                                <br>
                                <div class="mb-3">
                                    <label for="loginEmail" class="form-label">Email address</label>
                                    <input type="email" class="form-control" id="loginEmail" required autocomplete="username" placeholder="Enter Valid Email" />
                                </div>

                                <div class="mb-3">
                                    <label for="loginPassword" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="loginPassword" required placeholder="Enter Valid Password" />
                                </div>

                                <button type="submit" class="btn btn-primary w-100 mb-2">Login</button>
                                <div class="auth-form-divider">
                                    Don't have an account yet? <span class="auth-toggle" id="showRegister">Register</span>
                                </div>
                            </form>

                            <!-- Register Form -->
                            <form id="registerForm" style="display:none;">
                                <h3 class="auth-form-title">Create Account</h3>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="first_name" class="form-label">First Name</label>
                                        <input type="text" class="form-control" id="first_name" name="first_name" required />
                                    </div>

                                    <div class="col-md-6 mb-3">
                                        <label for="middle_name" class="form-label">Middle Name</label>
                                        <input type="text" class="form-control" id="middle_name" name="middle_name" />
                                     </div>
    
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="last_name" class="form-label">Last Name</label>
                                        <input type="text" class="form-control" id="last_name" name="last_name" required />
                                    </div>


                                    <div class="col-md-6 mb-3">
                                        <label for="gender" class="form-label">Gender</label>
                                        <select class="form-control" id="gender" name="gender" required>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                
                                </div>
  
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="email" class="form-label">Email address</label>
                                        <input type="email" class="form-control" id="email" name="email" required />
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="phone_number" class="form-label">Contact</label>
                                        <input type="text" class="form-control" id="phone_number" name="phone_number" required />
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="dob" class="form-label">Date of Birth</label>
                                        <input type="date" class="form-control" id="dob" name="dob" required />
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="marital_status" class="form-label">Marital Status</label>
                                        <select class="form-control" id="marital_status" name="marital_status" required>
                                            <option value="">Select Status</option>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                            <option value="divorced">Divorced</option>
                                            <option value="widowed">Widowed</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <label for="nin" class="form-label">National ID</label>
                                        <input type="text" class="form-control" id="nin" name="nin" maxlength="15" required />
                                    </div>
                                    
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="password" class="form-label">Password</label>
                                        <div class="input-group">
                                            <input type="password" class="form-control" id="password" name="password" required autocomplete="new-password" />
                                            <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                                <i class="fas fa-eye" id="eyeIcon"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="password_confirmation" class="form-label">Confirm Password</label>
                                        <div class="input-group">
                                            <input type="password" class="form-control" id="password_confirmation" name="password_confirmation" required />
                                            <button class="btn btn-outline-secondary" type="button" id="togglePassword2">
                                                <i class="fas fa-eye" id="eyeIcon2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-primary w-100 mb-2">Register</button>
                                <div class="auth-form-divider">
                                    Already have an account? <span class="auth-toggle" id="showLogin">Login</span>
                                </div>
                            </form>

                            <!-- Email Verification with OTP -->
                            <div id="verifyEmailForm" style="display:none;" class="verification-container">
                                <h4 class="text-center mb-3" style="color: var(--psc-blue); font-size: 30px; font-weight: 900;">Enter Verification Code</h4>
                                <div class="card-body">
                                    <div class="steps-container">
                                        <div class="step done">
                                            <div class="step-circle"><i class="fas fa-check"></i></div>
                                            <div class="step-label">Email Entered</div>
                                        </div>
                                        <div class="step active">
                                            <div class="step-circle">2</div>
                                            <div class="step-label">Verify Code</div>
                                        </div>
                                        <div class="step">
                                            <div class="step-circle">3</div>
                                            <div class="step-label">Portal</div>
                                        </div>
                                    </div>
                                    <p class="text-muted text-center mb-4">We've sent a 6-digit code to <span id="verifyEmailText" class="fw-bold">user@example.com</span></p>

                                    <form id="otpForm">
                                        <div class="mb-4">
                                            <div class="otp-container">
                                                <input type="text" class="otp-input" maxlength="1" data-index="0" autocomplete="off">
                                                <input type="text" class="otp-input" maxlength="1" data-index="1" autocomplete="off">
                                                <input type="text" class="otp-input" maxlength="1" data-index="2" autocomplete="off">
                                                <input type="text" class="otp-input" maxlength="1" data-index="3" autocomplete="off">
                                                <input type="text" class="otp-input" maxlength="1" data-index="4" autocomplete="off">
                                                <input type="text" class="otp-input" maxlength="1" data-index="5" autocomplete="off">
                                            </div>
                                            <input type="hidden" id="otpCode" name="otp">
                                        </div>

                                        <button class="btn btn-primary mb-4" type="submit" id="verifyBtn" disabled>
                                            <span id="btnText">Verify Code</span>
                                            <span id="btnSpinner" class="spinner-border spinner-border-sm d-none ms-2"></span>
                                        </button>
                                    </form>

                                    <div class="resend-container">
                                        <p class="mb-2">Didn't receive the code? <a id="resendLink" class="resend-link disabled">Resend code <span id="countdown" class="countdown">(60s)</span></a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Application Area -->
    <div class="container-xxl py-4" id="applicationDashboard" style="display:none;">
        <div class="row">
            <!-- Sidebar -->
            <aside class="col-md-3 sidebar d-none d-md-block">
                <h5 class="sidebar-title">Application Steps</h5>
                <p class="sidebar-subtitle">Complete all sections</p>
                <nav class="nav flex-column" id="sidebarNav">
                    <a href="#" class="nav-link" data-step="personalDetails"><i class="fa fa-user"></i> Personal Details</a>
                    <a href="#" class="nav-link" data-step="educationTraining"><i class="fa fa-graduation-cap"></i> Education and Training</a>
                    <a href="#" class="nav-link" data-step="professionalMembership"><i class="fa fa-file-alt"></i> Professional Membership</a>
                    <a href="#" class="nav-link" data-step="employmentHistory"><i class="fa fa-briefcase"></i> Employment History</a>
                    <a href="#" class="nav-link" data-step="documents"><i class="fa fa-paperclip"></i> Documents</a>
                    <a href="#" class="nav-link" data-step="referee"><i class="fa fa-eye"></i> Referee</a>
                    <a href="#" class="nav-link" data-step="dependants"><i class="fa fa-users"></i> Dependants</a>
                    <a href="#" class="nav-link" data-step="previewApplication"><i class="fa fa-id-card"></i> Preview Application</a>
                    <a href="#" class="nav-link active" data-step="selectJob"><i class="fa fa-tasks"></i> Select a Job</a>
               
                </nav>
            </aside>

            <!-- Main Panel -->
            <main class="col-md-9 col-12" id="mainPanel">
                <!-- Personal Details -->
                <section data-step-content="personalDetails" class="d-none">
                    <h4 class="main-section-title">Personal Details</h4>
                    <form id="formPersonalDetails" class="mt-3">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="firstName" class="form-label">First Name</label>
                                <input type="text" class="form-control" id="firstName" name="firstName" required />
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="middleName" class="form-label">Middle Name</label>
                                <input type="text" class="form-control" id="middleName" name="middleName" />
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="lastName" class="form-label">Last Name</label>
                                <input type="text" class="form-control" id="lastName" name="lastName" required />
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="genderDetail" class="form-label">Gender</label>
                                <select class="form-control" id="genderDetail" name="gender" required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="dobDetail" class="form-label">Date of Birth</label>
                                <input type="date" class="form-control" id="dobDetail" name="dob" required />
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="statusDetail" class="form-label">Marital Status</label>
                                <select class="form-control" id="statusDetail" name="status" required>
                                    <option value="">Select Status</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="widowed">Widowed</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="contact" class="form-label">Contact</label>
                                <input type="text" class="form-control" id="contact" name="contact" required />
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="emailDetail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="emailDetail" name="email" required/>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="ninDetail" class="form-label">National ID No</label>
                                <input type="text" class="form-control" id="ninDetail" name="nin" required />
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary">Save Personal Details</button>
                    </form>
                </section>

                <!-- Education and Training -->
                <section data-step-content="educationTraining" class="d-none">
                    <div class="main-section-header">
                        <h4 class="main-section-title">Education and Training</h4>
                        <button class="btn btn-success" id="btnAddEducation"><i class="fa fa-plus"></i> Add</button>
                    </div>
                    <table class="table data-table mt-3" id="educationTable">
                        <thead>
                            <tr>
                                <th>Start Year</th>
                                <th>End Year</th>
                                <th>Qualification</th>
                                <th>Course</th>
                                <th>Institution</th>
                                <th>Class</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </section>

                <!-- Professional Membership -->
                <section data-step-content="professionalMembership" class="d-none">
                    <div class="main-section-header">
                        <h4 class="main-section-title">Professional Membership</h4>
                        <button class="btn btn-success" id="btnAddMembership"><i class="fa fa-plus"></i> Add</button>
                    </div>
                    <table class="table data-table" id="membershipTable">
                        <thead>
                            <tr>
                                <th>Enrollment Year</th>
                                <th>Expiry Year</th>
                                <th>Membership No</th>
                                <th>Membership Type</th>
                                <th>Institute</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </section>

                <!-- Employment History -->
                <section data-step-content="employmentHistory" class="d-none">
                    <div class="main-section-header">
                        <h4 class="main-section-title">Employment History</h4>
                        <button class="btn btn-success" id="btnAddEmployment"><i class="fa fa-plus"></i> Add</button>
                    </div>
                    <table class="table data-table" id="employmentTable">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Employer</th>
                                <th>Position</th>
                                <th>Responsibilities</th>
                                <th>Current Working</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </section>

                <!-- Documents -->
                <section data-step-content="documents" class="d-none">
                    <div class="main-section-header">
                        <h4 class="main-section-title">Documents</h4>
                        <button class="btn btn-success" id="btnAddDocument"><i class="fa fa-plus"></i> Upload</button>
                    </div>
                    <table class="table data-table" id="documentsTable">
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Type</th>
                                <th>Uploaded On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </section>

                <!-- Referee -->
                <section data-step-content="referee" class="d-none">
                    <div class="main-section-header">
                        <h4 class="main-section-title">Referee</h4>
                        <button class="btn btn-success" id="btnAddReferee"><i class="fa fa-plus"></i> Add</button>
                    </div>
                    <table class="table data-table" id="refereeTable">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Relationship</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Position</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </section>

                <!-- Dependants -->
                <section data-step-content="dependants" class="d-none">
                    <div class="main-section-header">
                        <h4 class="main-section-title">Dependants</h4>
                        <button class="btn btn-success" id="btnAddDependant"><i class="fa fa-plus"></i> Add</button>
                    </div>
                    <table class="table data-table" id="dependantsTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Relationship</th>
                                <th>Date of Birth</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </section>

                <!-- Preview Application -->
                <section data-step-content="previewApplication" class="d-none">
                    <h4 class="main-section-title">Preview Application</h4>
                    <p>This section will display a summary of all your entered details for review before submission.</p>
                    <div class="form-check mt-3">
                        <input class="form-check-input" type="checkbox" value="" id="termsCheckbox">
                        <label class="form-check-label" for="termsCheckbox">
                            I agree to the terms and conditions.
                        </label>
                    </div>
                   <button class="btn btn-primary" id="btnSubmitApplication">Submit Application</button>
                
                </section>

                <!-- Select a Job -->
                <section data-step-content="selectJob">
                    <h4 class="main-section-title">Select a Job</h4>
                    <table class="table data-table mt-3" id="jobTable">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Deadline</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="4" class="text-center text-muted">No jobs listed currently.</td></tr>
                        </tbody>
                    </table>
                </section>

                <!-- Submitted Applications -->
                <section data-step-content="myApplication" class="d-none">
                    <h4 class="main-section-title">My Applications</h4>
                    <p>Here you can view your submitted applications.</p>
                    <table class="table data-table mt-3" id="myApplicationsTable">
                        <thead>
                            <tr>
                                <th>Interview ID</th>
                                <th>Post</th>
                                <th>Department</th>
                                <th>Application Date (EAT) AM</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="5" class="text-center text-muted">No applications submitted yet.</td></tr>
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    </div>

    <!-- Footer -->
    <footer class="text-white py-5 px-4" style="background: linear-gradient(135deg, var(--psc-blue) 0%, var(--psc-dark) 100%);">
        <div class="container-fluid">
            <!-- Office Locations Grid -->
            <div class="row mb-5">
                <!-- Head Office -->
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <h5 class="fw-bold mb-3">Head Office</h5>
                    <ul class="list-unstyled small opacity-75">
                        <li>PPDA-URF Towers</li>
                        <li>Plot 39 Nakasero Road</li>
                        <li>P.O.Box 3925, Kampala Uganda</li>
                        <li class="mt-2">
                            <i class="fas fa-phone me-2"></i>+256-414-311100
                        </li>
                        <li>
                            <i class="fas fa-envelope me-2"></i><a href="mailto:info@ppda.go.ug" class="text-white-50 text-decoration-none">info@ppda.go.ug</a>
                        </li>
                    </ul>
                </div>

                <!-- Western Regional Office -->
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <h5 class="fw-bold mb-3">Western Regional Office</h5>
                    <ul class="list-unstyled small opacity-75">
                        <li>Plot 2, Western Bypass Link</li>
                        <li>Kamukuzi Hill-Mbarara</li>
                        <li>P.O. Box 1353, Mbarara, Uganda</li>
                        <li class="mt-2">
                            <i class="fas fa-phone me-2"></i>+256-414-311810
                        </li>
                        <li>
                            <i class="fas fa-envelope me-2"></i><a href="mailto:mbararaoffice@ppda.go.ug" class="text-white-50 text-decoration-none">mbararaoffice@ppda.go.ug</a>
                        </li>
                    </ul>
                </div>

                <!-- Northern Regional Office -->
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <h5 class="fw-bold mb-3">Northern Regional Office</h5>
                    <ul class="list-unstyled small opacity-75">
                        <li>Plot 1, Lower Churchill Drive</li>
                        <li>P.O. Box 999, Gulu - Uganda</li>
                        <li class="mt-2">
                            <i class="fas fa-phone me-2"></i>+256-414-311800
                        </li>
                        <li>
                            <i class="fas fa-envelope me-2"></i><a href="mailto:guluoffice@ppda.go.ug" class="text-white-50 text-decoration-none">guluoffice@ppda.go.ug</a>
                        </li>
                    </ul>
                </div>

                <!-- Eastern Regional Office -->
                <div class="col-12 col-md-6 col-lg-3 mb-4">
                    <h5 class="fw-bold mb-3">Eastern Regional Office</h5>
                    <ul class="list-unstyled small opacity-75">
                        <li>Oval Plaza, Plot 1</li>
                        <li>Court Road, Mbale - Uganda</li>
                        <li>P.O. Box 2173, Mbale - Uganda</li>
                        <li class="mt-2">
                            <i class="fas fa-phone me-2"></i>+256-414-311820
                        </li>
                        <li>
                            <i class="fas fa-envelope me-2"></i><a href="mailto:mbaleoffice@ppda.go.ug" class="text-white-50 text-decoration-none">mbaleoffice@ppda.go.ug</a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Bottom Section with Border -->
            <div class="border-top border-white-50 pt-4" style="border-color: rgba(255, 255, 255, 0.2) !important;">
                <div class="row align-items-center">
                    <div class="col-12 col-md-6 mb-3 mb-md-0">
                        <p class="small opacity-75 mb-0">
                            © <span id="year"></span> Public Procurement and Disposal of Public Assets Authority (PPDA). All rights reserved.
                        </p>
                    </div>
                    <div class="col-12 col-md-6 text-md-end">
                        <div class="d-flex flex-wrap gap-3 justify-content-md-end small">
                            <a href="https://www.ppda.go.ug/privacy-policy/" target="_blank" class="text-white-50 text-decoration-none opacity-75">Privacy Policy</a>
                            <a href="https://www.ppda.go.ug/terms/" target="_blank" class="text-white-50 text-decoration-none opacity-75">Terms of Service</a>
                            <a href="#" onclick="openCookieSettings()" class="text-white-50 text-decoration-none opacity-75">Cookies Policy</a>
                            <a href="https://www.ppda.go.ug/" target="_blank" class="text-white-50 text-decoration-none opacity-75">Sitemap</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Set current year in footer
        document.getElementById('year').textContent = new Date().getFullYear();
    </script>

    <!-- Modal Template (reuse for all forms) -->
    <div class="modal fade" id="crudModal" tabindex="-1" aria-labelledby="crudModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <form id="crudForm" novalidate>
                    <div class="modal-header">
                        <h5 class="modal-title" id="crudModalLabel">Modal Title</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="crudModalBody">
                        <!-- Dynamic form inserted here -->
                    </div>
                    <div class="modal-footer">
                        <input type="hidden" id="crudItemId" />
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="crudSaveBtn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Job Details Modal -->
    <div class="modal fade" id="jobDetailsModal" tabindex="-1" aria-labelledby="jobDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="jobDetailsModalLabel">Job Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="jobDetailsModalBody">
                    <!-- Job details will be populated here -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" id="btnApplyFromModal" style="display:none;">Apply for Job</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Login Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="loginModalLabel">Login to Apply</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="modalLoginForm">
                        <div class="text-center mb-4">
                            <img src="img/logo.png" alt="Recruitment Portal Logo" class="img-fluid" style="max-width: 150px; border-radius: 10%;">
                        </div>
                        <h3 class="auth-form-title text-center" style="color: var(--psc-blue);">Recruitment Portal</h3>

                        <div class="security-notice">
                            <p>Please enter your E-mail and Password to proceed...</p>
                        </div>
                        <br>
                        <div class="mb-3">
                            <label for="modalLoginEmail" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="modalLoginEmail" required autocomplete="username" placeholder="Enter Valid Email" />
                        </div>

                        <div class="mb-3">
                            <label for="modalLoginPassword" class="form-label">Password</label>
                            <input type="password" class="form-control" id="modalLoginPassword" required placeholder="Enter Valid Password" />
                        </div>

                        <button type="submit" class="btn btn-primary w-100 mb-2">Login</button>
                        <div class="auth-form-divider">
                            Don't have an account yet? <span class="auth-toggle" id="showRegisterFromModal">Register</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 Bundle + Axios -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <!-- Custom App Script -->
    <script src="js/app.js"></script>

    <script>
        // Global functions for navigation
        function showHomePage() {
            document.getElementById('homePage').style.display = 'block';
            document.getElementById('applicationDashboard').style.display = 'none';
        }

        function showSection(sectionName) {
            document.getElementById('homePage').style.display = 'none';
            document.getElementById('applicationDashboard').style.display = 'block';
            
            // Use the existing showStep function from app.js
            if (window.showStep) {
                window.showStep(sectionName);
            }
        }
    </script>
</body>
</html>































	(() => {
	/* ========== Configuration ========== */
	// Set your API base URL here - change this to point to your backend
	let apiUrl = 'http://192.168.32.158:8041/api/v1';
	let currentUser = getUser();
	/* ----- Elements ----- */
	const authArea = document.getElementById('authArea');
	const applicationDashboard = document.getElementById('applicationDashboard');
	const mainNavbar = document.getElementById('mainNavbar');
	const userDropdown = document.getElementById('userDropdown');
	const navbarUserName = document.getElementById('navbarUserName');
	const loggedInNav = document.getElementById('loggedInNav');
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
	// Track if user has selected a job to apply
	let hasSelectedJob = false;
	let selectedJob = null;

	// Bootstrap modal for CRUD
	const crudModalEl = document.getElementById('crudModal');
	const crudModal = new bootstrap.Modal(crudModalEl);
	const crudForm = document.getElementById('crudForm');
	const crudModalLabel = document.getElementById('crudModalLabel');
	const crudModalBody = document.getElementById('crudModalBody');
	const crudItemIdInput = document.getElementById('crudItemId');
	const crudSaveBtn = document.getElementById('crudSaveBtn');

	// Bootstrap modal for Job Details
	const jobDetailsModalEl = document.getElementById('jobDetailsModal');
	const jobDetailsModal = new bootstrap.Modal(jobDetailsModalEl);

	// Bootstrap modal for Login
	const loginModalEl = document.getElementById('loginModal');
	const loginModal = new bootstrap.Modal(loginModalEl);

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

	/* ----- Auto-Logout for Inactivity ---- */
	const INACTIVITY_TIMEOUT = 10 * 1000; // 10 seconds for testing (originally 5 minutes)
	let inactivityTimer;

	function resetInactivityTimer() {
		clearTimeout(inactivityTimer);
		if (currentUser) {
			inactivityTimer = setTimeout(() => {
				autoLogout();
			}, INACTIVITY_TIMEOUT);
		}
	}

function autoLogout() {
	clearSession();
	currentUser = null;
	showToast('You have been automatically logged out due to inactivity.', 'warning');
	showHomePage();
	// Hide logged in navigation
	const loggedInNav = document.getElementById('loggedInNav');
	const userDropdownContainer = document.getElementById('userDropdownContainer');
	if (loggedInNav) loggedInNav.style.display = 'none';
	if (userDropdownContainer) userDropdownContainer.style.display = 'none';
	stopInactivityTracking();
}

	function startInactivityTracking() {
		// List of events to track for activity
		const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
		events.forEach(event => {
			document.addEventListener(event, resetInactivityTimer, true);
		});
		resetInactivityTimer();
	}

	function stopInactivityTracking() {
		clearTimeout(inactivityTimer);
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
		mainNavbar.style.display = 'flex';
		document.body.classList.remove('auth-view');

		// Update navigation items for logged-in user
		const userDropdownContainer = document.getElementById('userDropdownContainer');
		const homeNavItem = document.getElementById('homeNavItem');
		if (loggedInNav) loggedInNav.style.display = 'flex';
		if (userDropdownContainer) userDropdownContainer.style.display = 'block';
		if (homeNavItem) homeNavItem.style.display = 'none';
	}

	function showAuth() {
		// Hide all other areas
		applicationDashboard.style.display = 'none';
		mainNavbar.style.display = 'none';
		const homePage = document.getElementById('homePage');
		if (homePage) homePage.style.display = 'block';

		// Show auth area
		authArea.style.display = 'block';
		document.body.classList.add('auth-view');
	}

function showHomePage() {
		// Hide all other areas
		authArea.style.display = currentUser ? 'none' : 'block';
		applicationDashboard.style.display = 'none';

		// Show home page and navbar
		const homePage = document.getElementById('homePage');
		if (homePage) homePage.style.display = 'block';


		mainNavbar.style.display = 'flex';

		// Show/hide navigation items based on login status
		const userDropdownContainer = document.getElementById('userDropdownContainer');
		const homeNavItem = document.getElementById('homeNavItem');
		if (currentUser) {
			if (loggedInNav) loggedInNav.style.display = 'flex';
			if (userDropdownContainer) userDropdownContainer.style.display = 'block';
			if (homeNavItem) homeNavItem.style.display = 'none';
		} else {
			if (loggedInNav) loggedInNav.style.display = 'none';
			if (userDropdownContainer) userDropdownContainer.style.display = 'none';
			if (homeNavItem) homeNavItem.style.display = 'block';
		}

		document.body.classList.remove('auth-view');

		// Load jobs into homepage alert
		loadHomepageJobs();
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

	function showVerifyEmailForm(email) {
		const loginForm = document.getElementById('loginForm');
		const registerForm = document.getElementById('registerForm');
		const verifyForm = document.getElementById('verifyEmailForm');
		const emailText = document.getElementById('verifyEmailText');
		if (loginForm) loginForm.style.display = 'none';
		if (registerForm) registerForm.style.display = 'none';
		if (verifyForm) verifyForm.style.display = 'block';
		if (emailText) emailText.textContent = email;
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
			formElement.reset();
		} catch (error) {
			// Error is already handled by Axios interceptor
			// Just prevent form submission from continuing
			console.error('Login error:', error);
		}
	}

	if (loginForm) {
		loginForm.addEventListener('submit', async e => {
			await handleLoginSubmit(e, 'loginEmail', 'loginPassword', loginForm);
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
				const response = await axios.post(API.validateCode, { code, email: pendingUser.email });

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

				// Save user and token objects to localStorage
				if (response.data.user) {
					localStorage.setItem('user', JSON.stringify(response.data.user));
					currentUser = response.data.user; // Update currentUser
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

				// Reload page to refresh state and show logged-in navigation
				window.location.reload();
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
			currentUser = null; // Clear currentUser
			showToast('Logged out successfully', 'success');
			// Hide logged in navigation and user dropdown
			const userDropdownContainer = document.getElementById('userDropdownContainer');
			if (loggedInNav) loggedInNav.style.display = 'none';
			if (userDropdownContainer) userDropdownContainer.style.display = 'none';
			// Redirect to homepage with login form and auto refresh
			window.location.reload();
		});
	}

	/* =============== Application Logic =============== */
	// API endpoints - dynamically built with the apiUrl
const API = {
	login: `${apiUrl}/login`,
	registerForm: `${apiUrl}/register`,
	// === CRUD BASE ENDPOINTS (NO ID INSIDE) ===
	educationTraining: `${apiUrl}/educations`,
	professionalMembership: `${apiUrl}/memberships`,
	employmentHistory: `${apiUrl}/employments`,
	documents: `${apiUrl}/documents`,
	referee: `${apiUrl}/referees`,
	dependants: `${apiUrl}/dependants`,
	myApplications: `${apiUrl}/myapplication`,

	// === ENDPOINTS FOR FRONTEND RETRIEVAL (DYNAMIC) ===
	getApplicant: (id) => `${apiUrl}/applicants/${id}`,
	personalDetails: (id) => `${apiUrl}/applicants/${id}`,
	getApplication: (id) => `${apiUrl}/applications/${id}`,
	getReferees: (id) => `${apiUrl}/referees/${id}`,
	getDependants: (id) => `${apiUrl}/dependants/${id}`,
	getDocuments: (id) => `${apiUrl}/documents/${id}`,
	getEmploymentHistory: (id) => `${apiUrl}/employments/${id}`,
	getEducationTraining: (id) => `${apiUrl}/educations/${id}`,
	getProfessionalMemberships: (id) => `${apiUrl}/memberships/${id}`,
	getMyApplications: (id) => `${apiUrl}/myapplication/${id}`,
	

	// === JOB/APPLICATION RELATED ===
	selectJob: `${apiUrl}/positions`,
	getActivepositions: `${apiUrl}/positions`,
	postApplication: `${apiUrl}/applications`,
	postApplicationSection: `${apiUrl}/application_section`,
	retrieveApplication: `${apiUrl}/retrieve_application`,
	validateCode: `${apiUrl}/validate_code`,
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
		const stepAttr = a.getAttribute('data-step');
		a.classList.toggle('active', stepAttr === step);
		if (step === 'selectJob' && stepAttr !== 'selectJob') {
			a.classList.add('disabled');
		} else {
			a.classList.remove('disabled');
		}
		});
		mainPanel.querySelectorAll('section[data-step-content]').forEach(sec => {
		sec.classList.toggle('d-none', sec.getAttribute('data-step-content') !== step);
		});

		// Show sidebar for selectJob and previewApplication to allow navigation, hide for other steps
		const sidebar = document.querySelector('aside.sidebar');
		if (step === 'selectJob' || step === 'previewApplication') {
			sidebar.classList.remove('d-none');
		} else {
			sidebar.classList.add('d-none');
		}

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
			console.log('updateItem called:');
			console.log('  Base URL:', apiUrl);
			console.log('  ID:', id);
			console.log('  Full URL:', fullUrl);
			console.log('  Data:', item);

			const response = await axios.put(fullUrl, item);
			console.log('updateItem response:', response.data);

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
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
		try {
		// Fetch personal details or create default from session
		const response = await axios.get(API.personalDetails(currentUser.id));
		const session = getSession();
		let pd = response.data || {};
		
		// If no saved data, prefill from user object in localStorage first, then session
		if (!pd.email && currentUser) {
			pd.email = currentUser.email || '';
			pd.firstName = currentUser.first_name || '';
			pd.middleName = currentUser.middle_name || '';
			pd.lastName = currentUser.last_name || '';
			pd.contact = currentUser.phone_number || '';
			pd.nin = currentUser.nin || '';
			pd.gender = currentUser.gender || '';
			pd.dob = currentUser.dob || '';
			pd.status = currentUser.marital_status || '';
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

		// Store in dataCache for preview
		dataCache['personalDetails'] = [pd];
		} catch {
		// show fallback - try to populate from user object if available
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
			await axios.put(API.personalDetails(currentUser.id), data);
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
			<input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">
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
			<div class="col-md-8 mb-3">
					<label class="form-label fw-bold">Qualification</label>
					<select class="form-control" id="qualification" name="qualification" required>
						<option value="">Select Qualification</option>
						<option value="PhD" ${editItem?.qualification === 'PhD' ? 'selected' : ''}>PhD</option>
						<option value="Masters" ${editItem?.qualification === 'Masters' ? 'selected' : ''}>Masters</option>
						<option value="Bachelors" ${editItem?.qualification === 'Bachelors' ? 'selected' : ''}>Bachelors</option>
						<option value="Diploma" ${editItem?.qualification === 'Diploma' ? 'selected' : ''}>Diploma</option>
						<option value="Certificate" ${editItem?.qualification === 'Certificate' ? 'selected' : ''}>Certificate</option>
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
						<option value="Third Class" ${editItem?.degree_class === 'Third Class' ? 'selected' : ''}>Third Class</option>
						<option value="Pass" ${editItem?.degree_class === 'Pass' ? 'selected' : ''}>Pass</option>
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

		// Toggle Class of Degree visibility based on qualification
		function toggleClassOfDegree() {
			const qualification = document.getElementById('qualification').value;
			const container = document.getElementById('classOfDegreeContainer');
			if (qualification === 'Bachelors') {
				container.style.display = 'block';
			} else {
				container.style.display = 'none';
			}
		}

		// Add event listener to qualification select
		document.getElementById('qualification').addEventListener('change', toggleClassOfDegree);

		// Initial toggle for edit mode
		toggleClassOfDegree();
	}

	async function loadEducation() {
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
		try {
			let items = [];

			// Use GET route for applicant
			const educationUrl = API.getEducationTraining(currentUser.id);
			items = await fetchItems(educationUrl, 'educationTraining');

			// fallback if no API data
			if (!items || items.length === 0) {
				if (currentUser && currentUser.education && Array.isArray(currentUser.education)) {
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
					{ key: 'degree_class' },
					{ key: 'ongoing', formatter: val => val ? 'Current' : 'Past' }
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
        <input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">


		<div class="row">
            <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Enrollment Year</label>
                <select class="form-control" id="end_year" name="enrollment_year" required>
						<option value="">Select Year</option>
						${Array.from({length: new Date().getFullYear() - 1990 + 1}, (_, i) => 1990 + i)
							.map(year => `<option value="${year}" ${editItem?.enrollment_year == year ? 'selected' : ''}>${year}</option>`).join('')}
				</select>
            </div>

		
			<div class="col-md-6 mb-3">
				<label class="form-label fw-bold">Year of Expiry</label>
				<select class="form-control" id="expiry_year" name="expiry_year">
						<option value="">Select Year</option>
						${Array.from({length: new Date().getFullYear() - 1990 + 1}, (_, i) => 1990 + i)
							.map(year => `<option value="${year}" ${editItem?.expiry_year == year ? 'selected' : ''}>${year}</option>`).join('')}
					</select>
			</div>
		</div>
        

        
            <div class="col-md-12 mb-3">
                <label class="form-label fw-bold">Institute</label>
                <input type="text" class="form-control" 
                    id="membershipInstitute" 
                    name="institute" 
                    placeholder="Eg, ISACA, Rotary, Lions Club" 
                    required
                    value="${editItem?.institute || ''}">
            </div>

            <div class="col-md-12 mb-3">
                <label class="form-label fw-bold">Membership Type</label>
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
	
    `;

    crudModal.show();
}


	async function loadMembership() {
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
		let items = [];
		// Use GET route for applicant
		const membershipUrl = API.getProfessionalMemberships(currentUser.id);
		items = await fetchItems(membershipUrl, 'professionalMembership');
		// fallback if no API data
		if (!items || items.length === 0) {
			if (currentUser && currentUser.memberships && Array.isArray(currentUser.memberships)) {
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
		renderTableRows(items, membershipTableBody, [
		{ key: 'enrollment_year' },
		{ key: 'expiry_year' },
		{ key: 'membership_number' },
		{ key: 'type' },
		{ key: 'institute' }
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
        <input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">


		<div class="form-check mb-3">
				<input class="form-check-input" type="checkbox" value="" id="is_current" name="is_current" ${editItem?.is_current ? 'checked' : ''}>
				<label class="form-check-label fw-bold" for="is_current">
					Currently Employed Here
				</label>
		</div>
		
		
		<div class="row">
				<div class="col-md-6 mb-3">
					<label class="form-label fw-bold">From Year</label>
					<input type="date" class="form-control calander" name="start_date" value="${editItem?.start_date || ''}"/>
				</div>
				<div class="col-md-6 mb-3" id="end_date_container" ${editItem?.is_current ? 'style="display: none;"' : ''}>
					<label class="form-label fw-bold">To Year</label>
					<input type="date" class="form-control calander"  name="end_date" value="${editItem?.end_date || ''}" ${editItem?.is_current ? 'disabled' : ''}/>

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

    // Add event listener to toggle end_date input disabled state
    const checkbox = document.getElementById('is_current');
    const endDateInput = document.querySelector('input[name="end_date"]');
    if (checkbox && endDateInput) {
        checkbox.addEventListener('change', () => {
            endDateInput.disabled = checkbox.checked;
        });
    }
}
	async function loadEmployment() {
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
		let items = [];
		// Use GET route for applicant
		items = await fetchItems(API.getEmploymentHistory(currentUser.id), 'employmentHistory');
		// fallback if no API data
		if (!items || items.length === 0) {
			if (currentUser && currentUser.employments && Array.isArray(currentUser.employments)) {
				items = currentUser.employments.map((mem, index) => ({
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
        <input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">

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
		if (confirm('Delete this employment record?')) {
			const success = await deleteItem(API.referee, id, 'referee');
			if (success) loadReferee();
		}
		});
	}


	
// Documents 
const documentsTableBody = document.querySelector('#documentsTable tbody');

document.getElementById('btnAddDocument').addEventListener('click', () => openDocumentModal());

function openDocumentModal(editItem = null) {

    crudModalLabel.innerHTML = `
        <i class="fas fa-file me-2"></i>
        ${editItem ? 'Edit Document' : 'Add Document'}
    `;

    // Set ID (used for update)
    crudItemIdInput.value = editItem ? editItem.id : '';

    // Modal form body
    crudModalBody.innerHTML = `
        <input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">

		<div class="row">
        <div class="col-md-6 mb-3">
          <label for="document_type" class="form-label fw-bold">Document Type</label>
          <select type="text" class="form-control form-control" id="document_type" name="document_type"  required value="${editItem?.document_type|| ''}">
            <option value="">Select type</option>
            <option value="PhD">PhD</option>
            <option value="Masters">Masters</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Diploma" >Diploma</option>
            <option value="Certificate">Certificate</option>
			<option value="Professional Certification">Professional Certification</option>
            <option value="NationId">National Id</option>
			<option value="LC 1 Letter">LC 1 Letter</option>
			<option value="University Refference Letter">University Reference Letter</option>
			<option value="Reccommendation Letter">Recommendation Letter</option>
            


          </select>
          </div>
        <div class="col-md-6 mb-3">
          <label for="title" class="form-label fw-bold">Document Title</label>
          <input type="text" class="form-control form-control" id="title" name="title" placeholder="e.g. Transcript" required value="${editItem ? editItem.title : ''}">
        </div>
      </div>



      <div class="mb-3">
        <label for="file_path" class="form-label fw-bold"><i class="fas fa-upload me-1"></i>Choose File</label>
        <input type="file" class="form-control form-control" id="file_path" name="file_path" accept="application/pdf" ${editItem ? '' : 'required'}>
      </div>

    
    `;

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
					document_type: mem.document_type || '',
					title: mem.title || '',
					file_path: mem.file_path || ''

				}));
				dataCache['documents'] = items;
			}
		}
		renderTableRows(items, documentsTableBody, [
		{ key: 'document_type' },
		{ key: 'title' },
		{ key: 'file_path', formatter: val => `<a href="${val}" target="_blank">View Document</a>` }
		], openDocumentModal, async id => {
		if (confirm('Delete this document record?')) {
			const success = await deleteItem(API.documents, id, 'documents');
			if (success) loadDocuments();
		}
		});
	}



	// Dependants
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
        <input type="hidden" name="applicant_id" value="${currentUser?.id || ''}">

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
			<input type="date" class="form-control calender" id="birth_date" name="birth_date"  required value="${editItem?.birth_date || ''}">
			</div>
		</div>
    `;

    crudModal.show();
}
	async function loadDependants() {
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
		let items = [];
		// Use GET route for applicant
		items = await fetchItems(API.getDependants(currentUser.id), 'dependants');

		// fallback if no API data
		if (!items || items.length === 0) {
			if (currentUser && currentUser.dependants && Array.isArray(currentUser.dependants)) {
				items = currentUser.dependants.map((mem, index) => ({
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

	// Submitted Applications
	const myApplicationsTableBody = document.querySelector('#myApplicationsTable tbody');

	async function loadSubmittedApplications() {
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
		try {
			let items = [];
			// Fetch submitted applications for the current user
			const response = await axios.get(API.getMyApplications(currentUser.id));
			items = response.data || [];
			dataCache['submittedApplications'] = items;

			// Render table
			renderTableRows(
				items,
				myApplicationsTableBody,
				[
					{ key: 'interview_id' },
					{ key: 'post' },
					{ key: 'department' },
					{ key: 'application_date', formatter: val => val ? new Date(val).toLocaleDateString() : '' },
					{ key: 'status' }
				],
				null, // No edit function for submitted applications
				null  // No delete function for submitted applications
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
		await loadDocuments();
		await loadReferee();
		await loadDependants();

		let html = '<div class="row">';

		const sectionTitles = {
			educationTraining: 'Education & Training',
			professionalMembership: 'Professional Memberships',
			employmentHistory: 'Employment History',
			documents: 'Documents',
			referee: 'References',
			dependants: 'Dependants',
			personalDetails: 'Personal Details'
		};

		const excludedFields = ['updated_at', 'created_at', 'applicant_id'];

		for (const key in dataCache) {
			if (!dataCache[key] || dataCache[key].length === 0) continue;

			const sectionTitle = sectionTitles[key] || key.replace(/([A-Z])/g, ' $1').trim();
			const items = dataCache[key];
			let keys = Object.keys(items[0]).filter(k => !excludedFields.includes(k));
			if (key === 'personalDetails') {
				keys = keys.filter(k => k !== 'password' && k !== 'email_verified' && k !== 'nin_verified' && k !== 'id' && k !== 'employee_id' && k !== 'nin' && k !== 'email');
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
					<strong>I certify that the facts given in this form are true to the best of my knowledge and I understand that
					giving false information can lead to dismissal..</strong>
				</label>
			</div>

			<div class="text-center mt-4">
				<button class="btn btn-success btn-lg" id="btnSubmitApplication" ${!hasSelectedJob ? 'disabled' : ''} disabled>
					<i class="fas fa-paper-plane me-2"></i>Submit Application
				</button>
			</div>




		`;

		// Handle terms checkbox
		const termsCheckbox = document.getElementById('termsCheckbox');
		const submitBtn = document.getElementById('btnSubmitApplication');

		termsCheckbox.addEventListener('change', () => {
			submitBtn.disabled = !termsCheckbox.checked || !hasSelectedJob;
		});

		submitBtn.addEventListener('click', async () => {
			if (!termsCheckbox.checked) {
				showToast('Please agree to the terms and conditions before submitting.', 'warning');
				return;
			}

			if (!currentUser || !currentUser.id) {
				showToast('User not authenticated. Please log in.', 'warning');
				return;
			}

			if (!selectedJob || !selectedJob.id) {
				showToast('Please select a job to apply for.', 'warning');
				return;
			}

			try {
				// Prepare application data
				const applicationData = {
					applicant_id: parseInt(currentUser.id),
					position_id: parseInt(selectedJob.id),
					personal_details: dataCache.personalDetails ? dataCache.personalDetails[0] : {},
					education_training: dataCache.educationTraining || [],
					professional_membership: dataCache.professionalMembership || [],
					employment_history: dataCache.employmentHistory || [],
					documents: dataCache.documents || [],
					referees: dataCache.referee || [],
					dependants: dataCache.dependants || [],
					submission_date: new Date().toISOString(),
					status: 'submitted'
				};
// console.log('Submitting application data:', applicationData);
// //log vacancy id
// console.log('Vacancy ID:', selectedJob.id);
				// Submit application to API
				const response = await axios.post(API.postApplication, applicationData);

				if (response.data && response.data.success) {
					showToast('Application submitted successfully!', 'success');

					// Reset application state
					hasSelectedJob = false;
					selectedJob = null;
					dataCache = {};

					// Navigate to My Applications section
					showStep('myApplication');
					loadSubmittedApplications();
				} else {
					showToast('Failed to submit application. Please try again.', 'error');
				}
			} catch (error) {
				console.error('Error submitting application:', error);
				showToast('Failed to submit application. Please try again.', 'error');
			}
		});
	}

	// Select Job
	const jobTableBody = document.querySelector('#jobTable tbody');

	// Function to show job details modal
	function showJobDetailsModal(job) {
		document.getElementById('jobDetailsModalLabel').textContent = job.name || 'Job Details';
		const body = document.getElementById('jobDetailsModalBody');
		body.innerHTML = `
		
			<h5 class="mb-3">EXTERNAL VACANCY ANNOUNCEMENT</h5>
			<p>The Public Procurement and Disposal of Public Assets Authority (PPDA) is 
			established under the PPDA Act No.1 of 2003 to develop standards and regulate
			 procurement and disposal practices in respect of all Procuring and Disposing Entities 
			 which include Central Government Ministries and Departments, Local Governments, State 
			 Enterprises, Constitutional and Statutory 
			Bodies and post primary training institutions.</p>
			
			<p>The PPDA is seeking to recruit a qualified, competent and highly motivated Ugandan to fill the Position.
			</p>


			<div class="row">
				<div class="col-md-6">
					<p><strong>Position:	${job.name || 'N/A'}</strong></p>
					<p><strong>Vacancy:	${job.vacancy_number || 'N/A'}</strong></p>
					<p><strong>Reports to:	${job.reports_to || 'N/A'}</strong></p> 
					<p><strong>Department: ${job.department || 'N/A'}</strong></p>
					<p><strong>Department Head:	${job.department_head || 'N/A'}</strong></p> 
					<p><strong>Deadline:	${job.deadline || 'N/A'}</strong></p>
				
			</div>
			<hr/>

			<p><strong>Job Purpose:</strong> ${job.purpose || 'N/A'}</p>

			<p><strong>Duties and Responsibilities:</strong> ${job.duties || 'N/A'}</p>

			<p><strong>Person Specifications:</strong> ${job.specifications || 'N/A'}</p>

			<p><strong>CONDITIONS OF SERVICE:</strong> ${job.conditions || 'N/A'}</p>

		<div class="mb-3 alert alert-info">
			<p><strong>APPLICATION GUIDELINES:</strong></p>
			<ol>
				<li>All qualified candidates should submit completed application forms downloaded from www.ppda.go.ug (Look for Careers, Jobs, positions and application form) and relevant academic documents via Email to; recruitment@ppda.go.ug with the job position applied for as the subject.</li>
				<li>The attachments should be limited to the following documents; a duly filled application form, National ID, O-level and A-level Certificates, Honours Degree, Master’s Degree, and any other Qualifications required.</li>
				<li>All attachments should be sent as one file in PDF format not exceeding 20 MBs.</li>
				<li>The subject of the email should be “Application for the Position of Manager Human Resources”</li>
			</ol>
		</div>
		`;
		const applyBtn = document.getElementById('btnApplyFromModal');
		if (isBrowseMode) {
			applyBtn.style.display = 'none';
		} else {
			applyBtn.style.display = 'inline-block';
			applyBtn.onclick = () => {
				selectedJob = job;
				hasSelectedJob = true;
				showStep('previewApplication');
				jobDetailsModal.hide();
			};
		}
		jobDetailsModal.show();
	}

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
				showJobDetailsModal(job);
			});
			tdActions.appendChild(btnView);

			if (!isBrowseMode) {
			const btnApply = document.createElement('button');
			btnApply.className = 'btn btn-sm btn-success';
			btnApply.type = 'button';
			btnApply.innerHTML = '<i class="fa fa-paper-plane"></i> Apply';
			btnApply.addEventListener('click', () => {
				showJobDetailsModal(job);
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
		if (!currentUser || !currentUser.id) {
			showToast('User not authenticated. Please log in.', 'warning');
			return;
		}
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
		// Extract numeric ID if it contains a path (e.g., "educations/2001" -> "2001")
		let numericId = id;
		if (id && typeof id === 'string' && id.includes('/')) {
			numericId = id.split('/').pop(); // Get the last part after /
		}
		
		let key = '';
		let stepApiUrl = ''; // Use local variable, not global apiUrl!
		switch (currentStep) {
			case 'educationTraining': stepApiUrl = API.educationTraining; key = 'educationTraining'; break;
			case 'professionalMembership': stepApiUrl = API.professionalMembership; key = 'professionalMembership'; break;
			case 'employmentHistory': stepApiUrl = API.employmentHistory; key = 'employmentHistory'; break;
			case 'documents': stepApiUrl = API.documents; key = 'documents'; if (!numericId) data.uploadedOn = new Date().toLocaleDateString(); break;
			case 'referee': stepApiUrl = API.referee; key = 'referee'; break;
			case 'dependants': stepApiUrl = API.dependants; key = 'dependants'; break;
			default:
			showToast('Unsupported step form.', 'error');
			crudModal.hide();
			return;
		}
		try {
			if (numericId) {
				await updateItem(stepApiUrl, numericId, data, key);
				showToast('Record updated.', 'success');
			} else {
				await createItem(stepApiUrl, data, key);
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
		
		// Set dropdown text with user's full name or empty if no currentUser
		if (currentUser && currentUser.first_name && currentUser.last_name) {
			userDropdown.textContent = currentUser.first_name + ' ' + currentUser.last_name;
		} else {
			userDropdown.textContent = session.name || session.email || 'User';
		}

		// Hide loggedInNav if no currentUser
		if (loggedInNav) {
			loggedInNav.style.display = (!currentUser || !currentUser.id) ? 'none' : 'flex';
		}

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

	// Function to handle job click from homepage
	window.handleJobClick = function(jobId) {
		if (!currentUser) {
			document.getElementById('authArea').scrollIntoView({behavior: 'smooth'});
		} else {
			showSection('selectJob');
		}
	};

	// Function to load jobs into homepage alert
	async function loadHomepageJobs() {
		try {
			const response = await axios.get(API.selectJob);
			const jobs = response.data.data || [];
			const jobListDiv = document.getElementById('homepageJobList');
			if (!jobs.length) {
				jobListDiv.innerHTML = '<p>No jobs available at the moment.</p>';
				return;
			}
			let html = '<ul class="list-group list-group-flush">';
			jobs.forEach(job => {
				html += `<li class="list-group-item d-flex justify-content-between align-items-center">
					<div>
						<strong>${job.name || ''}</strong><br>
						<small class="text-muted">${job.location || ''} - Deadline: ${job.deadline || ''}</small>
					</div>
					<button class="btn btn-sm btn-primary" onclick="handleJobClick(${job.id})">Apply</button>
				</li>`;
			});
			html += '</ul>';
			jobListDiv.innerHTML = html;
		} catch (error) {
			console.error('Error loading homepage jobs:', error);
			document.getElementById('homepageJobList').innerHTML = '<p>Failed to load jobs.</p>';
		}
	}

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
		const user = getSession();
		if (user) {
			// User has session - validate token with backend
			try {
				const isValid = await validateTokenWithBackend();
				if (isValid) {
					// Token valid and user exists in DB
					showDashboard();
					initAppAfterLogin();
				} else {
					// User no longer exists or token invalid
					// showToast('Your session is no longer valid. Please log in again.', 'warning');
					//hide loggedInNav
					loggedInNav.style.display = 'none';
					showHomePage();
					showLoginForm();
				}
			} catch (error) {
				// Network error - show home page but allow user to try again
				console.error('Error validating token:', error);
				showHomePage();
				initAppAfterLogin();
			}
		} else {
			// Not logged in, show home page with login cards
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	:root {
  --primary-color: #0a4a7a;
  --secondary-color: #0a4a7a;
  --accent-color: #ff6b35;
  --light-color: #f8fafc;
  --dark-color: #343a40;
  --success-color: #0a4a7a;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --border-radius: 12px;
  --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  --transition: all 0.3s ease;
  --glass-bg: rgba(255, 255, 255, 0.95);
  --glass-border: rgba(255, 255, 255, 0.2);
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

body.auth-view {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: url('../img/background.jpeg') no-repeat center center fixed;
  background-size: cover;
  position: relative;
}

body.auth-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 75, 140, 0.85);
  backdrop-filter: blur(2px);
  z-index: -1;
}

#mainNavbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  background-color: #0a4a7a !important;
}

/* Toast Notifications */
.toast-container {
  z-index: 9999;
}

.toast {
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  border: none;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast.hide {
  animation: slideOut 0.3s ease-out;
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

.toast-header {
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
}

.toast-header.success {
  background-color: #d4edda;
  color: #155724;
}

.toast-header.error {
  background-color: #f8d7da;
  color: #721c24;
}

.toast-header.warning {
  background-color: #fff3cd;
  color: #856404;
}

.toast-header.info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.toast-header.success .toast-close {
  color: #155724;
}

.toast-header.error .toast-close {
  color: #721c24;
}

.toast-header.warning .toast-close {
  color: #856404;
}

.toast-header.info .toast-close {
  color: #0c5460;
}

/* Sidebar Styling */
.sidebar {
  min-height: 75vh;
  background: #0a4a7a;
  color: white;
  padding: 1.5rem 1rem;
  border-radius: 0;
  box-shadow: none;
}

.sidebar-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.sidebar-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.sidebar .nav-link {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  transition: var(--transition);
}

.sidebar .nav-link:hover {
  background-color: rgba(49, 116, 246, 0.2);
  color: white;
  transform: translateX(4px);
}

.sidebar .nav-link.active {
  background-color: rgba(49, 116, 246, 0.2);
  color: white;
  box-shadow: 0 4px 12px rgba(49, 116, 246, 0.3);
}

/* Shared container shadow for attached sidebar and main panel */
.row > .sidebar,
.row > main {
  box-shadow: var(--box-shadow);
}

.row > .sidebar:first-child {
  border-radius: var(--border-radius) 0 0 var(--border-radius);
}

.row > main:last-child {
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

/* Main Content Area */
main {
  padding: 2rem;
  background-color: white;
  border-radius: 0;
  box-shadow: none;
  min-height: 55vh;
}

/* Personal Details Form Styling */
#formPersonalDetails {
  background: #f8fafc;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  border: 1px solid #e9ecef;
}

#formPersonalDetails .form-label {
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

#formPersonalDetails .form-control {
  border: 1px solid #e1e5eb;
  border-radius: 8px;
  padding: 0.55rem 1rem;
  font-size: 1rem;
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.9);
}

#formPersonalDetails .form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(0, 4, 53, 0.25);
  background: white;
  transform: translateY(-1px);
}

#formPersonalDetails .form-control:hover {
  border-color: var(--secondary-color);
}

#formPersonalDetails .btn-primary {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  font-weight: 600;
  border-radius: 8px;
  transition: var(--transition);
  box-shadow: 0 4px 15px rgba(0, 4, 53, 0.3);
}

#formPersonalDetails .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 4, 53, 0.4);
}

.main-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1rem;
}

.main-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0;
}

/* Authentication Container */
.auth-container {
  max-width:600px;
  margin: 4rem auto;
  padding: 2.5rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  border: 1px solid #f0f0f0;
}

.auth-form-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--dark-color);
}

.auth-form-divider {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
  font-size: 0.9rem;
  color: #6c757d;
}

.auth-toggle {
  font-size: 0.9rem;
  cursor: pointer;
  color: var(--primary-color);
  font-weight: 600;
  transition: var(--transition);
}

.auth-toggle:hover {
  text-decoration: underline;
  color: var(--accent-color);
}

/* Button Styles */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: 0 4px 15px rgba(26, 75, 140, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 75, 140, 0.4);
}

.btn-primary:focus {
  box-shadow: 0 0 0 0.2rem rgba(26, 75, 140, 0.25);
}

/* Table Styling */
.data-table {
  border-collapse: collapse;
  width: 100%;
}

.data-table thead th {
  background-color: #f8fafc;
  font-weight: 600;
  padding: 1rem;
  border-bottom: 2px solid #e9ecef;
  color: var(--dark-color);
}

.data-table tbody tr {
  border-bottom: 1px solid #e9ecef;
  transition: var(--transition);
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

.data-table td {
  padding: 1rem;
}

/* Button Group */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* OTP Verification Styles */
.verification-container {
  max-width: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.card {
  border: none;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: var(--transition);
}

.card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.card-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;
  padding: 30px 20px;
  border-bottom: none;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.logo {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.logo-text {
  font-weight: 700;
  font-size: 24px;
  color: white;
}

.card-title {
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 5px;
}

.card-subtitle {
  opacity: 0.9;
  font-size: 14px;
}

.card-body {
  padding: 20px 15px;
  background: white;
}

.steps-container {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  position: relative;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step:not(:last-child):after {
  content: '';
  position: absolute;
  top: 15px;
  right: -50%;
  width: 100%;
  height: 2px;
  background-color: #e9ecef;
  z-index: 1;
}

.step.active:not(:last-child):after {
  background-color: var(--primary-color);
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
  font-weight: bold;
  color: #6c757d;
  font-size: 14px;
}

.step.active .step-circle {
  background-color: var(--primary-color);
  color: white;
}

.step.done .step-circle {
  background-color: var(--success-color);
  color: white;
}

.step-label {
  font-size: 12px;
  color: #6c757d;
  text-align: center;
}

.step.active .step-label {
  color: var(--primary-color);
  font-weight: 600;
}

.otp-container {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 25px 0;
}

.otp-input {
  width: 40px;
  height: 65px;
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  border: 2px solid #e1e5eb;
  border-radius: 8px;
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.9);
}

.otp-input:focus {
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 0.2rem rgba(44, 110, 197, 0.25);
  outline: none;
  transform: scale(1.05);
  background: white;
}

.otp-input.filled {
  border-color: var(--success-color);
  background: rgba(40, 167, 69, 0.05);
}

.otp-length-note {
  text-align: center;
  font-size: 13px;
  color: #6c757d;
  margin-top: 8px;
}

.security-notice {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-top: 25px;
  border-left: 4px solid var(--primary-color);
}

.security-notice h6 {
  color: var(--primary-color);
  margin-bottom: 5px;
  font-size: 0.95rem;
}

.security-notice p {
  font-size: 13px;
  margin-bottom: 0;
  color: #6c757d;
}

.resend-container {
  text-align: center;
  margin-top: 20px;
}

.resend-link {
  color: var(--secondary-color);
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}

.resend-link:hover {
  text-decoration: underline;
}

.resend-link.disabled {
  color: #6c757d;
  cursor: not-allowed;
  text-decoration: none;
}

.countdown {
  font-weight: 600;
  color: var(--primary-color);
}

/* Mobile responsive toasts */
@media (max-width: 576px) {
  .toast-container {
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    padding: 0.5rem !important;
  }

  .toast {
    width: 100%;
    margin: 0.5rem auto;
  }
}

/* Custom button color for btnAddEmployment */
#btnAddEmployment {
  background-color: #0a4a7a !important;
}

/* Change all btn-success buttons to #0a4a7a */
.btn-success {
  background-color: #0a4a7a !important;
}

/* Notes Board Styling */
.notes-board .card {
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  border: none;
}

.notes-board .card-header {
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
}

.notes-board ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.notes-board ul li {
  margin-bottom: 0.5rem;
}

/* Notification List Styling */
.notification-list .card {
  border-left: 4px solid var(--primary-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 1rem;
}

.notification-list .badge {
  font-size: 0.75rem;
}

/* Additional styles from home.html */
.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo-container {
  background-color: var(--primary-color);
  color: white;
  padding: 15px;
  border-radius: 0 0 10px 10px;
}

.date-display {
  font-weight: bold;
  color: var(--primary-color);
}

.nav-link {
  color: var(--secondary-color);
  font-weight: 500;
  padding: 10px 15px;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
  background-color: rgba(13, 110, 253, 0.1);
  border-radius: 5px;
}

.user-info {
  color: var(--secondary-color);
}

.alert-notice {
  border-left: 4px solid var(--primary-color);
  background-color: white;
  border-radius: 0 5px 5px 0;
}

.card-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.step-number {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  margin-right: 10px;
}

.footer {
  background-color: #343a40;
  color: white;
  padding: 20px 0;
  margin-top: 30px;
}

/* Responsive Design - Mobile */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  main {
    padding: 1.5rem;
    min-height: auto;
  }

  .main-section-title {
    font-size: 1.25rem;
  }

  .data-table {
    font-size: 0.9rem;
  }

  .card-body {
    padding: 30px 20px;
  }

  .steps-container {
    margin: 20px 0;
  }

  .step:not(:last-child):after {
    right: -40%;
  }

  .otp-input {
    width: 50px;
    height: 60px;
    font-size: 22px;
  }

  .otp-container {
    gap: 8px;
  }

  .data-table thead th,
  .data-table td {
    padding: 0.75rem 0.5rem;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .notes-board .row > .col-md-6 {
    margin-bottom: 1rem;
  }

  .notification-list .card {
    margin-bottom: 0.5rem;
  }

  .navbar-nav {
    text-align: center;
  }
}

@media (max-width: 400px) {
  .otp-input {
    width: 45px;
    height: 55px;
    font-size: 20px;
  }

  .card-body {
    padding: 25px 15px;
  }

  .logo-container {
    flex-direction: column;
    gap: 10px;
  }

  .logo {
    width: 60px;
    height: 60px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-subtitle {
    font-size: 12px;
  }
}

/* Navbar nav link styles */
.navbar-nav .nav-link {
  color: white !important;
  font-weight: 600;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('../img/background.jpeg') no-repeat center center;
  background-size: cover;
  opacity: 0.1;
  z-index: 0;
}

.hero-section .container {
  position: relative;
  z-index: 1;
}

/* Action Cards */
.action-card {
  transition: var(--transition);
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.action-card .card-body i {
  transition: var(--transition);
}

.action-card:hover .card-body i {
  transform: scale(1.1);
}

/* Quick Actions Container Hover */
.row.justify-content-center:hover {
  transform: translateY(-3px);
  background-color: rgba(173, 216, 230, 0.1);
  transition: var(--transition);
}

/* Job Selection Styles */
#jobTable {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  background: white;
}

#jobTable thead th {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  font-weight: 600;
  padding: 1.2rem 1rem;
  border: none;
}

#jobTable tbody tr {
  transition: var(--transition);
  border-bottom: 1px solid #e9ecef;
}

#jobTable tbody tr:hover {
  background-color: rgba(10, 74, 122, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

#jobTable tbody td {
  padding: 1.2rem 1rem;
  vertical-align: middle;
}

#jobTable .btn-info {
  background: linear-gradient(135deg, #17a2b8, #138496);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
}

#jobTable .btn-info:hover {
  background: linear-gradient(135deg, #138496, #117a8b);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.4);
}

#jobTable .btn-success {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(10, 74, 122, 0.3);
}

#jobTable .btn-success:hover {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(10, 74, 122, 0.4);
}

#jobDetailsModal .modal-content {
  border-radius: var(--border-radius);
  border: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

#jobDetailsModal .modal-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-bottom: none;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  padding: 1.5rem;
}

#jobDetailsModal .modal-title {
  font-weight: 700;
  font-size: 1.5rem;
}

#jobDetailsModal .modal-body {
  padding: 2rem;
  background: #f8fafc;
}

#jobDetailsModal .modal-body h5 {
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

#jobDetailsModal .modal-body h6 {
  color: var(--dark-color);
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

#jobDetailsModal .modal-body p {
  line-height: 1.6;
  color: #555;
}

#jobDetailsModal .row {
  margin-bottom: 1rem;
}

#jobDetailsModal .modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1.5rem;
  background: white;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}

#jobDetailsModal .btn-secondary {
  background: #6c757d;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: var(--transition);
}

#jobDetailsModal .btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

#jobDetailsModal .btn-success {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(10, 74, 122, 0.3);
}

#jobDetailsModal .btn-success:hover {
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(10, 74, 122, 0.4);
}

/* Responsive adjustments for job table */
@media (max-width: 768px) {
  #jobTable thead th,
  #jobTable tbody td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }

  #jobTable .btn-info,
  #jobTable .btn-success {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  #jobDetailsModal .modal-body {
    padding: 1.5rem;
  }

  #jobDetailsModal .modal-header,
  #jobDetailsModal .modal-footer {
    padding: 1rem;
  }
}

/* Application Guidelines Alert Styling */
.alert.alert-info {
  left: -0;
  right: -0;
}

.alert.alert-info ol li {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
	
	
	
	
	
	
	
	
	
	
	
	
	
