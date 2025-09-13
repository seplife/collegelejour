// JavaScript pour la page de connexion
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
    initializePasswordToggle();
    initializeForgotPassword();
    initializeUserTabs();
    setupFormValidation();
});

// Comptes de test pour la démonstration
const testAccounts = {
    eleves: {
        'eleve001': { password: 'password123', name: 'Jean KOUAME', class: '3ème A' },
        'eleve002': { password: 'password123', name: 'Marie YAO', class: '4ème B' },
        'eleve003': { password: 'password123', name: 'Paul DIABATE', class: '5ème C' }
    },
    parents: {
        'parent001': { password: 'password123', name: 'Mme KOUAME', children: ['Jean KOUAME'] },
        'parent002': { password: 'password123', name: 'M. YAO', children: ['Marie YAO'] },
        'parent003': { password: 'password123', name: 'Mme DIABATE', children: ['Paul DIABATE'] }
    },
    enseignants: {
        'prof001': { password: 'password123', name: 'Prof. TOURE', subject: 'Mathématiques' },
        'prof002': { password: 'password123', name: 'Prof. BAMBA', subject: 'Français' },
        'prof003': { password: 'password123', name: 'Prof. KONE', subject: 'Sciences' }
    }
};

let currentUserType = 'eleves';

// Initialisation de la page de connexion
function initializeLogin() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Auto-focus sur le premier champ
    const identifierField = document.getElementById('identifier');
    if (identifierField) {
        identifierField.focus();
    }
    
    // Vérifier si l'utilisateur est déjà connecté
    checkExistingSession();
}

// Gestion des onglets utilisateurs
function initializeUserTabs() {
    const tabs = document.querySelectorAll('.user-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Désactiver tous les onglets
            tabs.forEach(t => {
                t.classList.remove('active', 'bg-blue-600', 'text-white');
                t.classList.add('text-gray-700', 'bg-transparent');
            });
            
            // Activer l'onglet cliqué
            this.classList.add('active', 'bg-blue-600', 'text-white');
            this.classList.remove('text-gray-700', 'bg-transparent');
            
            // Mettre à jour le type d'utilisateur
            currentUserType = this.getAttribute('data-tab');
            updateFormForUserType(currentUserType);
        });
    });
    
    // Initialiser avec le premier onglet
    updateFormForUserType(currentUserType);
}

// Mise à jour du formulaire selon le type d'utilisateur
function updateFormForUserType(userType) {
    const identifierLabel = document.getElementById('identifier-label');
    const identifierField = document.getElementById('identifier');
    
    const labels = {
        'eleves': 'Numéro d\'étudiant',
        'parents': 'Identifiant parent',
        'enseignants': 'Code enseignant'
    };
    
    const placeholders = {
        'eleves': 'Ex: eleve001',
        'parents': 'Ex: parent001',
        'enseignants': 'Ex: prof001'
    };
    
    if (identifierLabel) {
        identifierLabel.textContent = labels[userType];
    }
    
    if (identifierField) {
        identifierField.placeholder = placeholders[userType];
        identifierField.value = '';
    }
    
    // Vider le mot de passe
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.value = '';
    }
}

// Gestion de la soumission du formulaire de connexion
function handleLogin(event) {
    event.preventDefault();
    
    const identifier = document.getElementById('identifier').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    if (!identifier || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Afficher le loader
    showLoginLoader();
    
    // Simuler la vérification des identifiants
    setTimeout(() => {
        const isValid = validateCredentials(identifier, password, currentUserType);
        
        if (isValid) {
            const userData = testAccounts[currentUserType][identifier];
            
            // Sauvegarder la session
            saveSession(identifier, currentUserType, userData, rememberMe);
            
            showNotification(`Connexion réussie ! Bienvenue ${userData.name}`, 'success');
            
            // Rediriger vers l'espace approprié
            setTimeout(() => {
                redirectToUserSpace(currentUserType);
            }, 1500);
            
        } else {
            hideLoginLoader();
            showNotification('Identifiant ou mot de passe incorrect', 'error');
            
            // Shake animation sur le formulaire
            const form = document.getElementById('login-form');
            form.classList.add('animate-shake');
            setTimeout(() => {
                form.classList.remove('animate-shake');
            }, 500);
        }
    }, 1500); // Simulation d'un délai de connexion
}

// Validation des identifiants
function validateCredentials(identifier, password, userType) {
    const accounts = testAccounts[userType];
    return accounts[identifier] && accounts[identifier].password === password;
}

// Sauvegarde de la session
function saveSession(identifier, userType, userData, rememberMe) {
    const sessionData = {
        identifier: identifier,
        userType: userType,
        userData: userData,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };
    
    // Utiliser sessionStorage par défaut, localStorage si "se souvenir"
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user_session', JSON.stringify(sessionData));
    
    // Sauvegarder aussi dans localStorage pour les statistiques
    try {
        let loginStats = JSON.parse(localStorage.getItem('login_stats')) || { total: 0, by_type: {} };
        loginStats.total++;
        loginStats.by_type[userType] = (loginStats.by_type[userType] || 0) + 1;
        localStorage.setItem('login_stats', JSON.stringify(loginStats));
    } catch (e) {
        console.warn('Impossible de sauvegarder les statistiques');
    }
}

// Vérifier une session existante
function checkExistingSession() {
    const sessionData = sessionStorage.getItem('user_session') || localStorage.getItem('user_session');
    
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            const loginTime = new Date(session.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            // Session valide si moins de 24h (ou moins de 1h pour sessionStorage)
            const maxHours = session.rememberMe ? 24 : 1;
            
            if (hoursDiff < maxHours) {
                showNotification(`Session active trouvée pour ${session.userData.name}`, 'info');
                
                setTimeout(() => {
                    if (confirm('Voulez-vous continuer avec votre session active ?')) {
                        redirectToUserSpace(session.userType);
                    }
                }, 1000);
            }
        } catch (e) {
            // Session corrompue, la supprimer
            sessionStorage.removeItem('user_session');
            localStorage.removeItem('user_session');
        }
    }
}

// Redirection vers l'espace utilisateur approprié
function redirectToUserSpace(userType) {
    const redirectUrls = {
        'eleves': 'espace-eleves.html',
        'parents': 'espace-parents.html',
        'enseignants': 'espace-enseignants.html'
    };
    
    window.location.href = redirectUrls[userType] || 'index.html';
}

// Affichage/masquage du mot de passe
function initializePasswordToggle() {
    const toggleBtn = document.getElementById('toggle-password');
    const passwordField = document.getElementById('password');
    
    if (toggleBtn && passwordField) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

// Gestion du mot de passe oublié
function initializeForgotPassword() {
    const forgotLink = document.getElementById('forgot-password');
    const modal = document.getElementById('forgot-password-modal');
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-reset');
    const forgotForm = document.getElementById('forgot-form');
    
    if (forgotLink && modal) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.remove('hidden');
            document.getElementById('reset-user-type').value = currentUserType;
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
    }
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', handlePasswordReset);
    }
    
    // Fermer la modal en cliquant à l'extérieur
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    }
}

// Gestion de la réinitialisation de mot de passe
function handlePasswordReset(event) {
    event.preventDefault();
    
    const userType = document.getElementById('reset-user-type').value;
    const identifier = document.getElementById('reset-identifier').value.trim();
    
    if (!identifier) {
        showNotification('Veuillez saisir votre identifiant', 'error');
        return;
    }
    
    // Vérifier si l'identifiant existe
    const accounts = testAccounts[userType];
    if (!accounts[identifier]) {
        showNotification('Identifiant non trouvé', 'error');
        return;
    }
    
    // Simuler l'envoi d'email de récupération
    showNotification('Instructions de récupération envoyées !', 'success');
    
    // Fermer la modal
    document.getElementById('forgot-password-modal').classList.add('hidden');
    
    // Réinitialiser le formulaire
    document.getElementById('forgot-form').reset();
    
    // Afficher un message avec les instructions (simulation)
    setTimeout(() => {
        alert('Email de récupération envoyé !\n\n(Simulation) Nouveau mot de passe temporaire : temp123\nVeuillez le changer lors de votre première connexion.');
    }, 2000);
}

// Validation du formulaire en temps réel
function setupFormValidation() {
    const identifierField = document.getElementById('identifier');
    const passwordField = document.getElementById('password');
    
    if (identifierField) {
        identifierField.addEventListener('input', function() {
            validateField(this, 'identifier');
        });
    }
    
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            validateField(this, 'password');
        });
    }
}

// Validation d'un champ individuel
function validateField(field, type) {
    const value = field.value.trim();
    
    // Supprimer les erreurs précédentes
    clearFieldError(field);
    
    if (type === 'identifier') {
        if (value.length < 3) {
            showFieldError(field, 'Identifiant trop court');
            return false;
        }
        
        // Vérifier le format selon le type d'utilisateur
        const patterns = {
            'eleves': /^eleve\d{3}$/,
            'parents': /^parent\d{3}$/,
            'enseignants': /^prof\d{3}$/
        };
        
        if (value && !patterns[currentUserType].test(value)) {
            showFieldError(field, 'Format d\'identifiant invalide');
            return false;
        }
    }
    
    if (type === 'password') {
        if (value.length < 6) {
            showFieldError(field, 'Mot de passe trop court (min. 6 caractères)');
            return false;
        }
    }
    
    return true;
}

// Affichage des erreurs de champ
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('border-red-500', 'bg-red-50');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-600 text-sm mt-1';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Suppression des erreurs de champ
function clearFieldError(field) {
    field.classList.remove('border-red-500', 'bg-red-50');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Affichage du loader de connexion
function showLoginLoader() {
    const loginBtn = document.getElementById('login-btn');
    const loginText = document.getElementById('login-text');
    
    if (loginBtn && loginText) {
        loginBtn.disabled = true;
        loginBtn.classList.add('opacity-75');
        loginText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Connexion...';
    }
}

// Masquage du loader de connexion
function hideLoginLoader() {
    const loginBtn = document.getElementById('login-btn');
    const loginText = document.getElementById('login-text');
    
    if (loginBtn && loginText) {
        loginBtn.disabled = false;
        loginBtn.classList.remove('opacity-75');
        loginText.innerHTML = 'Se connecter';
    }
}

// Gestion des touches clavier
document.addEventListener('keydown', function(event) {
    // Connexion avec Entrée
    if (event.key === 'Enter' && !event.ctrlKey && !event.altKey) {
        const activeModal = !document.getElementById('forgot-password-modal').classList.contains('hidden');
        
        if (activeModal) {
            // Si la modal est ouverte, soumettre le formulaire de récupération
            event.preventDefault();
            document.getElementById('forgot-form').dispatchEvent(new Event('submit'));
        }
    }
    
    // Fermer la modal avec Échap
    if (event.key === 'Escape') {
        const modal = document.getElementById('forgot-password-modal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    }
});

// Auto-complétion des identifiants (pour la démo)
function setupAutoComplete() {
    const identifierField = document.getElementById('identifier');
    
    if (identifierField) {
        identifierField.addEventListener('dblclick', function() {
            if (confirm('Voulez-vous remplir automatiquement avec un compte de test ?')) {
                const accounts = Object.keys(testAccounts[currentUserType]);
                const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
                
                this.value = randomAccount;
                document.getElementById('password').value = 'password123';
                
                showNotification('Compte de test sélectionné !', 'info');
            }
        });
    }
}

// Statistiques de connexion
function getLoginStats() {
    try {
        const stats = JSON.parse(localStorage.getItem('login_stats')) || { total: 0, by_type: {} };
        return stats;
    } catch (e) {
        return { total: 0, by_type: {} };
    }
}

// Animation shake pour les erreurs
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    .animate-shake {
        animation: shake 0.5s ease-in-out;
    }
`;
document.head.appendChild(shakeStyle);

// Initialisation de l'auto-complétion
document.addEventListener('DOMContentLoaded', function() {
    setupAutoComplete();
    
    // Afficher des conseils selon l'heure
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
        setTimeout(() => {
            showNotification('Il est tard ! N\'oubliez pas de vous reposer pour bien étudier demain.', 'info');
        }, 3000);
    }
});