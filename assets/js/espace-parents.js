// JavaScript pour l'espace parents
document.addEventListener('DOMContentLoaded', function() {
    initializeParentSpace();
    loadParentData();
    initializeNavigation();
    initializeQuickActions();
    initializeCommunication();
    initializePayments();
    checkAuthentication();
    startRealTimeUpdates();
});

// Données simulées du parent
const parentData = {
    id: 'parent001',
    name: 'Mme KOUAME',
    type: 'parent',
    children: [
        {
            id: 'eleve001',
            name: 'Jean KOUAME',
            class: '3ème A',
            photo: 'assets/images/student-avatar.jpg',
            stats: {
                average: 14.5,
                homework_pending: 3,
                absences_month: 2,
                class_rank: 7,
                class_total: 32,
                presence: 94
            },
            grades: {
                1: { // Premier trimestre
                    'Mathématiques': { devoir1: 16, devoir2: 14, composition: 15, moyenne: 15.0, appreciation: 'Bon élève, peut mieux faire' },
                    'Français': { devoir1: 13, devoir2: 15, composition: 14, moyenne: 14.0, appreciation: 'Travail régulier' },
                    'Sciences Physiques': { devoir1: 12, devoir2: 16, composition: 13, moyenne: 13.7, appreciation: 'Efforts à poursuivre' },
                    'Histoire-Géographie': { devoir1: 14, devoir2: 13, composition: 15, moyenne: 14.0, appreciation: 'Satisfaisant' },
                    'Anglais': { devoir1: 17, devoir2: 16, composition: 18, moyenne: 17.0, appreciation: 'Excellent travail' },
                    'SVT': { devoir1: 15, devoir2: 14, composition: 16, moyenne: 15.0, appreciation: 'Bien' },
                    'EPS': { devoir1: 18, devoir2: 17, composition: 18, moyenne: 17.7, appreciation: 'Très bon niveau' }
                }
            },
            homework: [
                {
                    id: 1,
                    subject: 'Mathématiques',
                    title: 'Exercices Chapitre 5',
                    due_date: '2024-12-15',
                    status: 'pending'
                },
                {
                    id: 2,
                    subject: 'Français',
                    title: 'Dissertation',
                    due_date: '2024-12-18',
                    status: 'pending'
                },
                {
                    id: 3,
                    subject: 'Sciences Physiques',
                    title: 'TP Lois d\'Ohm',
                    due_date: '2024-12-10',
                    status: 'submitted',
                    grade: 15
                }
            ],
            absences: [
                {
                    date: '2024-12-05',
                    type: 'absence',
                    status: 'unjustified',
                    period: 'Mathématiques (8h25-9h20)'
                },
                {
                    date: '2024-11-28',
                    type: 'absence',
                    status: 'justified',
                    period: 'Journée complète',
                    reason: 'Maladie'
                }
            ]
        }
    ],
    messages: [
        {
            id: 1,
            from: 'Prof. TOURE',
            subject: 'Progrès de Jean en algèbre',
            content: 'Bonjour, je tenais à vous informer que Jean fait des progrès remarquables...',
            date: '2024-12-12',
            read: false,
            type: 'teacher'
        },
        {
            id: 2,
            from: 'Vie Scolaire',
            subject: 'Réunion parents-professeurs',
            content: 'La réunion parents-professeurs aura lieu le 20 décembre...',
            date: '2024-12-11',
            read: true,
            type: 'administration'
        }
    ],
    payments: [
        {
            id: 1,
            date: '2024-11-15',
            description: '1ère tranche - Scolarité 2024-2025',
            amount: 317000,
            status: 'paid'
        },
        {
            id: 2,
            date: '2024-09-15',
            description: 'Inscription + Fournitures',
            amount: 50000,
            status: 'paid'
        },
        {
            id: 3,
            date: '2025-01-15',
            description: '2ème tranche - Scolarité 2024-2025',
            amount: 316000,
            status: 'pending'
        }
    ]
};

let currentChild = null;
let currentTrimestre = 1;

// Vérification de l'authentification
function checkAuthentication() {
    const session = sessionStorage.getItem('user_session') || localStorage.getItem('user_session');
    
    if (!session) {
        showNotification('Session expirée. Redirection vers la page de connexion.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    
    try {
        const sessionData = JSON.parse(session);
        if (sessionData.userType !== 'parents') {
            showNotification('Accès non autorisé pour ce type de compte.', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        
        updateParentInfo(sessionData.userData);
        return true;
        
    } catch (e) {
        showNotification('Session corrompue. Redirection vers la page de connexion.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
}

// Mise à jour des informations du parent
function updateParentInfo(userData) {
    const parentNameNav = document.getElementById('parent-name');
    const sidebarName = document.getElementById('sidebar-parent-name');
    
    if (parentNameNav) parentNameNav.textContent = userData.name;
    if (sidebarName) sidebarName.textContent = userData.name;
    
    parentData.name = userData.name;
}

// Initialisation de l'espace parent
function initializeParentSpace() {
    // Sélectionner le premier enfant par défaut
    currentChild = parentData.children[0];
    
    // Bouton de déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                logout();
            }
        });
    }
    
    // Sélecteur d'enfant
    const childSelector = document.getElementById('child-selector');
    if (childSelector) {
        childSelector.addEventListener('change', function() {
            const childId = this.value;
            currentChild = parentData.children.find(child => child.id === childId) || parentData.children[0];
            loadChildData();
        });
    }
    
    // Message de bienvenue
    setTimeout(() => {
        const hour = new Date().getHours();
        let greeting = 'Bonne journée';
        if (hour < 12) greeting = 'Bonjour';
        else if (hour < 18) greeting = 'Bon après-midi';
        else greeting = 'Bonsoir';
        
        showNotification(`${greeting} ${parentData.name} ! Suivez la scolarité de vos enfants en temps réel.`, 'success');
    }, 1000);
}

// Fonction de déconnexion
function logout() {
    sessionStorage.removeItem('user_session');
    localStorage.removeItem('user_session');
    
    showNotification('Déconnexion réussie !', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Chargement des données du parent
function loadParentData() {
    loadChildData();
    loadMessages();
    loadPayments();
}

// Chargement des données de l'enfant sélectionné
function loadChildData() {
    if (!currentChild) return;
    
    // Mettre à jour les statistiques du dashboard
    loadDashboardStats();
    
    // Mettre à jour les sélecteurs d'enfant
    updateChildSelectors();
}

// Chargement des statistiques du dashboard
function loadDashboardStats() {
    if (!currentChild) return;
    
    const stats = currentChild.stats;
    
    document.getElementById('child-average').textContent = stats.average;
    document.getElementById('child-presence').textContent = stats.presence + '%';
    document.getElementById('child-homework').textContent = stats.homework_pending;
    document.getElementById('child-rank').textContent = `${stats.class_rank}/${stats.class_total}`;
}

// Mise à jour des sélecteurs d'enfant
function updateChildSelectors() {
    const selectors = document.querySelectorAll('#child-selector, #notes-child-selector');
    
    selectors.forEach(selector => {
        selector.innerHTML = '';
        parentData.children.forEach(child => {
            const option = document.createElement('option');
            option.value = child.id;
            option.textContent = `${child.name} - ${child.class}`;
            if (child === currentChild) {
                option.selected = true;
            }
            selector.appendChild(option);
        });
    });
}

// Navigation entre les sections
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Désactiver tous les items de navigation
            navItems.forEach(nav => {
                nav.classList.remove('bg-green-100', 'text-green-700');
                nav.classList.add('text-gray-600', 'hover:bg-gray-100');
            });
            
            // Activer l'item cliqué
            this.classList.remove('text-gray-600', 'hover:bg-gray-100');
            this.classList.add('bg-green-100', 'text-green-700');
            
            // Masquer toutes les sections
            contentSections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Afficher la section cible
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.remove('hidden');
            }
            
            // Actions spécifiques selon la section
            handleSectionChange(targetSection);
        });
    });
}

// Gestion du changement de section
function handleSectionChange(section) {
    switch (section) {
        case 'notes':
            loadGrades(currentTrimestre);
            initializeNotesSystem();
            break;
        case 'enfants':
            loadChildrenData();
            break;
        case 'absences':
            loadAbsences();
            break;
        case 'devoirs':
            loadHomework();
            break;
        case 'communication':
            loadMessages();
            break;
        case 'paiements':
            loadPayments();
            break;
        case 'profil':
            loadProfile();
            break;
        case 'dashboard':
        default:
            loadChildData();
            break;
    }
}

// Actions rapides
function initializeQuickActions() {
    // Ces boutons sont dans la sidebar
    const quickActions = document.querySelectorAll('.bg-blue-600, .bg-green-600, .bg-purple-600, .bg-orange-600');
    
    quickActions.forEach((action, index) => {
        action.addEventListener('click', function() {
            switch (index) {
                case 0: // Contacter un enseignant
                    switchToSection('communication');
                    switchCommunicationTab('nouveau');
                    break;
                case 1: // Prendre RDV
                    switchToSection('communication');
                    switchCommunicationTab('rendez-vous');
                    break;
                case 2: // Justifier absence
                    switchToSection('absences');
                    break;
                case 3: // Télécharger bulletin
                    downloadBulletin();
                    break;
            }
        });
    });
}

// Basculer vers une section
function switchToSection(sectionName) {
    const navItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (navItem) {
        navItem.click();
    }
}

// Système de notes
function initializeNotesSystem() {
    const trimestreButtons = document.querySelectorAll('.trimestre-btn');
    trimestreButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const trimestre = parseInt(this.getAttribute('data-trimestre'));
            currentTrimestre = trimestre;
            
            // Mise à jour visuelle des boutons
            trimestreButtons.forEach(b => {
                b.classList.remove('bg-blue-100', 'text-blue-700');
                b.classList.add('text-gray-600', 'hover:bg-gray-100');
            });
            this.classList.add('bg-blue-100', 'text-blue-700');
            this.classList.remove('text-gray-600', 'hover:bg-gray-100');
            
            // Charger les notes du trimestre
            loadGrades(trimestre);
        });
    });
    
    // Bouton de téléchargement de bulletin
    const downloadBtn = document.getElementById('download-bulletin-parent');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadBulletin);
    }
}

// Chargement des notes
function loadGrades(trimestre) {
    if (!currentChild || !currentChild.grades[trimestre]) return;
    
    const gradesData = currentChild.grades[trimestre];
    const tableBody = document.getElementById('notes-table-parent');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    Object.entries(gradesData).forEach(([subject, grades]) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // Déterminer la couleur selon la moyenne
        let averageColor = 'text-gray-900';
        if (grades.moyenne >= 16) averageColor = 'text-green-600 font-semibold';
        else if (grades.moyenne >= 14) averageColor = 'text-blue-600';
        else if (grades.moyenne >= 10) averageColor = 'text-yellow-600';
        else averageColor = 'text-red-600 font-semibold';
        
        row.innerHTML = `
            <td class="px-4 py-3 font-medium text-gray-900">${subject}</td>
            <td class="px-4 py-3 text-center">${grades.devoir1 || '-'}</td>
            <td class="px-4 py-3 text-center">${grades.devoir2 || '-'}</td>
            <td class="px-4 py-3 text-center">${grades.composition || '-'}</td>
            <td class="px-4 py-3 text-center ${averageColor}">${grades.moyenne.toFixed(1)}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${grades.appreciation}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Téléchargement du bulletin
function downloadBulletin() {
    showNotification('Génération du bulletin en cours...', 'info');
    
    setTimeout(() => {
        showNotification('Bulletin téléchargé avec succès !', 'success');
    }, 2000);
}

// Chargement des données des enfants
function loadChildrenData() {
    // Les données sont déjà dans le HTML, cette fonction peut être étendue
    showNotification('Données des enfants chargées', 'success');
}

// Chargement des absences
function loadAbsences() {
    // Les absences sont gérées dans la section appropriée
    showNotification('Absences chargées', 'success');
}

// Chargement des devoirs
function loadHomework() {
    // Les devoirs sont gérés dans la section appropriée
    showNotification('Devoirs chargés', 'success');
}

// Communication
function initializeCommunication() {
    const commTabs = document.querySelectorAll('.comm-tab');
    const commContents = document.querySelectorAll('.comm-content');
    
    commTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchCommunicationTab(targetTab);
        });
    });
    
    // Formulaire nouveau message
    const newMessageForm = document.getElementById('new-message-form');
    if (newMessageForm) {
        newMessageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendMessage();
        });
    }
    
    // Formulaire rendez-vous
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            requestAppointment();
        });
    }
}

// Basculer entre les onglets de communication
function switchCommunicationTab(tabName) {
    const commTabs = document.querySelectorAll('.comm-tab');
    const commContents = document.querySelectorAll('.comm-content');
    
    // Désactiver tous les onglets
    commTabs.forEach(tab => {
        tab.classList.remove('bg-white', 'text-blue-700', 'shadow-sm');
        tab.classList.add('text-gray-600', 'hover:text-gray-900');
    });
    
    // Masquer tous les contenus
    commContents.forEach(content => {
        content.classList.add('hidden');
    });
    
    // Activer l'onglet sélectionné
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('bg-white', 'text-blue-700', 'shadow-sm');
        activeTab.classList.remove('text-gray-600', 'hover:text-gray-900');
    }
    
    // Afficher le contenu correspondant
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
}

// Chargement des messages
function loadMessages() {
    // Les messages sont déjà affichés dans le HTML
    // Cette fonction peut être étendue pour charger dynamiquement
    showNotification('Messages chargés', 'success');
}

// Envoyer un message
function sendMessage() {
    showNotification('Message envoyé avec succès !', 'success');
    document.getElementById('new-message-form').reset();
}

// Demander un rendez-vous
function requestAppointment() {
    showNotification('Demande de rendez-vous envoyée !', 'success');
    document.getElementById('appointment-form').reset();
}

// Paiements
function initializePayments() {
    // Boutons de téléchargement de reçus
    document.querySelectorAll('.fa-download').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Téléchargement du reçu...', 'info');
            setTimeout(() => {
                showNotification('Reçu téléchargé !', 'success');
            }, 1500);
        });
    });
    
    // Boutons de paiement
    document.querySelectorAll('button:contains("Payer")').forEach(btn => {
        btn.addEventListener('click', function() {
            initiatePayment();
        });
    });
    
    // Méthodes de paiement
    const paymentMethods = document.querySelectorAll('.fas.fa-mobile-alt, .fas.fa-credit-card, .fas.fa-university, .fas.fa-money-bill');
    paymentMethods.forEach((method, index) => {
        method.closest('button').addEventListener('click', function() {
            const methods = ['Mobile Money', 'Carte Bancaire', 'Virement', 'Espèces'];
            selectPaymentMethod(methods[index]);
        });
    });
}

// Chargement des paiements
function loadPayments() {
    // Les paiements sont déjà affichés dans le HTML
    // Cette fonction peut être étendue pour des calculs dynamiques
    calculatePaymentStats();
    showNotification('Paiements chargés', 'success');
}

// Calculer les statistiques de paiement
function calculatePaymentStats() {
    const payments = parentData.payments;
    const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    
    console.log(`Total payé: ${totalPaid} FCFA, Restant: ${totalPending} FCFA`);
}

// Initier un paiement
function initiatePayment() {
    const modal = createPaymentModal();
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
}

// Créer la modal de paiement
function createPaymentModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
    modal.id = 'payment-modal';
    
    modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Effectuer un paiement</h3>
                    <button id="close-payment-modal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mb-4">
                    <h4 class="font-medium text-gray-800">2ème tranche - Scolarité 2024-2025</h4>
                    <p class="text-2xl font-bold text-green-600">316,000 FCFA</p>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Méthode de paiement
                    </label>
                    <select id="payment-method" class="w-full border border-gray-300 rounded-md px-3 py-2" required>
                        <option value="">Sélectionner une méthode</option>
                        <option value="mobile">Mobile Money</option>
                        <option value="card">Carte Bancaire</option>
                        <option value="transfer">Virement</option>
                        <option value="cash">Espèces (au secrétariat)</option>
                    </select>
                </div>
                <div id="payment-details" class="mb-4 hidden">
                    <!-- Les détails de paiement seront ajoutés ici selon la méthode -->
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" id="cancel-payment" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                        Annuler
                    </button>
                    <button type="button" id="confirm-payment" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        <i class="fas fa-credit-card mr-2"></i>Payer
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter les événements
    modal.querySelector('#close-payment-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-payment').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#confirm-payment').addEventListener('click', () => {
        processPayment(modal);
    });
    
    modal.querySelector('#payment-method').addEventListener('change', function() {
        showPaymentDetails(this.value, modal);
    });
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    return modal;
}

// Afficher les détails de paiement selon la méthode
function showPaymentDetails(method, modal) {
    const detailsDiv = modal.querySelector('#payment-details');
    detailsDiv.classList.remove('hidden');
    
    let content = '';
    
    switch (method) {
        case 'mobile':
            content = `
                <label class="block text-sm font-medium text-gray-700 mb-2">Numéro Mobile Money</label>
                <input type="tel" placeholder="+225 XX XX XX XX" class="w-full border border-gray-300 rounded-md px-3 py-2" required>
                <p class="text-xs text-gray-500 mt-1">Orange Money, MTN Money, Moov Money acceptés</p>
            `;
            break;
        case 'card':
            content = `
                <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de carte</label>
                <input type="text" placeholder="1234 5678 9012 3456" class="w-full border border-gray-300 rounded-md px-3 py-2 mb-2" required>
                <div class="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="MM/AA" class="border border-gray-300 rounded-md px-3 py-2" required>
                    <input type="text" placeholder="CVV" class="border border-gray-300 rounded-md px-3 py-2" required>
                </div>
            `;
            break;
        case 'transfer':
            content = `
                <div class="bg-blue-50 p-3 rounded">
                    <p class="text-sm"><strong>Compte bancaire du collège :</strong></p>
                    <p class="text-sm">BACI - 12345678901234567890</p>
                    <p class="text-sm">Référence : ${parentData.children[0].name} - 2ème tranche</p>
                </div>
            `;
            break;
        case 'cash':
            content = `
                <div class="bg-yellow-50 p-3 rounded">
                    <p class="text-sm"><strong>Paiement en espèces :</strong></p>
                    <p class="text-sm">Rendez-vous au secrétariat avec cette référence</p>
                    <p class="text-sm font-mono bg-white px-2 py-1 rounded">REF-${Date.now()}</p>
                </div>
            `;
            break;
    }
    
    detailsDiv.innerHTML = content;
}

// Traiter le paiement
function processPayment(modal) {
    const method = modal.querySelector('#payment-method').value;
    
    if (!method) {
        showNotification('Veuillez sélectionner une méthode de paiement', 'error');
        return;
    }
    
    showNotification('Traitement du paiement en cours...', 'info');
    
    setTimeout(() => {
        if (method === 'cash') {
            showNotification('Référence de paiement générée ! Présentez-vous au secrétariat.', 'success');
        } else {
            showNotification('Paiement effectué avec succès !', 'success');
            
            // Mettre à jour le statut du paiement
            const pendingPayment = parentData.payments.find(p => p.status === 'pending');
            if (pendingPayment) {
                pendingPayment.status = 'paid';
                pendingPayment.date = new Date().toISOString().split('T')[0];
            }
        }
        
        document.body.removeChild(modal);
        loadPayments();
        
    }, 3000);
}

// Sélectionner une méthode de paiement
function selectPaymentMethod(method) {
    showNotification(`Méthode sélectionnée: ${method}`, 'info');
    initiatePayment();
}

// Chargement du profil
function loadProfile() {
    showNotification('Profil chargé', 'success');
    
    // Événements pour la modification du profil
    const saveBtn = document.querySelector('button:contains("Sauvegarder")');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveProfile();
        });
    }
}

// Sauvegarder le profil
function saveProfile() {
    showNotification('Profil mis à jour avec succès !', 'success');
}

// Mise à jour en temps réel
function startRealTimeUpdates() {
    // Mise à jour de l'heure
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);
    
    // Vérifier les nouvelles notifications
    setTimeout(() => {
        checkForUpdates();
    }, 10000);
    
    // Vérifier les messages non lus
    checkUnreadMessages();
    setInterval(checkUnreadMessages, 300000); // Toutes les 5 minutes
}

// Mise à jour de l'heure actuelle
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.querySelectorAll('.current-time').forEach(element => {
        element.textContent = timeString;
    });
}

// Vérifier les mises à jour
function checkForUpdates() {
    // Simuler la réception de nouvelles notifications pour parents
    const parentUpdates = [
        'Nouvelle note disponible pour Jean',
        'Message du professeur principal',
        'Rappel: paiement à effectuer',
        'Bulletin trimestriel disponible'
    ];
    
    const randomUpdate = parentUpdates[Math.floor(Math.random() * parentUpdates.length)];
    
    if (Math.random() < 0.2) { // 20% de chance
        showNotification(randomUpdate, 'info');
    }
}

// Vérifier les messages non lus
function checkUnreadMessages() {
    const unreadCount = parentData.messages.filter(m => !m.read).length;
    
    if (unreadCount > 0) {
        // Mettre à jour l'interface pour montrer les messages non lus
        const commTab = document.querySelector('[data-tab="messages"]');
        if (commTab && !commTab.querySelector('.unread-badge')) {
            const badge = document.createElement('span');
            badge.className = 'unread-badge bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2';
            badge.textContent = unreadCount;
            commTab.appendChild(badge);
        }
    }
}

// Fonction utilitaire pour les boutons contenant du texte spécifique
function addEventListenerByText(selector, text, callback) {
    const elements = Array.from(document.querySelectorAll(selector));
    const element = elements.find(el => el.textContent.includes(text));
    if (element) {
        element.addEventListener('click', callback);
    }
}

// Initialiser tous les événements après le chargement du DOM
function initializeAllEventListeners() {
    setTimeout(() => {
        // Boutons de paiement
        addEventListenerByText('button', 'Payer', () => initiatePayment());
        
        // Boutons de réponse aux messages
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.includes('Répondre')) {
                btn.addEventListener('click', function() {
                    switchToSection('communication');
                    switchCommunicationTab('nouveau');
                    showNotification('Formulaire de réponse ouvert', 'info');
                });
            }
            
            if (btn.textContent.includes('Confirmer présence')) {
                btn.addEventListener('click', function() {
                    showNotification('Présence confirmée pour la réunion', 'success');
                    this.textContent = 'Présence confirmée';
                    this.classList.remove('text-blue-600');
                    this.classList.add('text-green-600');
                });
            }
        });
        
    }, 500);
}

// Gestion du contenu dynamique
function handleDynamicContent() {
    document.addEventListener('click', function(e) {
        // Gestion des boutons qui peuvent être ajoutés dynamiquement
        if (e.target.classList.contains('download-receipt') || e.target.closest('.download-receipt')) {
            const btn = e.target.classList.contains('download-receipt') ? e.target : e.target.closest('.download-receipt');
            downloadReceipt(btn.dataset.paymentId);
        }
        
        // Gestion des boutons de vue des détails d'enfant
        if (e.target.classList.contains('view-child-details') || e.target.closest('.view-child-details')) {
            const btn = e.target.classList.contains('view-child-details') ? e.target : e.target.closest('.view-child-details');
            viewChildDetails(btn.dataset.childId);
        }
    });
}

// Télécharger un reçu de paiement
function downloadReceipt(paymentId) {
    const payment = parentData.payments.find(p => p.id == paymentId);
    if (payment) {
        showNotification(`Téléchargement du reçu: ${payment.description}`, 'info');
        setTimeout(() => {
            showNotification('Reçu téléchargé avec succès !', 'success');
        }, 2000);
    }
}

// Voir les détails d'un enfant
function viewChildDetails(childId) {
    const child = parentData.children.find(c => c.id === childId);
    if (child) {
        currentChild = child;
        switchToSection('enfants');
        loadChildData();
    }
}

// Utilitaires
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const id = 'notif-' + Date.now();
    notification.id = id;
    
    let bgColor, textColor, icon;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-500';
            textColor = 'text-white';
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            textColor = 'text-white';
            icon = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            bgColor = 'bg-yellow-500';
            textColor = 'text-white';
            icon = 'fas fa-exclamation-triangle';
            break;
        case 'info':
        default:
            bgColor = 'bg-blue-500';
            textColor = 'text-white';
            icon = 'fas fa-info-circle';
            break;
    }
    
    notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full ${bgColor} ${textColor}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="${icon} mr-3"></i>
            <span>${message}</span>
            <button onclick="closeNotification('${id}')" class="ml-4 hover:opacity-75">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animer l'entrée
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto-supprimer après 5 secondes
    setTimeout(() => {
        closeNotification(id);
    }, 5000);
}

// Fermer une notification
function closeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Initialiser la gestion du contenu dynamique
handleDynamicContent();

// Initialiser tous les événements
initializeAllEventListeners();

console.log('Espace parents initialisé avec succès !');