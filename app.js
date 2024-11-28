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