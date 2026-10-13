// ============ STORAGE HELPERS ============
const USERS_KEY = "telling_users";
const CURRENT_KEY = "telling_current_user";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
}

function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "GH";
  for (let i = 0; i < 9; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function calculateAge(dobString) {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// ============ SHOW / HIDE PASSWORD ============
document.querySelectorAll(".toggle-pass").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    input.type = input.type === "password" ? "text" : "password";
  });
});

// ============ SIGNUP ============
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  const usernameInput = document.getElementById("username");
  const counter = document.getElementById("usernameCounter");

  // live character counter: 0/20
  usernameInput.addEventListener("input", () => {
    counter.textContent = `${usernameInput.value.length}/20`;
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault(); // stop the page from reloading
    clearErrors();

    const dob = document.getElementById("dob").value;
    const username = usernameInput.value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const allChecked =
      document.getElementById("ageCheck").checked &&
      document.getElementById("termsCheck").checked &&
      document.getElementById("privacyCheck").checked;

    let valid = true;

    if (!dob) {
      setError("dobError", "Please select your date of birth.");
      valid = false;
    } else if (calculateAge(dob) < 18) {
      setError("dobError", "You must be at least 18 years old.");
      valid = false;
    }

    if (username.length < 3) {
      setError("usernameError", "Username must be at least 3 characters.");
      valid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("usernameError", "Use only letters, numbers and underscore.");
      valid = false;
    } else if (getUsers().some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      setError("usernameError", "This username is already taken.");
      valid = false;
    }

    if (password.length < 6) {
      setError("passwordError", "Password must be at least 6 characters.");
      valid = false;
    }

    if (confirmPassword !== password) {
      setError("confirmError", "Passwords do not match.");
      valid = false;
    }

    if (!allChecked) {
      setError("checkError", "Please tick all three checkboxes to continue.");
      valid = false;
    }

    if (!valid) return;

    // Save the new user (fake backend)
    const newUser = {
      username: username,
      password: password, // demo only! Spring Boot will hash this later
      dob: dob,
      joined: new Date().toISOString(),
      referralCode: generateReferralCode(),
    };

    const users = getUsers();
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(CURRENT_KEY, username);

    window.location.href = "home.html";
  });
}

// ============ LOGIN ============
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    let valid = true;

    if (!username) {
      setError("usernameError", "Please enter your username.");
      valid = false;
    }
    if (!password) {
      setError("passwordError", "Please enter your password.");
      valid = false;
    }
    if (!valid) return;

    const user = getUsers().find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!user) {
      setError("formError", "Invalid username or password.");
      return;
    }

    localStorage.setItem(CURRENT_KEY, user.username);
    window.location.href = "home.html";
  });
}