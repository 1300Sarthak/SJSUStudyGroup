import { auth, db, googleProvider } from './firebase-config.js';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

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

// Update UI based on auth state
function updateUIForAuth(user) {
    if (user) {
        loginBtn.textContent = user.displayName;
        loginBtn.onclick = () => showModal(profileModal);
    } else {
        loginBtn.textContent = 'Sign In';
        loginBtn.onclick = () => showModal(authModal);
    }
}

// Initialize the page
async function init() {
    showLoading();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            await updateProfileUI(user);
            updateUIForAuth(user);
        } else {
            currentUser = null;
            updateUIForAuth(null);
        }
        hideLoading();
    });
}

// Update Profile UI
async function updateProfileUI(user) {
    if (!user) return;

    // Update profile information
    document.getElementById('profile-name').textContent = user.displayName;
    document.getElementById('profile-email').textContent = user.email;

    // Set profile image
    document.getElementById('profile-image').src = user.photoURL || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random`;

    // Load study groups and courses
    await Promise.all([
        loadStudyGroups(user.uid),
        loadCourses(user.uid)
    ]);
}

// Load Study Groups
async function loadStudyGroups(userId) {
    const studyGroupsList = document.getElementById('study-groups-list');
    try {
        const groupsRef = collection(db, 'studyGroups');
        const q = query(groupsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            studyGroupsList.innerHTML = querySnapshot.docs.map(doc => {
                const group = doc.data();
                return `
                    <div class="study-group-item">
                        <h4>${group.name}</h4>
                        <p>${group.course}</p>
                        <span class="member-count">${group.memberCount} members</span>
                    </div>
                `;
            }).join('');
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
        const coursesRef = collection(db, 'courses');
        const q = query(coursesRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            coursesList.innerHTML = querySnapshot.docs.map(doc => {
                const course = doc.data();
                return `
                    <div class="course-item">
                        <h4>${course.name}</h4>
                        <p>${course.description}</p>
                        <span class="course-status">${course.status}</span>
                    </div>
                `;
            }).join('');
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
        await signInWithPopup(auth, googleProvider);
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
        await signOut(auth);
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
        const areaName = card.querySelector('.area-name').textContent;
        // Add your logic here to show courses for the selected area
    });
});

// Initialize the application
document.addEventListener('DOMContentLoaded', init);