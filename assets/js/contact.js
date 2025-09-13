// JavaScript spécifique pour la page de contact
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeMap();
    initializeFAQ();
    initializeNewsletterForms();
});

// Initialisation du formulaire de contact
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
        setupContactFormValidation();
        setupDynamicFields();
    }
}

// Gestion de la soumission du formulaire de contact
function handleContactSubmission(event) {
    event.preventDefault();
    
    if (!validateContactForm()) {
        return;
    }
    
    // Afficher le loader
    showLoader('Envoi de votre message...');
    
    // Collecter les données du formulaire
    const formData = new FormData(event.target);
    const contactData = {
        nom: formData.get('nom'),
        prenom: formData.get('prenom'),
        email: formData.get('email'),
        telephone: formData.get('telephone'),
        qualite: formData.get('qualite'),
        sujet: formData.get('sujet'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') ? true : false
    };
    
    // Simuler l'envoi du message
    setTimeout(() => {
        hideLoader();
        showNotification('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
        
        // Réinitialiser le formulaire
        event.target.reset();
        
        // Si inscription à la newsletter, l'ajouter
        if (contactData.newsletter) {
            addToNewsletter(contactData.email);
        }
        
        // Envoyer email de confirmation (simulation)
        sendConfirmationEmail(contactData);
        
    }, 2000);
}

// Validation du formulaire de contact
function validateContactForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Vérifier les champs obligatoires
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Ce champ est obligatoire');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validation spécifique de l'email
    const emailField = form.querySelector('input[name="email"]');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Format d\'email invalide');
        isValid = false;
    }
    
    // Validation du téléphone (si renseigné)
    const phoneField = form.querySelector('input[name="telephone"]');
    if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
        showFieldError(phoneField, 'Format de téléphone invalide');
        isValid = false;
    }
    
    // Validation de la longueur du message
    const messageField = form.querySelector('textarea[name="message"]');
    if (messageField && messageField.value && messageField.value.length < 10) {
        showFieldError(messageField, 'Le message doit contenir au moins 10 caractères');
        isValid = false;
    }
    
    return isValid;
}

// Configuration de la validation en temps réel
function setupContactFormValidation() {
    const form = document.getElementById('contact-form');
    
    // Validation email
    const emailField = form.querySelector('input[name="email"]');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showFieldError(this, 'Format d\'email invalide');
            } else {
                clearFieldError(this);
            }
        });
    }
    
    // Validation téléphone
    const phoneField = form.querySelector('input[name="telephone"]');
    if (phoneField) {
        phoneField.addEventListener('input', formatPhoneNumber);
        phoneField.addEventListener('blur', function() {
            if (this.value && !isValidPhone(this.value)) {
                showFieldError(this, 'Format de téléphone invalide');
            } else {
                clearFieldError(this);
            }
        });
    }
    
    // Compteur de caractères pour le message
    const messageField = form.querySelector('textarea[name="message"]');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'text-sm text-gray-500 mt-1';
        counter.id = 'message-counter';
        messageField.parentNode.appendChild(counter);
        
        messageField.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length} caractères`;
            
            if (length < 10) {
                counter.className = 'text-sm text-red-500 mt-1';
            } else if (length > 1000) {
                counter.className = 'text-sm text-yellow-600 mt-1';
                counter.textContent += ' (message très long)';
            } else {
                counter.className = 'text-sm text-green-600 mt-1';
            }
        });
    }
}

// Configuration des champs dynamiques
function setupDynamicFields() {
    const qualiteSelect = document.querySelector('select[name="qualite"]');
    const sujetSelect = document.querySelector('select[name="sujet"]');
    
    if (qualiteSelect) {
        qualiteSelect.addEventListener('change', function() {
            updateSujetOptions(this.value);
            showQualiteInfo(this.value);
        });
    }
}

// Mise à jour des options de sujet selon la qualité
function updateSujetOptions(qualite) {
    const sujetSelect = document.querySelector('select[name="sujet"]');
    if (!sujetSelect) return;
    
    // Sauvegarder la valeur actuelle
    const currentValue = sujetSelect.value;
    
    // Réinitialiser les options
    sujetSelect.innerHTML = '<option value="">Choisissez un sujet</option>';
    
    const sujetsParQualite = {
        'parent': ['scolarite', 'transport', 'restauration', 'rendez_vous', 'reclamation', 'autre'],
        'futur_parent': ['admission', 'information', 'rendez_vous', 'autre'],
        'eleve': ['scolarite', 'activites', 'transport', 'autre'],
        'ancien_eleve': ['information', 'partenariat', 'autre'],
        'enseignant': ['information', 'partenariat', 'autre'],
        'partenaire': ['partenariat', 'information', 'autre'],
        'autre': ['admission', 'information', 'rendez_vous', 'scolarite', 'transport', 'restauration', 'activites', 'reclamation', 'partenariat', 'autre']
    };
    
    const sujetLabels = {
        'admission': 'Demande d\'admission',
        'information': 'Demande d\'information',
        'rendez_vous': 'Prise de rendez-vous',
        'scolarite': 'Questions scolarité',
        'transport': 'Transport scolaire',
        'restauration': 'Restauration',
        'activites': 'Activités extra-scolaires',
        'reclamation': 'Réclamation',
        'partenariat': 'Proposition de partenariat',
        'autre': 'Autre'
    };
    
    const sujets = sujetsParQualite[qualite] || sujetsParQualite['autre'];
    
    sujets.forEach(sujet => {
        const option = document.createElement('option');
        option.value = sujet;
        option.textContent = sujetLabels[sujet];
        sujetSelect.appendChild(option);
    });
    
    // Restaurer la valeur si elle est toujours disponible
    if (sujets.includes(currentValue)) {
        sujetSelect.value = currentValue;
    }
}

// Afficher des informations selon la qualité sélectionnée
function showQualiteInfo(qualite) {
    const infoMessages = {
        'parent': 'En tant que parent d\'élève, vous pouvez accéder à l\'espace parents pour suivre la scolarité de votre enfant.',
        'futur_parent': 'Nous serons ravis de vous accompagner dans votre démarche d\'inscription.',
        'eleve': 'Cher élève, n\'hésitez pas à nous faire part de tes questions ou suggestions.',
        'ancien_eleve': 'Nous sommes toujours heureux d\'avoir des nouvelles de nos anciens élèves !',
        'enseignant': 'Merci pour votre intérêt pour notre établissement.',
        'partenaire': 'Nous étudions avec attention toutes les propositions de partenariat.',
        'autre': 'N\'hésitez pas à préciser votre situation dans votre message.'
    };
    
    if (infoMessages[qualite]) {
        showNotification(infoMessages[qualite], 'info');
    }
}

// Initialisation de la carte
function initializeMap() {
    const map = document.getElementById('map');
    if (map) {
        map.addEventListener('click', openGoogleMaps);
        map.style.cursor = 'pointer';
        
        // Ajouter une animation au survol
        map.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        map.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// Ouvrir Google Maps
function openGoogleMaps() {
    const address = encodeURIComponent('Collège le Jour de Divo, Quartier Résidentiel, Divo, Côte d\'Ivoire');
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(url, '_blank');
}

// Initialisation des formulaires newsletter/SMS
function initializeNewsletterForms() {
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubscription);
    }
    
    // Alertes SMS
    const smsForm = document.querySelector('.sms-form');
    if (smsForm) {
        smsForm.addEventListener('submit', handleSmsSubscription);
    }
    
    // Boutons d'inscription dans les sections
    const newsletterBtns = document.querySelectorAll('button:has(.fa-arrow-right)');
    newsletterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'email') {
                handleNewsletterSubscription(input.value);
            } else if (input.type === 'tel') {
                handleSmsSubscription(input.value);
            }
        });
    });
}

// Gestion de l'inscription newsletter
function handleNewsletterSubscription(email) {
    if (typeof email === 'object') {
        // Si c'est un événement form
        email.preventDefault();
        email = email.target.querySelector('input[type="email"]').value;
    } else if (!email) {
        // Si pas d'email fourni, le récupérer depuis l'input
        const emailInput = document.querySelector('input[type="email"]');
        email = emailInput ? emailInput.value : '';
    }
    
    if (!email || !isValidEmail(email)) {
        showNotification('Veuillez saisir une adresse email valide.', 'error');
        return;
    }
    
    showLoader('Inscription en cours...');
    
    setTimeout(() => {
        hideLoader();
        addToNewsletter(email);
        showNotification('Inscription à la newsletter réussie !', 'success');
        
        // Vider le champ
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            if (input.value === email) {
                input.value = '';
            }
        });
    }, 1500);
}

// Gestion de l'inscription SMS
function handleSmsSubscription(phone) {
    if (typeof phone === 'object') {
        // Si c'est un événement form
        phone.preventDefault();
        phone = phone.target.querySelector('input[type="tel"]').value;
    } else if (!phone) {
        // Si pas de téléphone fourni, le récupérer depuis l'input
        const phoneInput = document.querySelector('input[type="tel"]');
        phone = phoneInput ? phoneInput.value : '';
    }
    
    if (!phone || !isValidPhone(phone)) {
        showNotification('Veuillez saisir un numéro de téléphone valide.', 'error');
        return;
    }
    
    showLoader('Inscription aux alertes SMS...');
    
    setTimeout(() => {
        hideLoader();
        addToSmsAlerts(phone);
        showNotification('Inscription aux alertes SMS réussie !', 'success');
        
        // Vider le champ
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            if (input.value === phone) {
                input.value = '';
            }
        });
    }, 1500);
}

// Ajouter à la newsletter (simulation)
function addToNewsletter(email) {
    try {
        let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers')) || [];
        
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            
            // Envoyer email de bienvenue (simulation)
            setTimeout(() => {
                showNotification(`Email de bienvenue envoyé à ${email}`, 'info');
            }, 3000);
        } else {
            showNotification('Cette adresse email est déjà inscrite à notre newsletter.', 'info');
        }
    } catch (e) {
        console.warn('Impossible de sauvegarder l\'inscription newsletter');
    }
}

// Ajouter aux alertes SMS (simulation)
function addToSmsAlerts(phone) {
    try {
        let subscribers = JSON.parse(localStorage.getItem('sms_subscribers')) || [];
        
        if (!subscribers.includes(phone)) {
            subscribers.push(phone);
            localStorage.setItem('sms_subscribers', JSON.stringify(subscribers));
            
            // Envoyer SMS de confirmation (simulation)
            setTimeout(() => {
                showNotification(`SMS de confirmation envoyé au ${phone}`, 'info');
            }, 3000);
        } else {
            showNotification('Ce numéro est déjà inscrit à nos alertes SMS.', 'info');
        }
    } catch (e) {
        console.warn('Impossible de sauvegarder l\'inscription SMS');
    }
}

// Envoyer email de confirmation (simulation)
function sendConfirmationEmail(contactData) {
    setTimeout(() => {
        const confirmationMessage = `
            Bonjour ${contactData.prenom} ${contactData.nom},
            
            Nous avons bien reçu votre message concernant : ${contactData.sujet}
            
            Notre équipe traitera votre demande dans les plus brefs délais.
            
            Cordialement,
            L'équipe du Collège le Jour de Divo
        `;
        
        console.log('Email de confirmation envoyé:', confirmationMessage);
        showNotification('Email de confirmation envoyé à votre adresse', 'success');
    }, 5000);
}

// Initialisation des FAQ
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const answer = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            // Toggle answer visibility
            answer.classList.toggle('hidden');
            
            // Rotate icon
            if (answer.classList.contains('hidden')) {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.style.transform = 'rotate(180deg)';
            }
            
            // Close other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    const otherTargetId = otherQuestion.getAttribute('data-target');
                    const otherAnswer = document.getElementById(otherTargetId);
                    const otherIcon = otherQuestion.querySelector('i');
                    
                    if (otherAnswer) {
                        otherAnswer.classList.add('hidden');
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
        });
    });
}

// Formatage automatique du numéro de téléphone
function formatPhoneNumber() {
    let value = this.value.replace(/\D/g, ''); // Supprimer tout ce qui n'est pas un chiffre
    
    // Format ivoirien
    if (value.startsWith('225')) {
        value = '+' + value.substring(0, 3) + ' ' + value.substring(3);
    } else if (value.length === 8) {
        // Numéro local ivoirien
        value = '+225 ' + value.substring(0, 2) + ' ' + value.substring(2, 4) + ' ' + value.substring(4, 6) + ' ' + value.substring(6, 8);
    } else if (value.length === 10 && value.startsWith('0')) {
        // Numéro avec indicatif 0
        value = '+225 ' + value.substring(1, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5, 7) + ' ' + value.substring(7, 9);
    }
    
    this.value = value;
}

// Fonctions utilitaires
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Format ivoirien: +225 XX XX XX XX ou 8 chiffres
    const cleanPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^(\+225)?[0-9]{8,10}$/;
    return phoneRegex.test(cleanPhone);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-600 text-sm mt-1';
    errorDiv.textContent = message;
    
    field.classList.add('border-red-500', 'bg-red-50');
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500', 'bg-red-50');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showLoader(message) {
    const loader = document.createElement('div');
    loader.id = 'contact-loader';
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loader.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-700">${message}</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('contact-loader');
    if (loader) {
        loader.remove();
    }
}

// Fonction pour générer un ID de ticket de support
function generateTicketId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `TICKET-${timestamp}-${random}`;
}

// Statistiques de contact (simulation)
function trackContactStats(contactData) {
    try {
        let stats = JSON.parse(localStorage.getItem('contact_stats')) || {
            total_messages: 0,
            by_subject: {},
            by_quality: {},
            by_month: {}
        };
        
        stats.total_messages++;
        stats.by_subject[contactData.sujet] = (stats.by_subject[contactData.sujet] || 0) + 1;
        stats.by_quality[contactData.qualite] = (stats.by_quality[contactData.qualite] || 0) + 1;
        
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        stats.by_month[currentMonth] = (stats.by_month[currentMonth] || 0) + 1;
        
        localStorage.setItem('contact_stats', JSON.stringify(stats));
    } catch (e) {
        console.warn('Impossible de sauvegarder les statistiques');
    }
}

// Auto-complétion pour les messages fréquents
function setupAutoComplete() {
    const messageField = document.querySelector('textarea[name="message"]');
    const sujetSelect = document.querySelector('select[name="sujet"]');
    
    if (!messageField || !sujetSelect) return;
    
    const messageTemplates = {
        'admission': 'Bonjour,\n\nJe souhaiterais obtenir des informations concernant l\'admission de mon enfant pour l\'année scolaire 2025-2026.\n\nPouvez-vous me communiquer les modalités d\'inscription ?\n\nCordialement.',
        'information': 'Bonjour,\n\nJe souhaiterais obtenir des informations générales sur votre établissement.\n\nMerci de me recontacter.\n\nCordialement.',
        'rendez_vous': 'Bonjour,\n\nJe souhaiterais prendre rendez-vous avec la direction pour discuter de...\n\nJe suis disponible...\n\nCordialement.',
        'transport': 'Bonjour,\n\nJ\'aimerais avoir des informations sur le transport scolaire : circuits, horaires et tarifs.\n\nMerci par avance.\n\nCordialement.'
    };
    
    sujetSelect.addEventListener('change', function() {
        if (messageTemplates[this.value] && !messageField.value.trim()) {
            if (confirm('Souhaitez-vous utiliser un modèle de message pour ce sujet ?')) {
                messageField.value = messageTemplates[this.value];
                messageField.focus();
            }
        }
    });
}

// Initialisation de l'auto-complétion
document.addEventListener('DOMContentLoaded', function() {
    setupAutoComplete();
});