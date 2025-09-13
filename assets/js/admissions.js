// JavaScript spécifique pour la page des admissions
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmissionForm();
    initializeFAQ();
    setupFormValidation();
});

// Initialise le formulaire d'admission
function initializeAdmissionForm() {
    const form = document.getElementById('admission-form');
    if (form) {
        form.addEventListener('submit', handleAdmissionSubmission);
        
        // Auto-calcul de l'âge
        const dateNaissanceInput = document.querySelector('input[name="date_naissance"]');
        if (dateNaissanceInput) {
            dateNaissanceInput.addEventListener('change', calculateAge);
        }
        
        // Validation en temps réel
        setupRealTimeValidation();
    }
}

// Gestion de la soumission du formulaire
function handleAdmissionSubmission(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Afficher un loader
    showLoader('Envoi de votre demande...');
    
    // Simuler l'envoi des données
    setTimeout(() => {
        hideLoader();
        showNotification('Votre demande d\'inscription a été envoyée avec succès ! Vous recevrez une confirmation par email.', 'success');
        
        // Optionnel : rediriger vers une page de confirmation
        // window.location.href = 'confirmation.html';
        
        // Ou réinitialiser le formulaire
        document.getElementById('admission-form').reset();
        
    }, 2000);
}

// Validation du formulaire
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Ce champ est obligatoire');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validation spécifique de l'email
    const emailField = document.querySelector('input[name="email"]');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Format d\'email invalide');
        isValid = false;
    }
    
    // Validation du téléphone
    const phoneField = document.querySelector('input[name="telephone"]');
    if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
        showFieldError(phoneField, 'Format de téléphone invalide');
        isValid = false;
    }
    
    // Vérifier que les conditions sont acceptées
    const conditionsCheckbox = document.querySelector('input[name="conditions"]');
    if (conditionsCheckbox && !conditionsCheckbox.checked) {
        showNotification('Vous devez accepter les conditions générales pour continuer.', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Validation en temps réel
function setupRealTimeValidation() {
    const emailField = document.querySelector('input[name="email"]');
    const phoneField = document.querySelector('input[name="telephone"]');
    const requiredFields = document.querySelectorAll('[required]');
    
    // Validation email en temps réel
    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showFieldError(this, 'Format d\'email invalide');
            } else {
                clearFieldError(this);
            }
        });
    }
    
    // Validation téléphone en temps réel
    if (phoneField) {
        phoneField.addEventListener('blur', function() {
            if (this.value && !isValidPhone(this.value)) {
                showFieldError(this, 'Format de téléphone invalide (ex: +225 XX XX XX XX)');
            } else {
                clearFieldError(this);
            }
        });
        
        // Formatage automatique du numéro
        phoneField.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.startsWith('225')) {
                value = '+' + value;
            } else if (value.length === 8) {
                value = '+225 ' + value;
            }
            this.value = value;
        });
    }
    
    // Validation des champs requis
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                showFieldError(this, 'Ce champ est obligatoire');
            } else {
                clearFieldError(this);
            }
        });
    });
}

// Calcul automatique de l'âge
function calculateAge() {
    const dateNaissance = new Date(this.value);
    const today = new Date();
    const age = today.getFullYear() - dateNaissance.getFullYear();
    const monthDiff = today.getMonth() - dateNaissance.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateNaissance.getDate())) {
        age--;
    }
    
    // Recommandations de classe basées sur l'âge
    const classeSelect = document.querySelector('select[name="classe"]');
    if (classeSelect && age) {
        let recommendedClass = '';
        if (age >= 11 && age <= 12) recommendedClass = '6eme';
        else if (age >= 12 && age <= 13) recommendedClass = '5eme';
        else if (age >= 13 && age <= 14) recommendedClass = '4eme';
        else if (age >= 14 && age <= 16) recommendedClass = '3eme';
        
        if (recommendedClass) {
            showNotification(`Âge calculé: ${age} ans. Classe recommandée: ${recommendedClass}`, 'info');
        }
    }
}

// Initialisation FAQ
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
                    
                    otherAnswer.classList.add('hidden');
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
        });
    });
}

// Fonctions utilitaires
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Format ivoirien: +225 XX XX XX XX ou XX XX XX XX
    const phoneRegex = /^(\+225\s?)?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-600 text-sm mt-1';
    errorDiv.textContent = message;
    
    field.classList.add('border-red-500');
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showLoader(message) {
    const loader = document.createElement('div');
    loader.id = 'form-loader';
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loader.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-700">${message}</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.getElementById('form-loader');
    if (loader) {
        loader.remove();
    }
}

// Fonction pour sauvegarder le brouillon du formulaire
function saveDraft() {
    const formData = new FormData(document.getElementById('admission-form'));
    const draftData = {};
    
    for (let [key, value] of formData.entries()) {
        draftData[key] = value;
    }
    
    // Note: En production, ceci serait sauvegardé sur le serveur
    // Ici nous utilisons le localStorage comme exemple
    try {
        localStorage.setItem('admission_draft', JSON.stringify(draftData));
        showNotification('Brouillon sauvegardé', 'success');
    } catch (e) {
        console.warn('Impossible de sauvegarder le brouillon');
    }
}

// Fonction pour charger le brouillon
function loadDraft() {
    try {
        const draftData = localStorage.getItem('admission_draft');
        if (draftData) {
            const data = JSON.parse(draftData);
            const form = document.getElementById('admission-form');
            
            for (let [key, value] of Object.entries(data)) {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox' || field.type === 'radio') {
                        field.checked = value === 'on';
                    } else {
                        field.value = value;
                    }
                }
            }
            
            showNotification('Brouillon chargé', 'info');
        }
    } catch (e) {
        console.warn('Impossible de charger le brouillon');
    }
}

// Auto-sauvegarde du brouillon
function setupAutoSave() {
    const form = document.getElementById('admission-form');
    if (form) {
        let saveTimeout;
        
        form.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveDraft, 5000); // Sauvegarde après 5 secondes d'inactivité
        });
    }
}

// Fonction pour calculer les frais selon la classe
function calculateFees() {
    const classeSelect = document.querySelector('select[name="classe"]');
    if (classeSelect) {
        classeSelect.addEventListener('change', function() {
            const fees = {
                '6eme': 850000,
                '5eme': 900000,
                '4eme': 950000,
                '3eme': 1000000
            };
            
            const selectedClass = this.value;
            if (fees[selectedClass]) {
                const feeAmount = fees[selectedClass].toLocaleString('fr-FR');
                showNotification(`Frais pour la ${selectedClass}: ${feeAmount} FCFA`, 'info');
            }
        });
    }
}

// Initialisation des fonctionnalités supplémentaires
document.addEventListener('DOMContentLoaded', function() {
    setupAutoSave();
    calculateFees();
    
    // Bouton pour charger un brouillon
    const loadDraftBtn = document.createElement('button');
    loadDraftBtn.type = 'button';
    loadDraftBtn.className = 'text-blue-600 text-sm underline mb-4';
    loadDraftBtn.textContent = 'Charger un brouillon sauvegardé';
    loadDraftBtn.onclick = loadDraft;
    
    const form = document.getElementById('admission-form');
    if (form) {
        form.parentNode.insertBefore(loadDraftBtn, form);
    }
});

// Gestion des pièces jointes (simulation)
function handleFileUploads() {
    const documentCheckboxes = document.querySelectorAll('input[name="documents[]"]');
    
    documentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const fileInputId = 'file_' + this.value;
            let fileInput = document.getElementById(fileInputId);
            
            if (this.checked && !fileInput) {
                // Créer un input file pour ce document
                fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.id = fileInputId;
                fileInput.name = 'files_' + this.value;
                fileInput.className = 'block mt-2 text-sm text-gray-600';
                fileInput.accept = '.pdf,.jpg,.jpeg,.png';
                
                this.parentNode.appendChild(fileInput);
                
                fileInput.addEventListener('change', function() {
                    if (this.files.length > 0) {
                        showNotification(`Fichier sélectionné: ${this.files[0].name}`, 'success');
                    }
                });
            } else if (!this.checked && fileInput) {
                // Supprimer l'input file
                fileInput.remove();
            }
        });
    });
}

// Fonction pour générer un PDF de la demande (simulation)
function generatePDF() {
    const form = document.getElementById('admission-form');
    const formData = new FormData(form);
    
    showNotification('Génération du PDF en cours...', 'info');
    
    // Simulation de génération PDF
    setTimeout(() => {
        showNotification('PDF généré avec succès! (Fonctionnalité simulée)', 'success');
    }, 2000);
}

// Ajouter un bouton pour générer le PDF
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('admission-form');
    if (form) {
        const pdfBtn = document.createElement('button');
        pdfBtn.type = 'button';
        pdfBtn.className = 'bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors ml-4';
        pdfBtn.innerHTML = '<i class="fas fa-file-pdf mr-2"></i>Générer PDF';
        pdfBtn.onclick = generatePDF;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.parentNode.appendChild(pdfBtn);
        }
    }
    
    // Initialiser la gestion des fichiers
    handleFileUploads();
});