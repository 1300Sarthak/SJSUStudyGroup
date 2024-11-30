# .gitignore

```
node_modules

```

# app.js

```js
// Initialize Appwrite
const client = new Appwrite.Client();
const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);

// Your Appwrite configuration
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('67482b9b0034a4ee8ef0');        // Your project ID

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authModal = document.getElementById('auth-modal');
const profileModal = document.getElementById('profile-modal');
const googleLoginBtn = document.getElementById('google-login');
const loadingSpinner = document.getElementById('loading-spinner');
const profileSection = document.getElementById('profile-section');

// State management
let currentUser = null;

// Show/Hide Loading Spinner
const showLoading = () => loadingSpinner.style.display = 'flex';
const hideLoading = () => loadingSpinner.style.display = 'none';

// Modal Management
function showModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside
window.onclick = (event) => {
    if (event.target === authModal) {
        hideModal(authModal);
    }
    if (event.target === profileModal) {
        hideModal(profileModal);
    }
};

// Update UI based on auth state
function updateUIForAuth(user) {
    if (user) {
        loginBtn.textContent = user.name;
        loginBtn.onclick = () => showModal(profileModal);
    } else {
        loginBtn.textContent = 'Sign In';
        loginBtn.onclick = () => showModal(authModal);
    }
}

// Initialize the page
async function init() {
    showLoading();
    try {
        // Check if user is already logged in
        currentUser = await account.get();
        await updateProfileUI(currentUser);
        updateUIForAuth(currentUser);
    } catch (error) {
        console.log('No active session');
        updateUIForAuth(null);
    } finally {
        hideLoading();
    }
}

// Update Profile UI
async function updateProfileUI(user) {
    if (!user) return;

    // Update profile information
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;

    // Set profile image
    if (user.prefs && user.prefs.profileImage) {
        document.getElementById('profile-image').src = user.prefs.profileImage;
    } else {
        // Generate avatar from initials
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        document.getElementById('profile-image').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
    }

    // Load study groups and courses
    await Promise.all([
        loadStudyGroups(user.$id),
        loadCourses(user.$id)
    ]);
}

// Load Study Groups
async function loadStudyGroups(userId) {
    const studyGroupsList = document.getElementById('study-groups-list');
    try {
        const response = await databases.listDocuments(
            '674837fa0025a0df0540', //your database ID
            '6748385600386b5ae788', //your study group ID
            [
                Appwrite.Query.equal('userId', userId)
            ]
        );

        if (response.documents.length > 0) {
            studyGroupsList.innerHTML = response.documents.map(group => `
                <div class="study-group-item">
                    <h4>${group.name}</h4>
                    <p>${group.course}</p>
                    <span class="member-count">${group.memberCount} members</span>
                </div>
            `).join('');
        } else {
            studyGroupsList.innerHTML = '<p class="empty-state">No study groups joined yet</p>';
        }
    } catch (error) {
        console.error('Error loading study groups:', error);
        studyGroupsList.innerHTML = '<p class="empty-state">Error loading study groups</p>';
    }
}

// Load Courses
async function loadCourses(userId) {
    const coursesList = document.getElementById('courses-list');
    try {
        const response = await databases.listDocuments(
            '674837fa0025a0df0540', //#endregion
            '6748384500170afde535', //your course ID
            [
                Appwrite.Query.equal('userId', userId)
            ]
        );

        if (response.documents.length > 0) {
            coursesList.innerHTML = response.documents.map(course => `
                <div class="course-item">
                    <h4>${course.name}</h4>
                    <p>${course.description}</p>
                    <span class="course-status">${course.status}</span>
                </div>
            `).join('');
        } else {
            coursesList.innerHTML = '<p class="empty-state">No courses enrolled yet</p>';
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        coursesList.innerHTML = '<p class="empty-state">Error loading courses</p>';
    }
}

// Handle Google Login
googleLoginBtn.addEventListener('click', async () => {
    try {
        showLoading();
        hideModal(authModal);
        
        // Create OAuth2 session with Google
        await account.createOAuth2Session(
            'google',
            'http://localhost:3000/auth-success',  // Replace with your success URL
            'http://localhost:3000/auth-failure',  // Replace with your failure URL
            ['email', 'profile']
        );
    } catch (error) {
        console.error('Login error:', error);
        alert('Failed to login. Please try again.');
        hideLoading();
    }
});

// Handle Logout
logoutBtn.addEventListener('click', async () => {
    try {
        showLoading();
        await account.deleteSession('current');
        currentUser = null;
        updateUIForAuth(null);
        hideModal(profileModal);
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
    } finally {
        hideLoading();
    }
});

// Event Listeners for Area Cards
document.querySelectorAll('.area-card').forEach(card => {
    card.querySelector('.view-courses').addEventListener('click', async (e) => {
        e.preventDefault();
        if (!currentUser) {
            showModal(authModal);
            return;
        }
        // Handle viewing courses for the specific area
        const areaName = card.querySelector('.area-name').textContent;
        // Add your logic here to show courses for the selected area
    });
});

// Initialize the application
document.addEventListener('DOMContentLoaded', init);
```

# index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SJSU Study Group Finder</title>
    <link rel="stylesheet" href="styles.css">
    <!-- Appwrite SDK -->
    <script src="https://cdn.jsdelivr.net/npm/appwrite@13.0.0"></script>
</head>
<body>
    <nav class="navbar">
        <a href="#" class="logo">SJSU Study Group Finder</a>
        <div class="search-container">
            <input type="text" class="search-bar" placeholder="Search courses...">
        </div>
        <div id="profile-section">
            <button id="login-btn" class="profile-btn">Sign In</button>
        </div>
    </nav>

    <!-- Main Content Container -->
    <div id="main-content" class="container">
        <aside class="sidebar">
            <a href="#" class="sidebar-item">
                <span>📚</span>
                <span>Courses</span>
            </a>
            <a href="#" class="sidebar-item">
                <span>👥</span>
                <span>Study Groups</span>
            </a>
            <a href="#" class="sidebar-item">
                <span>📅</span>
                <span>Schedule</span>
            </a>
            <a href="#" class="sidebar-item">
                <span>💬</span>
                <span>Messages</span>
            </a>
        </aside>

        <main class="main-content">
            <div class="area-card">
                <div class="area-title">
                    <div class="area-icon blue-bg">📘</div>
                    <div class="area-info">
                        <div class="area-name">Area A</div>
                        <div class="area-description">English Language Communication and Critical Thinking</div>
                    </div>
                </div>
                <span class="units">9 units</span>
                <a href="#" class="view-courses">View Courses ›</a>
            </div>

            <div class="area-card">
                <div class="area-title">
                    <div class="area-icon green-bg">📗</div>
                    <div class="area-info">
                        <div class="area-name">Area B</div>
                        <div class="area-description">Scientific Inquiry and Quantitative Reasoning</div>
                    </div>
                </div>
                <span class="units">9 units</span>
                <a href="#" class="view-courses">View Courses ›</a>
            </div>

            <div class="area-card">
                <div class="area-title">
                    <div class="area-icon purple-bg">📓</div>
                    <div class="area-info">
                        <div class="area-name">Area C</div>
                        <div class="area-description">Arts and Humanities</div>
                    </div>
                </div>
                <span class="units">9 units</span>
                <a href="#" class="view-courses">View Courses ›</a>
            </div>

            <div class="area-card">
                <div class="area-title">
                    <div class="area-icon orange-bg">📙</div>
                    <div class="area-info">
                        <div class="area-name">Area D</div>
                        <div class="area-description">Social Sciences</div>
                    </div>
                </div>
                <span class="units">6 units</span>
                <a href="#" class="view-courses">View Courses ›</a>
            </div>
        </main>
    </div>

    <!-- Auth Modal -->
    <div id="auth-modal" class="modal">
        <div class="modal-content">
            <div class="auth-container">
                <h2>Sign In</h2>
                <p class="auth-description">Please sign in with your SJSU email</p>
                <button id="google-login" class="auth-button google">
                    <img src="https://www.google.com/favicon.ico" alt="Google Icon">
                    Continue with Google
                </button>
                <p class="auth-note">Only @sjsu.edu emails are allowed</p>
            </div>
        </div>
    </div>

    <!-- Profile Modal -->
    <div id="profile-modal" class="modal">
        <div class="modal-content">
            <div class="profile-container">
                <div class="profile-header">
                    <img id="profile-image" alt="Profile Picture" class="profile-pic">
                    <div class="profile-info">
                        <h2 id="profile-name"></h2>
                        <p id="profile-email"></p>
                    </div>
                </div>
                
                <div class="profile-sections">
                    <div class="profile-section">
                        <h3>My Study Groups</h3>
                        <div id="study-groups-list" class="study-groups-list">
                            <p class="empty-state">No study groups joined yet</p>
                        </div>
                    </div>

                    <div class="profile-section">
                        <h3>My Courses</h3>
                        <div id="courses-list" class="courses-list">
                            <p class="empty-state">No courses enrolled yet</p>
                        </div>
                    </div>
                </div>

                <button id="logout-btn" class="logout-button">Sign Out</button>
            </div>
        </div>
    </div>

    <!-- Loading Spinner -->
    <div id="loading-spinner" class="loading-spinner" style="display: none;">
        <div class="spinner"></div>
    </div>

    <script src="app.js"></script>
</body>
</html>
```

# src/test.html

```html
<p>Hello</p>
```

# styles.css

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

body {
    background-color: #f5f5f5;
}

/* Navbar Styles */
.navbar {
    background-color: #4169E1;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
}

.search-container {
    flex-grow: 0.3;
    display: flex;
    align-items: center;
}

.search-bar {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
}

.profile-btn {
    background-color: #6495ED;
    color: white;
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 1rem;
}

/* Main Container Styles */
.container {
    display: flex;
    margin: 2rem;
    gap: 2rem;
}

/* Sidebar Styles */
.sidebar {
    width: 250px;
    background-color: white;
    border-radius: 10px;
    padding: 1rem;
}

.sidebar-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    color: #333;
    text-decoration: none;
    border-radius: 8px;
}

.sidebar-item:hover {
    background-color: #f0f0f0;
}

/* Main Content Area Styles */
.main-content {
    flex-grow: 1;
}

.area-card {
    background-color: white;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.area-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
}

.blue-bg { background-color: #E8EEFF; }
.green-bg { background-color: #E8FFE8; }
.purple-bg { background-color: #F8E8FF; }
.orange-bg { background-color: #FFE8E8; }

.area-info {
    flex-grow: 1;
}

.area-title {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.area-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.area-description {
    color: #666;
}

.units {
    background-color: #f5f5f5;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    color: #333;
}

.view-courses {
    color: #4169E1;
    text-decoration: none;
    margin-left: 1rem;
}

.view-courses:hover {
    text-decoration: underline;
}

/* Modal Styles */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal-content {
    position: relative;
    background-color: white;
    margin: 5% auto;
    padding: 2rem;
    width: 90%;
    max-width: 500px;
    border-radius: 10px;
}

/* Auth Container Styles */
.auth-container {
    text-align: center;
}

.auth-container h2 {
    margin-bottom: 1rem;
    color: #333;
}

.auth-description {
    color: #666;
    margin-bottom: 2rem;
}

.auth-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 50px;
    background-color: white;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: 1rem;
}

.auth-button img {
    width: 20px;
    height: 20px;
}

.auth-button:hover {
    background-color: #f8f9fa;
}

.auth-note {
    color: #666;
    font-size: 0.9rem;
}

/* Profile Styles */
.profile-container {
    background-color: white;
    border-radius: 10px;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #eee;
}

.profile-pic {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}

.profile-sections {
    display: grid;
    gap: 2rem;
    margin-bottom: 2rem;
}

.profile-section {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
}

.profile-section h3 {
    margin-bottom: 1rem;
    color: #333;
}

.empty-state {
    color: #666;
    text-align: center;
    padding: 1rem;
}

.logout-button {
    background-color: #dc3545;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
    display: block;
}

.logout-button:hover {
    background-color: #c82333;
}

/* Loading Spinner */
.loading-spinner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1100;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #4169E1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
        margin: 1rem;
    }

    .sidebar {
        width: 100%;
    }

    .search-container {
        display: none;
    }

    .area-card {
        flex-direction: column;
        text-align: center;
    }

    .area-title {
        flex-direction: column;
        margin-bottom: 1rem;
    }

    .units {
        margin-bottom: 1rem;
    }
}
```

