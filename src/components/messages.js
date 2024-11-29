// messages.js
const messagesContainer = document.getElementById('messages-container');
const messagesList = document.getElementById('messages-list');
const newMessageBtn = document.getElementById('new-message-btn');
const messageModal = document.getElementById('message-modal');
const recipientInput = document.getElementById('recipient-input');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message-btn');

// Initialize Appwrite Databases
const databases = new Appwrite.Databases(client);

// Message threading system
let activeThread = null;
let recipients = new Set();

// Load user's message threads
async function loadMessageThreads() {
    try {
        const response = await databases.listDocuments(
            '674837fa0025a0df0540', // database ID
            'messages', // collection ID for messages
            [
                Appwrite.Query.equal('participants', currentUser.$id),
                Appwrite.Query.orderDesc('$createdAt'),
                Appwrite.Query.limit(50)
            ]
        );

        const threads = response.documents;
        messagesList.innerHTML = threads.map(thread => `
            <div class="message-thread" data-thread-id="${thread.$id}">
                <div class="thread-avatar">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(thread.participantNames.join(','))}&background=random" alt="Thread Avatar">
                </div>
                <div class="thread-content">
                    <div class="thread-header">
                        <h4>${thread.participantNames.filter(name => name !== currentUser.name).join(', ')}</h4>
                        <span class="thread-time">${new Date(thread.$createdAt).toLocaleDateString()}</span>
                    </div>
                    <p class="thread-preview">${thread.lastMessage || 'No messages yet'}</p>
                </div>
            </div>
        `).join('');

        // Add click listeners to threads
        document.querySelectorAll('.message-thread').forEach(thread => {
            thread.addEventListener('click', () => loadThread(thread.dataset.threadId));
        });
    } catch (error) {
        console.error('Error loading message threads:', error);
        messagesList.innerHTML = '<p class="empty-state">Error loading messages</p>';
    }
}

// Load individual thread messages
async function loadThread(threadId) {
    activeThread = threadId;
    try {
        const response = await databases.listDocuments(
            '674837fa0025a0df0540', // database ID
            'thread_messages', // collection ID for individual messages
            [
                Appwrite.Query.equal('threadId', threadId),
                Appwrite.Query.orderAsc('$createdAt'),
                Appwrite.Query.limit(100)
            ]
        );

        const messages = response.documents;
        const messagesHtml = messages.map(msg => `
            <div class="message ${msg.senderId === currentUser.$id ? 'sent' : 'received'}">
                <div class="message-content">
                    <p>${msg.content}</p>
                    <span class="message-time">${new Date(msg.$createdAt).toLocaleTimeString()}</span>
                </div>
            </div>
        `).join('');

        document.getElementById('thread-messages').innerHTML = messagesHtml;
        document.getElementById('thread-messages').scrollTop = document.getElementById('thread-messages').scrollHeight;
    } catch (error) {
        console.error('Error loading thread messages:', error);
    }
}

// Send new message
async function sendMessage(content, threadId = null) {
    try {
        if (!threadId) {
            // Create new thread
            const thread = await databases.createDocument(
                '674837fa0025a0df0540', // database ID
                'messages', // collection ID for messages
                'unique()',
                {
                    participants: [...recipients, currentUser.$id],
                    participantNames: [...recipients.values(), currentUser.name],
                    lastMessage: content,
                    lastSender: currentUser.$id
                }
            );
            threadId = thread.$id;
        }

        // Create message in thread
        await databases.createDocument(
            '674837fa0025a0df0540', // database ID
            'thread_messages', // collection ID for individual messages
            'unique()',
            {
                threadId: threadId,
                senderId: currentUser.$id,
                senderName: currentUser.name,
                content: content
            }
        );

        // Update thread's last message
        await databases.updateDocument(
            '674837fa0025a0df0540',
            'messages',
            threadId,
            {
                lastMessage: content,
                lastSender: currentUser.$id
            }
        );

        // Reload messages
        if (threadId === activeThread) {
            loadThread(threadId);
        }
        loadMessageThreads();
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
    }
}

// Event Listeners
newMessageBtn.addEventListener('click', () => {
    if (!currentUser) {
        showModal(authModal);
        return;
    }
    showModal(messageModal);
});

sendMessageBtn.addEventListener('click', async () => {
    const content = messageInput.value.trim();
    if (!content) return;

    if (activeThread) {
        await sendMessage(content, activeThread);
    } else {
        const recipient = recipientInput.value.trim();
        if (!recipient) return;
        
        recipients.add(recipient);
        await sendMessage(content);
    }

    messageInput.value = '';
    recipientInput.value = '';
    hideModal(messageModal);
});

// Initialize messaging
document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        loadMessageThreads();
    }
});