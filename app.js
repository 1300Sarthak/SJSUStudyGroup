// Initialize Appwrite
const client = new Appwrite.Client();
const account = new Appwrite.Account(client);

// Your Appwrite configuration
client
    .setEndpoint('YOUR_APPWRITE_ENDPOINT') // Your Appwrite Endpoint
    .setProject('YOUR_PROJECT_ID');        // Your project ID

// Elements
const loginSection = document.getElementById('login-section');
const profileContent = document.getElementById('profile-content');
const googleLoginBtn = document.getElementById('google-login');
const logoutBtn = document.getElementById('logout-btn');
const loadingSpinner = document.getElementById('loading-spinner');

// Show loading spinner
function showLoading() {
    loadingSpinner.style.display = 'flex';
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Initialize the page
async function init() {
    showLoading();
    try {
        // Check if user is already logged in
        const user = await account.get();
        await updateProfileUI(user);
        loginSection.style.display = 'none';
        profileContent.style.display = 'block';
    } catch (error) {
        loginSection.style.display = 'block';
        profileContent.style.display = 'none';
    } finally {
        hideLoading();
    }
}

// Update UI with user profile information
async function updateProfileUI(user) {
    // Update profile information
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;

    // Set profile image
    if (user.prefs && user.prefs.profileImage) {
        document.getElementById('profile-image').src = user.prefs.profileImage;
    } else {
        // Set default avatar or generate one from initials
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        document.getElementById('profile-image').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
    }

    // Fetch and display user's study groups
    await loadStudyGroups();

    // Fetch and display user's courses
    await loadCourses();
}

// Handle Google Login
googleLoginBtn.addEventListener('click', async () => {
    try {
        showLoading();
        // Create OAuth2 session with Google
        account.createOAuth2Session(
            'google',
            'YOUR_SUCCESS_URL',
            'YOUR_FAILURE_URL',
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
        loginSection.style.display = 'block';
        profileContent.style.display = 'none';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
    } finally {
        hideLoading();
    }
});

// Load user's study groups
async function loadStudyGroups() {
    const studyGroupsList = document.getElementById('study-groups-list');
    try {
        // Replace with your actual database query
        const databases = new Appwrite.Databases(client);
        const response = await databases.listDocuments(
            'YOUR_DATABASE_ID',
            'YOUR_STUDY_GROUPS_COLLECTION_ID',
            [
                Appwrite.Query.equal('userId', account.current.id)
            ]
        );

        if (response.documents.length > 0) {
            studyGroupsList.innerHTML = response.documents.map(group => `
                <div class="study-group-item">
                    <h4>${group.name}</h4>
                    <p>${group.course}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading study groups:', error);
        studyGroupsList.innerHTML = '<p class="empty-state">Error loading study groups</p>';
    }
}

// Load user's courses
async function loadCourses() {
    const coursesList = document.getElementById('courses-list');
    try {
        // Replace with your actual database query
        const databases = new Appwrite.Databases(client);
        const response = await databases.listDocuments(
            'YOUR_DATABASE_ID',
            'YOUR_COURSES_COLLECTION_ID',
            [
                Appwrite.Query.equal('userId', account.current.id)
            ]
        );

        if (response.documents.length > 0) {
            coursesList.innerHTML = response.documents.map(course => `
                <div class="course-item">
                    <h4>${course.name}</h4>
                    <p>${course.description}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        coursesList.innerHTML = '<p class="empty-state">Error loading courses</p>';
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);