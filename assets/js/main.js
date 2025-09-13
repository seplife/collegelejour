// Global configuration
const CONFIG = {
    /* @tweakable chatbot response delay in milliseconds */
    chatbotDelay: 1000,
    /* @tweakable scroll animation duration */
    scrollDuration: 800,
    /* @tweakable mobile menu animation speed */
    mobileMenuSpeed: 300
};

// DOM elements
const elements = {
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    mobileMenu: document.getElementById('mobile-menu'),
    chatbotWidget: document.getElementById('chatbot-widget'),
    chatbotWindow: document.getElementById('chatbot-window'),
    closeChatbot: document.getElementById('close-chatbot'),
    chatInput: document.getElementById('chat-input'),
    sendButton: document.getElementById('send-message'),
    chatMessages: document.getElementById('chat-messages')
};

// FAQ data for chatbot
const faqData = {
    'inscription': 'Les inscriptions pour 2025-2026 sont ouvertes. Vous pouvez vous inscrire en ligne ou venir directement au secrétariat.',
    'admission': 'Pour une admission, il faut remplir le dossier d\'inscription avec les pièces justificatives et passer un entretien.',
    'horaires': 'Les cours ont lieu de 7h30 à 17h30 du lundi au vendredi. Le samedi de 8h à 12h pour les activités extra-scolaires.',
    'frais': 'Les frais de scolarité varient selon le niveau. Contactez-nous pour plus d\'informations sur les tarifs.',
    'paiement': 'Nous acceptons les paiements par Mobile Money, carte bancaire et espèces au secrétariat.',
    'contact': 'Vous pouvez nous joindre au +225 XX XX XX XX ou par email à contact@collegejourddivo.ci',
    'programme': 'Notre programme suit le curriculum ivoirien avec des activités d\'enrichissement en langues et sciences.',
    'transport': 'Nous proposons un service de transport scolaire pour les élèves. Renseignez-vous au secrétariat.'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeChatbot();
    initializeScrollEffects();
    initializeAnimations();
});

// Mobile menu functionality
function initializeMobileMenu() {
    if (elements.mobileMenuBtn && elements.mobileMenu) {
        elements.mobileMenuBtn.addEventListener('click', function() {
            elements.mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        const mobileMenuLinks = elements.mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                elements.mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Chatbot functionality
function initializeChatbot() {
    if (elements.chatbotWidget && elements.chatbotWindow) {
        // Toggle chatbot window
        elements.chatbotWidget.addEventListener('click', function() {
            elements.chatbotWindow.classList.toggle('hidden');
            if (!elements.chatbotWindow.classList.contains('hidden')) {
                elements.chatInput.focus();
            }
        });

        // Close chatbot
        if (elements.closeChatbot) {
            elements.closeChatbot.addEventListener('click', function() {
                elements.chatbotWindow.classList.add('hidden');
            });
        }

        // Send message on button click
        if (elements.sendButton) {
            elements.sendButton.addEventListener('click', sendMessage);
        }

        // Send message on Enter key
        if (elements.chatInput) {
            elements.chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
}

// Send message in chatbot
function sendMessage() {
    const message = elements.chatInput.value.trim();
    if (message === '') return;

    // Add user message
    addChatMessage(message, 'user');
    elements.chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Generate bot response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateBotResponse(message);
        addChatMessage(response, 'bot');
    }, CONFIG.chatbotDelay);
}

// Add message to chat
function addChatMessage(message, sender) {
    if (!elements.chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.innerHTML = '<span class="loading-dots">L\'assistant écrit</span>';
    typingDiv.id = 'typing-indicator';
    
    elements.chatMessages.appendChild(typingDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Generate bot response
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for keywords in FAQ
    for (const [keyword, response] of Object.entries(faqData)) {
        if (message.includes(keyword)) {
            return response;
        }
    }
    
    // Default responses
    if (message.includes('bonjour') || message.includes('salut')) {
        return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
    }
    
    if (message.includes('merci')) {
        return 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.';
    }
    
    if (message.includes('au revoir') || message.includes('bye')) {
        return 'Au revoir ! Bonne journée et à bientôt au Collège le Jour de Divo !';
    }
    
    // Default response
    return 'Je ne suis pas sûr de comprendre votre question. Pouvez-vous la reformuler ? Vous pouvez me demander des informations sur les inscriptions, les horaires, les frais, les paiements ou comment nous contacter.';
}

// Smooth scrolling for navigation links
function initializeScrollEffects() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card-hover, article, .bg-blue-50, .bg-green-50, .bg-purple-50');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle form submissions (placeholder for future implementation)
function handleFormSubmission(formData) {
    // This will be implemented with PHP backend
    console.log('Form submitted:', formData);
    showNotification('Formulaire envoyé avec succès !', 'success');
}

// Handle login/logout functionality (placeholder)
function handleAuth(action) {
    if (action === 'login') {
        // Redirect to login page
        window.location.href = 'login.php';
    } else if (action === 'logout') {
        // Handle logout
        showNotification('Déconnexion réussie', 'success');
    }
}

