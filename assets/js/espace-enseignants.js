// JavaScript pour l'espace enseignants
document.addEventListener('DOMContentLoaded', function() {
    initializeTeacherSpace();
    loadTeacherData();
    initializeNavigation();
    initializeQuickActions();
    initializeNotesSystem();
    initializeHomeworkSystem();
    initializeCommunication();
    checkAuthentication();
    startRealTimeUpdates();
});

// Données simulées de l'enseignant
const teacherData = {
    id: 'prof001',
    name: 'Prof. TOURE',
    subject: 'Mathématiques',
    photo: 'assets/images/teacher-avatar.jpg',
    classes: [
        {
            id: '3eme-a',
            name: '3ème A',
            students: 32,
            average: 14.2,
            present_today: 30,
            homework_to_correct: 5
        },
        {
            id: '4eme-b',
            name: '4ème B',
            students: 28,
            average: 13.8,
            present_today: 27,
            homework_to_correct: 3
        },
        {
            id: '5eme-c',
            name: '5ème C',
            students: 30,
            average: 12.9,
            present_today: 29,
            homework_to_correct: 2
        },
        {
            id: '6eme-d',
            name: '6ème D',
            students: 35,
            average: 13.5,
            present_today: 34,
            homework_to_correct: 2
        },
        {
            id: '6eme-e',
            name: '6ème E',
            students: 31,
            average: 12.7,
            present_today: 31,
            homework_to_correct: 0
        }
    ],
    students: {
        '3eme-a': [
            { id: 'eleve001', name: 'Jean KOUAME', grades: { devoir1: 16, devoir2: 14, composition: 15 } },
            { id: 'eleve002', name: 'Marie YAO', grades: { devoir1: 18, devoir2: 17, composition: 18 } },
            { id: 'eleve003', name: 'Paul DIABATE', grades: { devoir1: 12, devoir2: 13, composition: 11 } },
            // ... autres élèves
        ],
        '4eme-b': [
            { id: 'eleve004', name: 'Fatou TRAORE', grades: { devoir1: 15, devoir2: 16, composition: 14 } },
            { id: 'eleve005', name: 'Ibrahim KONE', grades: { devoir1: 11, devoir2: 12, composition: 10 } },
            // ... autres élèves
        ],
        '5eme-c': [
            { id: 'eleve006', name: 'Aminata OUATTARA', grades: { devoir1: 13, devoir2: 14, composition: 15 } },
            { id: 'eleve007', name: 'Sekou BAMBA', grades: { devoir1: 10, devoir2: 11, composition: 9 } },
            // ... autres élèves
        ]
    },
    homework: [
        {
            id: 1,
            title: 'Exercices Chapitre 5 - Équations',
            class: '3eme-a',
            assigned_date: '2024-12-10',
            due_date: '2024-12-15',
            status: 'assigned',
            submitted: 25,
            total: 32
        },
        {
            id: 2,
            title: 'Dissertation - L\'amitié',
            class: '4eme-b',
            assigned_date: '2024-12-08',
            due_date: '2024-12-14',
            status: 'to_correct',
            submitted: 28,
            total: 28
        },
        {
            id: 3,
            title: 'TP Lois d\'Ohm',
            class: '3eme-a',
            assigned_date: '2024-12-05',
            due_date: '2024-12-10',
            status: 'corrected',
            submitted: 30,
            total: 30,
            average: 14.2
        }
    ],
    messages: [
        {
            id: 1,
            from: 'Mme KOUAME',
            subject: 'Question sur les devoirs de Jean',
            content: 'Bonjour, j\'aimerais avoir des précisions sur les exercices...',
            date: '2024-12-13',
            read: false,
            type: 'parent'
        },
        {
            id: 2,
            from: 'Direction',
            subject: 'Conseil de classe 3ème A',
            content: 'Le conseil de classe aura lieu lundi 18 décembre à 16h...',
            date: '2024-12-12',
            read: true,
            type: 'administration'
        }
    ],
    schedule_today: [
        {
            time: '8h25',
            class: '3ème A',
            subject: 'Mathématiques',
            room: 'Salle 101',
            topic: 'Algèbre',
            status: 'completed'
        },
        {
            time: '10h30',
            class: '4ème B',
            subject: 'Mathématiques',
            room: 'Salle 101',
            topic: 'Géométrie',
            status: 'current'
        },
        {
            time: '14h00',
            class: '5ème C',
            subject: 'Mathématiques',
            room: 'Salle 101',
            topic: 'Fractions',
            status: 'upcoming'
        }
    ]
};

let currentClass = null;
let currentEvaluationType = 'devoir1';

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
        if (sessionData.userType !== 'enseignants') {
            showNotification('Accès non autorisé pour ce type de compte.', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        
        updateTeacherInfo(sessionData.userData);
        return true;
        
    } catch (e) {
        showNotification('Session corrompue. Redirection vers la page de connexion.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
}

// Mise à jour des informations de l'enseignant
function updateTeacherInfo(userData) {
    const teacherNameNav = document.getElementById('teacher-name');
    const sidebarName = document.getElementById('sidebar-teacher-name');
    const sidebarSubject = document.getElementById('sidebar-teacher-subject');
    
    if (teacherNameNav) teacherNameNav.textContent = userData.name;
    if (sidebarName) sidebarName.textContent = userData.name;
    if (sidebarSubject) sidebarSubject.textContent = userData.subject;
    
    teacherData.name = userData.name;
    teacherData.subject = userData.subject;
}

// Initialisation de l'espace enseignant
function initializeTeacherSpace() {
    // Sélectionner la première classe par défaut
    currentClass = teacherData.classes[0];
    
    // Bouton de déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                logout();
            }
        });
    }
    
    // Message de bienvenue
    setTimeout(() => {
        const hour = new Date().getHours();
        let greeting = 'Bonne journée';
        if (hour < 12) greeting = 'Bonjour';
        else if (hour < 18) greeting = 'Bon après-midi';
        else greeting = 'Bonsoir';
        
        const unreadMessages = teacherData.messages.filter(m => !m.read).length;
        const homeworkToCorrect = teacherData.homework.filter(h => h.status === 'to_correct').length;
        
        showNotification(`${greeting} ${teacherData.name} ! ${unreadMessages} nouveau(x) message(s) et ${homeworkToCorrect} devoir(s) à corriger.`, 'success');
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

// Chargement des données de l'enseignant
function loadTeacherData() {
    loadDashboardStats();
    loadTodaySchedule();
    loadClasses();
}

// Chargement des statistiques du dashboard
function loadDashboardStats() {
    const totalStudents = teacherData.classes.reduce((sum, cls) => sum + cls.students, 0);
    const homeworkToCorrect = teacherData.homework.filter(h => h.status === 'to_correct').length;
    const unreadMessages = teacherData.messages.filter(m => !m.read).length;
    const classesThisWeek = teacherData.schedule_today.length * 5; // Approximation
    
    // Mettre à jour les statistiques dans la sidebar
    const sidebarStats = document.querySelectorAll('.bg-white.rounded-lg.shadow-sm .space-y-4 .flex.justify-between');
    if (sidebarStats.length >= 4) {
        sidebarStats[0].querySelector('.font-semibold').textContent = teacherData.classes.length;
        sidebarStats[1].querySelector('.font-semibold').textContent = totalStudents;
        sidebarStats[2].querySelector('.font-semibold').textContent = homeworkToCorrect;
        sidebarStats[3].querySelector('.font-semibold').textContent = unreadMessages;
    }
    
    // Mettre à jour les cartes de statistiques du dashboard
    const statsCards = document.querySelectorAll('.bg-gradient-to-r .text-xl.font-bold');
    if (statsCards.length >= 4) {
        statsCards[0].textContent = teacherData.classes.length;
        statsCards[1].textContent = totalStudents;
        statsCards[2].textContent = homeworkToCorrect;
        statsCards[3].textContent = classesThisWeek;
    }
}

// Chargement de l'emploi du temps du jour
function loadTodaySchedule() {
    // L'emploi du temps est déjà codé dans le HTML
    showNotification('Emploi du temps chargé', 'success');
}

// Chargement des classes
function loadClasses() {
    // Les classes sont déjà affichées dans le HTML
    showNotification('Classes chargées', 'success');
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
                nav.classList.remove('bg-purple-100', 'text-purple-700');
                nav.classList.add('text-gray-600', 'hover:bg-gray-100');
            });
            
            // Activer l'item cliqué
            this.classList.remove('text-gray-600', 'hover:bg-gray-100');
            this.classList.add('bg-purple-100', 'text-purple-700');
            
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
            initializeNotesSystem();
            loadStudentsForGrades();
            break;
        case 'devoirs':
            initializeHomeworkSystem();
            loadHomework();
            break;
        case 'classes':
            loadClasses();
            break;
        case 'absences':
            loadAbsences();
            break;
        case 'emploi-temps':
            loadSchedule();
            break;
        case 'communication':
            initializeCommunication();
            loadMessages();
            break;
        case 'ressources':
            loadResources();
            break;
        case 'profil':
            loadProfile();
            break;
        case 'dashboard':
        default:
            loadTeacherData();
            break;
    }
}

// Actions rapides
function initializeQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action');
    
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            const actionType = this.getAttribute('data-action');
            
            switch (actionType) {
                case 'saisir-notes':
                    switchToSection('notes');
                    break;
                case 'nouveau-devoir':
                    switchToSection('devoirs');
                    setTimeout(() => createNewHomework(), 300);
                    break;
                case 'marquer-absences':
                    switchToSection('absences');
                    break;
                case 'voir-messages':
                    switchToSection('communication');
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
    const classSelector = document.getElementById('notes-class-selector');
    const evaluationType = document.getElementById('evaluation-type');
    
    if (classSelector) {
        classSelector.addEventListener('change', function() {
            currentClass = teacherData.classes.find(c => c.id === this.value) || teacherData.classes[0];
            loadStudentsForGrades();
        });
    }
    
    if (evaluationType) {
        evaluationType.addEventListener('change', function() {
            currentEvaluationType = this.value;
            loadStudentsForGrades();
        });
    }
    
    // Bouton de sauvegarde des notes
    const saveGradesBtn = document.getElementById('save-grades');
    if (saveGradesBtn) {
        saveGradesBtn.addEventListener('click', saveGrades);
    }
    
    // Bouton d'exportation
    const exportGradesBtn = document.getElementById('export-grades');
    if (exportGradesBtn) {
        exportGradesBtn.addEventListener('click', exportGrades);
    }
}

// Charger les élèves pour la saisie de notes
function loadStudentsForGrades() {
    const classId = document.getElementById('notes-class-selector').value || '3eme-a';
    const students = teacherData.students[classId] || [];
    const tableBody = document.getElementById('students-grades-table');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const currentGrade = student.grades[currentEvaluationType] || '';
        
        row.innerHTML = `
            <td class="px-4 py-3">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                        ${student.name.charAt(0)}
                    </div>
                    <span class="font-medium">${student.name}</span>
                </div>
            </td>
            <td class="px-4 py-3 text-center">
                <input type="number" min="0" max="20" step="0.5" value="${currentGrade}" 
                        class="grade-input w-20 border border-gray-300 rounded px-2 py-1 text-center"
                        data-student-id="${student.id}" data-evaluation="${currentEvaluationType}">
            </td>
            <td class="px-4 py-3">
                <input type="text" placeholder="Appréciation..." 
                        class="appreciation-input w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        data-student-id="${student.id}">
            </td>
            <td class="px-4 py-3 text-center">
                <button class="text-blue-600 hover:text-blue-800 text-sm">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Ajouter les événements de validation en temps réel
    setupGradeValidation();
}

// Configuration de la validation des notes
function setupGradeValidation() {
    const gradeInputs = document.querySelectorAll('.grade-input');
    
    gradeInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            
            // Validation de la note
            if (value < 0 || value > 20) {
                this.classList.add('border-red-500', 'bg-red-50');
                showNotification('La note doit être entre 0 et 20', 'error');
            } else {
                this.classList.remove('border-red-500', 'bg-red-50');
                
                // Coloration selon la note
                if (value >= 16) {
                    this.classList.add('text-green-600', 'font-semibold');
                    this.classList.remove('text-red-600', 'text-yellow-600');
                } else if (value >= 10) {
                    this.classList.add('text-yellow-600');
                    this.classList.remove('text-green-600', 'text-red-600', 'font-semibold');
                } else if (value >= 0) {
                    this.classList.add('text-red-600', 'font-semibold');
                    this.classList.remove('text-green-600', 'text-yellow-600');
                }
            }
        });
        
        input.addEventListener('blur', function() {
            // Auto-sauvegarder après saisie
            if (this.value && !this.classList.contains('border-red-500')) {
                autoSaveGrade(this);
            }
        });
    });
}

// Auto-sauvegarde d'une note
function autoSaveGrade(input) {
    const studentId = input.getAttribute('data-student-id');
    const evaluation = input.getAttribute('data-evaluation');
    const grade = parseFloat(input.value);
    
    // Trouver l'élève et mettre à jour sa note
    const classId = document.getElementById('notes-class-selector').value;
    const student = teacherData.students[classId]?.find(s => s.id === studentId);
    
    if (student) {
        student.grades[evaluation] = grade;
        
        // Indicateur visuel de sauvegarde
        input.classList.add('bg-green-50', 'border-green-300');
        setTimeout(() => {
            input.classList.remove('bg-green-50', 'border-green-300');
        }, 1000);
    }
}

// Sauvegarder toutes les notes
function saveGrades() {
    const gradeInputs = document.querySelectorAll('.grade-input');
    const appreciationInputs = document.querySelectorAll('.appreciation-input');
    
    let savedCount = 0;
    
    gradeInputs.forEach(input => {
        if (input.value && !input.classList.contains('border-red-500')) {
            autoSaveGrade(input);
            savedCount++;
        }
    });
    
    showNotification(`${savedCount} note(s) sauvegardée(s) avec succès !`, 'success');
}

// Exporter les notes
function exportGrades() {
    const classId = document.getElementById('notes-class-selector').value;
    const className = teacherData.classes.find(c => c.id === classId)?.name || 'Classe';
    
    showNotification(`Export des notes de ${className} en cours...`, 'info');
    
    setTimeout(() => {
        showNotification('Fichier Excel généré et téléchargé !', 'success');
    }, 2000);
}

// Système de devoirs
function initializeHomeworkSystem() {
    // Onglets des devoirs
    const homeworkTabs = document.querySelectorAll('.homework-tab');
    homeworkTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchHomeworkTab(targetTab);
        });
    });
    
    // Bouton nouveau devoir
    const newHomeworkBtn = document.getElementById('new-homework-btn');
    if (newHomeworkBtn) {
        newHomeworkBtn.addEventListener('click', createNewHomework);
    }
}

// Basculer entre les onglets de devoirs
function switchHomeworkTab(tabName) {
    const homeworkTabs = document.querySelectorAll('.homework-tab');
    const homeworkContents = document.querySelectorAll('.homework-content');
    
    // Désactiver tous les onglets
    homeworkTabs.forEach(tab => {
        tab.classList.remove('bg-white', 'text-orange-700', 'shadow-sm');
        tab.classList.add('text-gray-600', 'hover:text-gray-900');
    });
    
    // Masquer tous les contenus
    homeworkContents.forEach(content => {
        content.classList.add('hidden');
    });
    
    // Activer l'onglet sélectionné
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('bg-white', 'text-orange-700', 'shadow-sm');
        activeTab.classList.remove('text-gray-600', 'hover:text-gray-900');
    }
    
    // Afficher le contenu correspondant
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
}

// Créer un nouveau devoir
function createNewHomework() {
    const modal = createHomeworkModal();
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
}

// Créer la modal de nouveau devoir
function createHomeworkModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
    modal.id = 'homework-modal';
    
    modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Nouveau devoir</h3>
                    <button id="close-homework-modal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="new-homework-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                        <select name="class" required class="w-full border border-gray-300 rounded-md px-3 py-2">
                            <option value="">Sélectionner une classe</option>
                            ${teacherData.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Titre du devoir</label>
                        <input type="text" name="title" required class="w-full border border-gray-300 rounded-md px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                        <input type="date" name="due_date" required class="w-full border border-gray-300 rounded-md px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fichier joint (optionnel)</label>
                        <input type="file" name="attachment" class="w-full border border-gray-300 rounded-md px-3 py-2">
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" id="cancel-homework" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                            Annuler
                        </button>
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            <i class="fas fa-plus mr-2"></i>Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Ajouter les événements
    modal.querySelector('#close-homework-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-homework').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#new-homework-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitNewHomework(modal);
    });
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    return modal;
}

// Soumettre le nouveau devoir
function submitNewHomework(modal) {
    const formData = new FormData(modal.querySelector('#new-homework-form'));
    
    const newHomework = {
        id: Date.now(),
        title: formData.get('title'),
        class: formData.get('class'),
        assigned_date: new Date().toISOString().split('T')[0],
        due_date: formData.get('due_date'),
        status: 'assigned',
        submitted: 0,
        total: teacherData.classes.find(c => c.id === formData.get('class'))?.students || 0
    };
    
    teacherData.homework.push(newHomework);
    
    showNotification('Devoir créé et envoyé aux élèves !', 'success');
    document.body.removeChild(modal);
    
    // Recharger la section devoirs
    loadHomework();
}

// Chargement des devoirs
function loadHomework() {
    // Les devoirs sont déjà affichés dans le HTML
    showNotification('Devoirs chargés', 'success');
}

// Communication
function initializeCommunication() {
    const commTabs = document.querySelectorAll('.comm-tab');
    commTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchCommunicationTab(targetTab);
        });
    });
    
    // Formulaire de message
    const messageForm = document.getElementById('teacher-message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendTeacherMessage();
        });
    }
    
    // Sélecteur de type de destinataire
    const recipientType = document.getElementById('recipient-type');
    if (recipientType) {
        recipientType.addEventListener('change', updateRecipientList);
    }
    
    // Bouton nouvelle annonce
    const newAnnouncementBtn = document.getElementById('new-announcement-btn');
    if (newAnnouncementBtn) {
        newAnnouncementBtn.addEventListener('click', createNewAnnouncement);
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

// Mettre à jour la liste des destinataires
function updateRecipientList() {
    const type = document.getElementById('recipient-type').value;
    const recipientSelect = document.getElementById('recipient');
    
    recipientSelect.innerHTML = '<option value="">Choisir un destinataire</option>';
    
    switch (type) {
        case 'parent':
            // Ajouter les parents des élèves
            Object.values(teacherData.students).flat().forEach(student => {
                const option = document.createElement('option');
                option.value = `parent_${student.id}`;
                option.textContent = `Parent de ${student.name}`;
                recipientSelect.appendChild(option);
            });
            break;
        case 'class':
            // Ajouter les classes
            teacherData.classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = `class_${cls.id}`;
                option.textContent = cls.name;
                recipientSelect.appendChild(option);
            });
            break;
        case 'administration':
            const adminOptions = ['Direction', 'Vie Scolaire', 'Infirmerie', 'Comptabilité'];
            adminOptions.forEach(admin => {
                const option = document.createElement('option');
                option.value = admin.toLowerCase();
                option.textContent = admin;
                recipientSelect.appendChild(option);
            });
            break;
    }
}

// Envoyer un message
function sendTeacherMessage() {
    const form = document.getElementById('teacher-message-form');
    const recipient = form.querySelector('#recipient').value;
    const subject = form.querySelector('#subject').value;
    const content = form.querySelector('#message-content').value;
    const type = form.querySelector('#recipient-type').value;

    if (!recipient || !subject || !content) {
        showNotification('Veuillez remplir tous les champs.', 'error');
        return;
    }

    const newMessage = {
        id: Date.now(),
        from: teacherData.name,
        to: recipient,
        subject: subject,
        content: content,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: type
    };
    
    teacherData.messages.unshift(newMessage); // Ajouter au début pour un affichage plus récent
    showNotification('Message envoyé avec succès !', 'success');
    form.reset();
    loadMessages();
}

// Créer une nouvelle annonce
function createNewAnnouncement() {
    const modal = createAnnouncementModal();
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
}

// Créer la modal de nouvelle annonce
function createAnnouncementModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
    modal.id = 'announcement-modal';
    
    modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Nouvelle annonce</h3>
                    <button id="close-announcement-modal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="new-announcement-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Titre de l'annonce</label>
                        <input type="text" name="title" required class="w-full border border-gray-300 rounded-md px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                        <textarea name="content" rows="5" required class="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" id="cancel-announcement" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                            Annuler
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            <i class="fas fa-bullhorn mr-2"></i>Publier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Ajouter les événements
    modal.querySelector('#close-announcement-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-announcement').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#new-announcement-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitNewAnnouncement(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    return modal;
}

// Soumettre la nouvelle annonce
function submitNewAnnouncement(modal) {
    const formData = new FormData(modal.querySelector('#new-announcement-form'));
    
    const newAnnouncement = {
        id: Date.now(),
        from: teacherData.name,
        subject: formData.get('title'),
        content: formData.get('content'),
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'announcement'
    };
    
    // Simuler un envoi à l'ensemble des parties prenantes (élèves, parents, etc.)
    teacherData.messages.unshift(newAnnouncement);
    
    showNotification('Annonce publiée avec succès !', 'success');
    document.body.removeChild(modal);
    
    loadMessages();
}

// Chargement des messages
function loadMessages() {
    const inboxList = document.getElementById('inbox-list');
    if (!inboxList) return;
    
    inboxList.innerHTML = '';
    
    teacherData.messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    teacherData.messages.forEach(message => {
        const messageItem = document.createElement('li');
        const isUnread = !message.read;
        
        messageItem.className = `p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${isUnread ? 'bg-blue-50 font-semibold' : ''}`;
        
        messageItem.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">${message.type === 'parent' ? 'Parent' : 'Administration'}</span>
                <span class="text-xs text-gray-400">${message.date}</span>
            </div>
            <h4 class="text-lg font-bold truncate mt-1">${message.subject}</h4>
            <p class="text-sm text-gray-600 mt-1 truncate">${message.content}</p>
        `;
        
        messageItem.addEventListener('click', () => {
            message.read = true; // Marquer comme lu
            loadMessages(); // Recharger la liste pour mettre à jour l'affichage
            showFullMessage(message);
        });
        
        inboxList.appendChild(messageItem);
    });
    
    updateUnreadCount();
}

// Afficher le message complet
function showFullMessage(message) {
    const modal = createMessageModal(message);
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
}

// Créer la modal d'affichage de message
function createMessageModal(message) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
    
    modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-4/5 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-gray-900">${message.subject}</h3>
                <button id="close-message-modal" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="border-b border-gray-200 pb-3 mb-3">
                <p class="text-sm text-gray-700"><strong>De :</strong> ${message.from}</p>
                <p class="text-sm text-gray-700"><strong>Date :</strong> ${message.date}</p>
                <p class="text-sm text-gray-700"><strong>Type :</strong> ${message.type}</p>
            </div>
            <div class="prose max-h-96 overflow-y-auto">
                <p>${message.content}</p>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
                <button id="reply-message" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <i class="fas fa-reply mr-2"></i>Répondre
                </button>
            </div>
        </div>
    `;
    
    modal.querySelector('#close-message-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#reply-message').addEventListener('click', () => {
        document.body.removeChild(modal);
        showReplyForm(message);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    return modal;
}

// Afficher le formulaire de réponse
function showReplyForm(originalMessage) {
    switchToSection('communication');
    
    const messageForm = document.getElementById('teacher-message-form');
    if (messageForm) {
        messageForm.querySelector('#recipient-type').value = originalMessage.type;
        updateRecipientList();
        
        // Attendre que la liste se mette à jour avant de sélectionner
        setTimeout(() => {
            const recipientSelect = messageForm.querySelector('#recipient');
            if (originalMessage.type === 'parent') {
                const student = Object.values(teacherData.students).flat().find(s => `parent_${s.id}` === originalMessage.id); // Id de l'émetteur
                if (student) {
                    recipientSelect.value = `parent_${student.id}`;
                }
            } else {
                recipientSelect.value = originalMessage.from.toLowerCase();
            }
        }, 100);
        
        messageForm.querySelector('#subject').value = `RE: ${originalMessage.subject}`;
        messageForm.querySelector('#message-content').value = `\n\n--- Message original du ${originalMessage.date} ---\n${originalMessage.content}`;
        
        showNotification(`Préparation d'une réponse à "${originalMessage.subject}"`, 'info');
    }
}

// Mise à jour du compteur de messages non lus
function updateUnreadCount() {
    const unreadCount = teacherData.messages.filter(m => !m.read).length;
    const badge = document.getElementById('unread-messages-badge');
    const sidebarBadge = document.getElementById('sidebar-messages-badge');
    
    if (badge) {
        badge.textContent = unreadCount;
        badge.classList.toggle('hidden', unreadCount === 0);
    }
    
    if (sidebarBadge) {
        sidebarBadge.textContent = unreadCount;
        sidebarBadge.classList.toggle('hidden', unreadCount === 0);
    }
}

// Fonction utilitaire pour les notifications
function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `p-4 rounded-md shadow-lg mb-3 flex items-center space-x-3 transition-opacity duration-500 ease-out`;
    
    let iconClass = '';
    let bgColor = '';
    
    switch (type) {
        case 'success':
            iconClass = 'fas fa-check-circle text-green-500';
            bgColor = 'bg-green-100 border-green-200';
            break;
        case 'error':
            iconClass = 'fas fa-times-circle text-red-500';
            bgColor = 'bg-red-100 border-red-200';
            break;
        case 'info':
            iconClass = 'fas fa-info-circle text-blue-500';
            bgColor = 'bg-blue-100 border-blue-200';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle text-yellow-500';
            bgColor = 'bg-yellow-100 border-yellow-200';
            break;
    }
    
    notification.innerHTML = `
        <i class="${iconClass} text-xl"></i>
        <p class="text-sm text-gray-800">${message}</p>
    `;
    notification.classList.add(bgColor);
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('opacity-0');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 500);
    }, 4000);
}

// Chargement des absences (fonctions à implémenter)
function loadAbsences() {
    showNotification('Chargement des absences...', 'info');
    // Logique pour charger les données d'absences
}

// Chargement de l'emploi du temps complet (fonctions à implémenter)
function loadSchedule() {
    showNotification('Chargement de l\'emploi du temps...', 'info');
    // Logique pour charger l'emploi du temps complet
}

// Chargement des ressources (fonctions à implémenter)
function loadResources() {
    showNotification('Chargement des ressources...', 'info');
    // Logique pour charger les ressources pédagogiques
}

// Chargement du profil (fonctions à implémenter)
function loadProfile() {
    showNotification('Chargement du profil...', 'info');
    // Logique pour afficher les informations de l'enseignant
}

// Démarrer les mises à jour en temps réel (simulation)
function startRealTimeUpdates() {
    setInterval(() => {
        // Simuler la réception d'un nouveau message
        if (Math.random() > 0.8) {
            const newId = Date.now();
            const newMessage = {
                id: newId,
                from: `Parent de l'élève ${Math.floor(Math.random() * 10) + 1}`,
                subject: 'Nouvelle question sur les notes',
                content: 'Pouvez-vous me donner des précisions sur le dernier devoir ?',
                date: new Date().toISOString().split('T')[0],
                read: false,
                type: 'parent'
            };
            teacherData.messages.unshift(newMessage);
            updateUnreadCount();
            showNotification('Nouveau message reçu !', 'info');
        }
    }, 30000); // Toutes les 30 secondes
}