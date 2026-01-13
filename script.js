// Local Database Mockup
let students = JSON.parse(localStorage.getItem('lps_students')) || [];
let currentUser = null;
let currentAnnouncement = "Welcome to Lyceum Psychological Society!";

// Curriculum Data
const curriculum = {
    "1st Year - 1st Sem": ["Understanding the Self", "Reading in Philippine History", "Purposive Communication", "Mathematics in the Modern World", "Philippine Popular Culture", "PATHFIT1", "NSTP 1"],
    "1st Year - 2nd Sem": ["Introduction to Psychology", "Psychological Statistics", "Art Appreciation", "Ethics", "Gender and Society", "PATHFIT2", "NSTP 2"]
    // Add other semesters here...
};

// UI Functions
function showRegister() { 
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function togglePass(id) {
    const x = document.getElementById(id);
    x.type = x.type === "password" ? "text" : "password";
}

// Auth Logic
function register() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    if(name && email && pass) {
        students.push({ name, email, pass, role: 'student', grades: {} });
        localStorage.setItem('lps_students', JSON.stringify(students));
        alert("Account Created! Please Login.");
        showLogin();
    }
}

function login() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    // Admin Hardcoded Check
    if(email === "admin@lyceum.edu" && pass === "admin123") {
        currentUser = { name: "Administrator", role: "admin" };
        loadPortal();
        return;
    }

    const user = students.find(s => s.email === email && s.pass === pass);
    if(user) {
        currentUser = user;
        loadPortal();
    } else {
        alert("Invalid Credentials");
    }
}

function loadPortal() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-portal').style.display = 'block';
    document.getElementById('welcome-msg').innerText = `Welcome, ${currentUser.name}!`;
    
    if(currentUser.role === 'admin') {
        document.getElementById('admin-nav').style.display = 'inline';
        loadAdminData();
    }
    loadGrades();
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabId + '-tab').style.display = 'block';
}

function loadGrades() {
    let html = "";
    for (let sem in curriculum) {
        html += `<h3>${sem}</h3><ul>`;
        curriculum[sem].forEach(sub => {
            html += `<li>${sub}: <strong>${currentUser.grades?.[sub] || 'N/A'}</strong></li>`;
        });
        html += `</ul>`;
    }
    document.getElementById('grades-list').innerHTML = html;
}

function loadAdminData() {
    const list = document.getElementById('student-list-body');
    list.innerHTML = "";
    students.forEach((s, index) => {
        list.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td><button onclick="editStudentGrades(${index})">Edit Grades</button></td>
            </tr>
        `;
    });
}

function logout() {
    location.reload();
}