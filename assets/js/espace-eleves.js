// JavaScript complet pour l'espace élèves
document.addEventListener('DOMContentLoaded', function() {
    initializeStudentSpace();
    loadStudentData();
    initializeNavigation();
    initializeQuickActions();
    initializeNotesSystem();
    initializeTimetable();
    initializeHomeworkSystem();
    initializeAbsencesSystem();
    initializeDocumentsSystem();
    initializeProfileSystem();
    checkAuthentication();
    startRealTimeUpdates();
});

// Données simulées de l'élève
const studentData = {
    id: 'eleve001',
    name: 'Jean KOUAME',
    class: '3ème A',
    photo: 'assets/images/student-avatar.jpg',
    stats: {
        average: 14.5,
        homework_pending: 3,
        absences_month: 2,
        class_rank: 7,
        class_total: 32
    },
    grades: {
        1: { // Premier trimestre
            'Mathématiques': { devoir1: 16, devoir2: 14, composition: 15, moyenne: 15.0, coefficient: 4 },
            'Français': { devoir1: 13, devoir2: 15, composition: 14, moyenne: 14.0, coefficient: 4 },
            'Sciences Physiques': { devoir1: 12, devoir2: 16, composition: 13, moyenne: 13.7, coefficient: 3 },
            'Histoire-Géographie': { devoir1: 14, devoir2: 13, composition: 15, moyenne: 14.0, coefficient: 3 },
            'Anglais': { devoir1: 17, devoir2: 16, composition: 18, moyenne: 17.0, coefficient: 3 },
            'SVT': { devoir1: 15, devoir2: 14, composition: 16, moyenne: 15.0, coefficient: 2 },
            'EPS': { devoir1: 18, devoir2: 17, composition: 18, moyenne: 17.7, coefficient: 1 }
        },
        2: { // Deuxième trimestre
            'Mathématiques': { devoir1: 15, devoir2: 13, composition: 14, moyenne: 14.0, coefficient: 4 },
            'Français': { devoir1: 16, devoir2: 14, composition: 15, moyenne: 15.0, coefficient: 4 },
            'Sciences Physiques': { devoir1: 14, devoir2: 15, composition: 14, moyenne: 14.3, coefficient: 3 },
            'Histoire-Géographie': { devoir1: 13, devoir2: 16, composition: 14, moyenne: 14.3, coefficient: 3 },
            'Anglais': { devoir1: 18, devoir2: 17, composition: 17, moyenne: 17.3, coefficient: 3 },
            'SVT': { devoir1: 16, devoir2: 15, composition: 15, moyenne: 15.3, coefficient: 2 },
            'EPS': { devoir1: 17, devoir2: 18, composition: 17, moyenne: 17.3, coefficient: 1 }
        },
        3: { // Troisième trimestre
            'Mathématiques': { devoir1: null, devoir2: null, composition: null, moyenne: 0, coefficient: 4 },
            'Français': { devoir1: null, devoir2: null, composition: null, moyenne: 0, coefficient: 4 },
            'Sciences Physiques': { devoir1: null, devoir2: null, composition: null, moyenne: 0, coefficient: 3 },
            'Histoire-Géographie': { devoir1: null, devoir2: null, composition: null, moyenne: 0, coefficient: 3 },
            'Anglais': { devoir1: null, devoir2: null, composition: null, moyenne: 0, coefficient: 3 },
            'SVT': { devoir1: null, devoir2: null, composition: null, moyenne: 0, coefficient: 2 },
            'EPS': { devoir1: null, devoir2: null, composition: null, moyenne: 0, coefficient: 1 }
        }
    },
    homework: [
        {
            id: 1,
            subject: 'Mathématiques',
            title: 'Exercices Chapitre 5 : Équations du second degré',
            description: 'Résoudre les exercices 15 à 25 page 78 du manuel',
            due_date: '2024-12-15',
            status: 'pending',
            priority: 'urgent'
        },
        {
            id: 2,
            subject: 'Français',
            title: 'Dissertation : L\'amitié dans la littérature',
            description: 'Rédiger une dissertation de 300 mots sur le thème de l\'amitié',
            due_date: '2024-12-18',
            status: 'pending',
            priority: 'normal'
        },
        {
            id: 3,
            subject: 'Anglais',
            title: 'Vocabulary Test Preparation',
            description: 'Study vocabulary from unit 3',
            due_date: '2024-12-16',
            status: 'pending',
            priority: 'normal'
        },
        {
            id: 4,
            subject: 'Histoire-Géographie',
            title: 'Carte des empires coloniaux',
            description: 'Compléter la carte fournie et répondre aux questions',
            due_date: '2024-12-10',
            status: 'submitted',
            priority: 'normal',
            grade: 15
        },
        {
            id: 5,
            subject: 'SVT',
            title: 'Projet sur la cellule végétale',
            description: 'Présenter un exposé sur la structure de la cellule végétale',
            due_date: '2024-11-25',
            status: 'submitted',
            priority: 'low',
            grade: 18
        }
    ],
    absences: [
        { id: 1, date: '2024-11-05', period: 'matin', type: 'absence', status: 'justified', justification_file: 'justificatif_maladie.pdf', reason: 'maladie' },
        { id: 2, date: '2024-11-12', period: 'après-midi', type: 'late', status: 'justified', reason: 'transport' },
        { id: 3, date: '2024-12-02', period: 'journée complète', type: 'absence', status: 'unjustified' }
    ],
    timetable: [
        { day: 'Lundi', time: '08:00', subject: 'Mathématiques', teacher: 'M. Dubois', location: 'Salle 101' },
        { day: 'Lundi', time: '10:00', subject: 'Français', teacher: 'Mme. Martin', location: 'Salle 203' },
        { day: 'Mardi', time: '09:00', subject: 'Sciences Physiques', teacher: 'M. Lambert', location: 'Labo Physique' },
        { day: 'Mardi', time: '11:00', subject: 'Anglais', teacher: 'Mme. Leblanc', location: 'Salle 205' },
        { day: 'Mercredi', time: '08:00', subject: 'Histoire-Géographie', teacher: 'Mme. Rossi', location: 'Salle 102' },
        { day: 'Jeudi', time: '10:00', subject: 'SVT', teacher: 'M. Petit', location: 'Labo SVT' },
        { day: 'Vendredi', time: '09:00', subject: 'EPS', teacher: 'M. Dupont', location: 'Gymnase' },
        { day: 'Vendredi', time: '14:00', subject: 'Mathématiques', teacher: 'M. Dubois', location: 'Salle 101' }
    ],
    documents: [
        { id: 1, title: 'Règlement Intérieur 2024-2025', date: '2024-09-01', category: 'administratif', file: 'reglement-interieur-2024.pdf' },
        { id: 2, title: 'Certificat de scolarité', date: '2024-10-15', category: 'personnel', file: 'certificat-scolarite.pdf' },
        { id: 3, title: 'Relevé de notes T1', date: '2024-12-10', category: 'notes', file: 'releve-notes-t1.pdf' }
    ]
};

// Fonctions d'initialisation globales
function initializeStudentSpace() {
    console.log('Espace élève initialisé');
}

function loadStudentData() {
    updateUserInfo();
    loadDashboardStats();
    loadGrades();
    loadHomework();
    loadAbsences();
    loadTimetable();
    loadDocuments();
    loadProfile();
}

function updateUserInfo() {
    document.getElementById('student-name').textContent = studentData.name;
    document.getElementById('student-class').textContent = studentData.class;
    document.getElementById('profile-photo').src = studentData.photo;
}

function checkAuthentication() {
    // Logique de vérification d'authentification (à implémenter)
    console.log('Vérification de l\'authentification...');
}

// Fonction de navigation
function initializeNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
            updateActiveNav(this);
        });
    });
}

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-gray-100');
    });
    activeLink.classList.add('bg-gray-100');
}

// Fonction des actions rapides
function initializeQuickActions() {
    document.getElementById('quick-view-grades').addEventListener('click', () => {
        showSection('grades');
        updateActiveNav(document.querySelector('.nav-link[href="#grades"]'));
    });
    document.getElementById('quick-submit-homework').addEventListener('click', () => {
        showSection('homework');
        updateActiveNav(document.querySelector('.nav-link[href="#homework"]'));
    });
    document.getElementById('quick-view-absences').addEventListener('click', () => {
        showSection('absences');
        updateActiveNav(document.querySelector('.nav-link[href="#absences"]'));
    });
}

// Fonctions du tableau de bord
function loadDashboardStats() {
    document.getElementById('dashboard-average').textContent = studentData.stats.average.toFixed(1);
    document.getElementById('dashboard-rank').textContent = studentData.stats.class_rank;
    document.getElementById('dashboard-total').textContent = studentData.stats.class_total;
    document.getElementById('dashboard-homework-count').textContent = studentData.stats.homework_pending;
    document.getElementById('dashboard-absences-count').textContent = studentData.stats.absences_month;
}

// Fonctions du système de notes
function initializeNotesSystem() {
    document.querySelectorAll('.grade-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const trimester = this.getAttribute('data-trimester');
            document.querySelectorAll('.grade-filter-btn').forEach(b => b.classList.remove('bg-gray-200', 'font-semibold'));
            this.classList.add('bg-gray-200', 'font-semibold');
            displayGrades(trimester);
        });
    });
}

function loadGrades() {
    displayGrades('1'); // Afficher le premier trimestre par défaut
}

function displayGrades(trimester) {
    const gradesContainer = document.getElementById('grades-container');
    gradesContainer.innerHTML = '';
    const grades = studentData.grades[trimester];

    if (!grades) {
        gradesContainer.innerHTML = '<p class="text-gray-500">Aucune note disponible pour ce trimestre.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'min-w-full divide-y divide-gray-200';
    table.innerHTML = `
        <thead class="bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devoir 1</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devoir 2</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Composition</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moyenne</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coefficient</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200" id="grades-table-body">
        </tbody>
    `;
    gradesContainer.appendChild(table);

    const tableBody = document.getElementById('grades-table-body');
    let totalPoints = 0;
    let totalCoeff = 0;

    for (const subject in grades) {
        const gradeInfo = grades[subject];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${subject}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gradeInfo.devoir1 !== null ? gradeInfo.devoir1 : '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gradeInfo.devoir2 !== null ? gradeInfo.devoir2 : '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gradeInfo.composition !== null ? gradeInfo.composition : '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">${gradeInfo.moyenne.toFixed(1)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gradeInfo.coefficient}</td>
        `;
        tableBody.appendChild(row);

        totalPoints += gradeInfo.moyenne * gradeInfo.coefficient;
        totalCoeff += gradeInfo.coefficient;
    }

    const generalAverage = totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : 'N/A';
    const averageRow = document.createElement('tfoot');
    averageRow.innerHTML = `
        <tr class="bg-gray-100 font-bold">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Moyenne Générale</td>
            <td colspan="3"></td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${generalAverage}</td>
            <td></td>
        </tr>
    `;
    table.appendChild(averageRow);
}

// Fonctions du système d'emploi du temps
function initializeTimetable() {
    const timetableContainer = document.getElementById('timetable-container');
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    daysOfWeek.forEach(day => {
        const dailySchedule = studentData.timetable.filter(course => course.day === day);
        if (dailySchedule.length > 0) {
            const daySection = document.createElement('div');
            daySection.className = 'mb-6';
            daySection.innerHTML = `<h3 class="text-xl font-bold text-gray-800 mb-2">${day}</h3>`;
            
            dailySchedule.forEach(course => {
                const courseDiv = document.createElement('div');
                courseDiv.className = 'bg-white p-4 rounded-lg shadow-md mb-2 border-l-4 border-indigo-500';
                courseDiv.innerHTML = `
                    <p class="text-sm text-gray-500">${course.time}</p>
                    <h4 class="text-lg font-semibold text-gray-900">${course.subject}</h4>
                    <p class="text-sm text-gray-600">Prof: ${course.teacher} - Salle: ${course.location}</p>
                `;
                daySection.appendChild(courseDiv);
            });
            timetableContainer.appendChild(daySection);
        }
    });

    if (timetableContainer.innerHTML === '') {
        timetableContainer.innerHTML = '<p class="text-gray-500">Aucun emploi du temps disponible pour le moment.</p>';
    }
}

// Fonctions du système de devoirs
function initializeHomeworkSystem() {
    document.querySelectorAll('.homework-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');
            document.querySelectorAll('.homework-filter-btn').forEach(b => b.classList.remove('bg-gray-200', 'font-semibold'));
            this.classList.add('bg-gray-200', 'font-semibold');
            filterHomework(filterType);
        });
    });
    updateHomeworkFilterCounts();
}

function loadHomework() {
    const homeworkList = document.getElementById('homework-list');
    homeworkList.innerHTML = '';
    studentData.homework.forEach(homework => {
        const homeworkElement = createHomeworkElement(homework);
        homeworkList.appendChild(homeworkElement);
    });
    addHomeworkEventListeners();
    updateHomeworkFilterCounts();
}

function updateHomeworkFilterCounts() {
    const allCount = studentData.homework.length;
    const pendingCount = studentData.homework.filter(h => h.status === 'pending').length;
    const submittedCount = studentData.homework.filter(h => h.status === 'submitted').length;

    document.getElementById('all-homework-count').textContent = allCount;
    document.getElementById('pending-homework-count').textContent = pendingCount;
    document.getElementById('submitted-homework-count').textContent = submittedCount;
}

function createHomeworkElement(homework) {
    const div = document.createElement('div');
    const now = new Date();
    const dueDate = new Date(homework.due_date);
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    let bgColor, borderColor, statusText, statusClass, dueDateText, dueDateColor;

    if (homework.status === 'submitted') {
        bgColor = 'bg-green-50';
        borderColor = 'border-green-500';
        statusText = 'Rendu';
        statusClass = 'bg-green-500';
        dueDateText = `Rendu le ${new Date(homework.submitted_date).toLocaleDateString('fr-FR')}`;
        dueDateColor = 'text-green-600';
    } else {
        statusText = 'En cours';
        statusClass = 'bg-orange-500';
        
        if (daysLeft < 0) {
            bgColor = 'bg-red-50';
            borderColor = 'border-red-500';
            dueDateText = 'En retard';
            dueDateColor = 'text-red-600';
        } else if (daysLeft <= 3) {
            bgColor = 'bg-yellow-50';
            borderColor = 'border-yellow-500';
            dueDateText = `Échéance proche (${daysLeft}j)`;
            dueDateColor = 'text-yellow-600';
        } else {
            bgColor = 'bg-gray-50';
            borderColor = 'border-gray-500';
            dueDateText = `Reste ${daysLeft} jours`;
            dueDateColor = 'text-gray-600';
        }
    }

    div.className = `devoir-item ${bgColor} border-l-4 ${borderColor} p-4 rounded-r-lg transition-all hover:shadow-md`;
    div.setAttribute('data-status', homework.status);
    div.setAttribute('data-id', homework.id);
    
    div.innerHTML = `
        <div class="flex items-start justify-between">
            <div class="flex-1">
                <div class="flex items-center mb-2">
                    <span class="${statusClass} text-white text-xs px-2 py-1 rounded font-medium">${statusText}</span>
                    <span class="ml-2 text-sm font-medium text-gray-900 bg-white px-2 py-1 rounded">${homework.subject}</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">${homework.title}</h3>
                <p class="text-sm text-gray-600 mb-2">${homework.description}</p>
                <div class="flex items-center text-xs text-gray-500">
                    <i class="fas fa-calendar mr-1"></i>
                    <span>À rendre le : ${new Date(homework.due_date).toLocaleDateString('fr-FR')}</span>
                    <span class="ml-4 ${dueDateColor}">${dueDateText}</span>
                    ${homework.grade ? `<span class="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Note: ${homework.grade}/20</span>` : ''}
                </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
                ${homework.status === 'submitted' ? 
                    '<button class="bg-gray-300 text-gray-600 px-3 py-1 text-xs rounded cursor-not-allowed" disabled><i class="fas fa-check mr-1"></i>Rendu</button>' :
                    '<button class="submit-homework bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 transition-colors" data-homework-id="' + homework.id + '"><i class="fas fa-upload mr-1"></i>Rendre</button>'
                }
                <button class="download-homework text-gray-500 hover:text-gray-700 transition-colors" data-homework-id="${homework.id}" title="${homework.status === 'submitted' ? 'Voir le devoir' : 'Télécharger le sujet'}">
                    <i class="fas fa-${homework.status === 'submitted' ? 'eye' : 'download'}"></i>
                </button>
            </div>
        </div>
    `;
    
    return div;
}

// Ajouter les événements aux boutons de devoirs
function addHomeworkEventListeners() {
    // Boutons de soumission
    document.querySelectorAll('.submit-homework').forEach(btn => {
        btn.addEventListener('click', function() {
            const homeworkId = parseInt(this.getAttribute('data-homework-id'));
            submitHomework(homeworkId);
        });
    });
    
    // Boutons de téléchargement/visualisation
    document.querySelectorAll('.download-homework').forEach(btn => {
        btn.addEventListener('click', function() {
            const homeworkId = parseInt(this.getAttribute('data-homework-id'));
            downloadHomework(homeworkId);
        });
    });
}

// Soumettre un devoir
function submitHomework(homeworkId) {
    const homework = studentData.homework.find(h => h.id === homeworkId);
    if (!homework) return;
    
    // Créer une modal de soumission
    const modal = createSubmissionModal(homework);
    document.body.appendChild(modal);
    
    // Afficher la modal
    modal.classList.remove('hidden');
}

// Créer la modal de soumission de devoir
function createSubmissionModal(homework) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
    modal.id = 'submission-modal';
    
    modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Soumettre le devoir</h3>
                    <button id="close-submission-modal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mb-4">
                    <h4 class="font-medium text-gray-800">${homework.title}</h4>
                    <p class="text-sm text-gray-600">${homework.subject}</p>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Fichier à joindre (optionnel)
                    </label>
                    <input type="file" id="homework-file" class="w-full border border-gray-300 rounded-md px-3 py-2" accept=".pdf,.doc,.docx,.jpg,.png">
                    <p class="text-xs text-gray-500 mt-1">Formats acceptés: PDF, DOC, DOCX, JPG, PNG</p>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Commentaire (optionnel)
                    </label>
                    <textarea id="homework-comment" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Ajoutez un commentaire..."></textarea>
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" id="cancel-submission" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                        Annuler
                    </button>
                    <button type="button" id="confirm-submission" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        <i class="fas fa-upload mr-2"></i>Soumettre
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter les événements
    modal.querySelector('#close-submission-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-submission').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#confirm-submission').addEventListener('click', () => {
        confirmHomeworkSubmission(homework, modal);
    });
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    return modal;
}

// Confirmer la soumission du devoir
function confirmHomeworkSubmission(homework, modal) {
    const fileInput = modal.querySelector('#homework-file');
    const commentInput = modal.querySelector('#homework-comment');
    
    showNotification('Soumission en cours...', 'info');
    
    // Simuler l'upload
    setTimeout(() => {
        // Mettre à jour le devoir
        homework.status = 'submitted';
        homework.submitted_date = new Date().toISOString().split('T')[0];
        homework.file = fileInput.files[0] ? fileInput.files[0].name : null;
        homework.comment = commentInput.value.trim() || null;
        
        showNotification('Devoir soumis avec succès !', 'success');
        
        // Fermer la modal
        document.body.removeChild(modal);
        
        // Recharger les devoirs
        loadHomework();
        
        // Mettre à jour les stats du dashboard
        updateHomeworkFilterCounts();
        
    }, 2000);
}

// Télécharger un devoir
function downloadHomework(homeworkId) {
    const homework = studentData.homework.find(h => h.id === homeworkId);
    if (!homework) return;
    
    showNotification(`${homework.status === 'submitted' ? 'Ouverture' : 'Téléchargement'} en cours...`, 'info');
    
    setTimeout(() => {
        if (homework.status === 'submitted') {
            showNotification('Document ouvert !', 'success');
        } else {
            showNotification('Sujet téléchargé !', 'success');
        }
    }, 1500);
}

// Filtrer les devoirs
function filterHomework(filterType) {
    const homeworkItems = document.querySelectorAll('.devoir-item');
    
    homeworkItems.forEach(item => {
        const status = item.getAttribute('data-status');
        let show = true;
        
        switch (filterType) {
            case 'pending':
                show = status === 'pending';
                break;
            case 'submitted':
                show = status === 'submitted';
                break;
            case 'all':
            default:
                show = true;
                break;
        }
        
        if (show) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Système d'absences
function initializeAbsencesSystem() {
    // Les événements pour justifier les absences seront ajoutés lors du chargement
}

// Chargement des absences
function loadAbsences() {
    const absencesContainer = document.getElementById('absences-container');
    absencesContainer.innerHTML = '';

    const stats = calculateAbsenceStats();
    updateAbsenceStats(stats);
    
    if (studentData.absences.length === 0) {
        absencesContainer.innerHTML = '<p class="text-gray-500">Aucune absence ou retard enregistré.</p>';
    } else {
        const table = document.createElement('table');
        table.className = 'min-w-full divide-y divide-gray-200';
        table.innerHTML = `
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200" id="absences-table-body">
            </tbody>
        `;
        absencesContainer.appendChild(table);

        const tableBody = document.getElementById('absences-table-body');
        studentData.absences.forEach(absence => {
            const row = document.createElement('tr');
            const statusClass = absence.status === 'unjustified' ? 'text-red-600' : 'text-green-600';
            const statusText = absence.status === 'unjustified' ? 'Non justifiée' : 'Justifiée';
            const buttonHtml = absence.status === 'unjustified' ? 
                `<button class="justify-absence-btn px-2 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600" data-absence-id="${absence.id}">Justifier</button>` : 
                `<span class="text-xs text-gray-500">Document joint</span>`;

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${new Date(absence.date).toLocaleDateString('fr-FR')}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${absence.period}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${absence.type === 'absence' ? 'Absence' : 'Retard'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${statusClass}">${statusText}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${buttonHtml}</td>
            `;
            tableBody.appendChild(row);
        });

        // Ajouter les événements pour justifier les absences
        document.querySelectorAll('.justify-absence-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const absenceId = parseInt(this.getAttribute('data-absence-id'));
                justifyAbsence(absenceId);
            });
        });
    }

    showNotification('Absences chargées', 'success');
}

// Calculer les statistiques d'absences
function calculateAbsenceStats() {
    const absences = studentData.absences;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    let unjustified = 0;
    let justified = 0;
    let lates = 0;
    let thisMonthAbsences = 0;
    let totalDays = 0;
    
    absences.forEach(absence => {
        const absenceDate = new Date(absence.date);
        const isThisMonth = absenceDate.getMonth() === thisMonth && absenceDate.getFullYear() === thisYear;
        
        if (absence.type === 'absence') {
            if (absence.status === 'unjustified') {
                unjustified++;
            } else {
                justified++;
            }
            
            if (isThisMonth) {
                thisMonthAbsences++;
            }
            
            // Compter les jours (journée complète = 1, demi-journée = 0.5)
            if (absence.period.includes('journée complète')) {
                totalDays += 1;
            } else if (absence.period.includes('demi-journée')) {
                totalDays += 0.5;
            } else {
                totalDays += 0.2; // Une heure de cours
            }
        } else if (absence.type === 'late') {
            lates++;
        }
    });
    
    // Calculer le taux de présence (simulation sur 100 jours de cours)
    const totalSchoolDays = 100;
    const presenceRate = Math.max(0, ((totalSchoolDays - totalDays) / totalSchoolDays) * 100);
    
    return {
        unjustified,
        justified,
        lates,
        thisMonthAbsences,
        presenceRate: Math.round(presenceRate)
    };
}

// Mettre à jour les statistiques d'absences
function updateAbsenceStats(stats) {
    // Mettre à jour les cartes de statistiques
    const unjustifiedEl = document.querySelector('.bg-red-50 .text-red-700');
    const justifiedEl = document.querySelector('.bg-yellow-50 .text-yellow-700');
    const latesEl = document.querySelector('.bg-orange-50 .text-orange-700');
    const presenceEl = document.querySelector('.bg-blue-50 .text-blue-700');
    
    if (unjustifiedEl) unjustifiedEl.textContent = stats.unjustified;
    if (justifiedEl) justifiedEl.textContent = stats.justified;
    if (latesEl) latesEl.textContent = stats.lates;
    if (presenceEl) presenceEl.textContent = `${stats.presenceRate}%`;
    
    // Mettre à jour les stats du dashboard
    studentData.stats.absences_month = stats.thisMonthAbsences;
    loadDashboardStats();
}

// Justifier une absence
function justifyAbsence(absenceId) {
    const absence = studentData.absences.find(a => a.id === absenceId);
    if (!absence) return;
    
    // Créer une modal de justification
    const modal = createJustificationModal(absence);
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
}

// Créer la modal de justification d'absence
function createJustificationModal(absence) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
    modal.id = 'justification-modal';
    
    modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Justifier l'absence</h3>
                    <button id="close-justification-modal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mb-4">
                    <p class="text-sm text-gray-600">Date: ${new Date(absence.date).toLocaleDateString('fr-FR')}</p>
                    <p class="text-sm text-gray-600">Période: ${absence.period}</p>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Motif de l'absence *
                    </label>
                    <select id="absence-reason" class="w-full border border-gray-300 rounded-md px-3 py-2" required>
                        <option value="">Sélectionner un motif</option>
                        <option value="maladie">Maladie</option>
                        <option value="rdv_medical">Rendez-vous médical</option>
                        <option value="urgence_familiale">Urgence familiale</option>
                        <option value="transport">Problème de transport</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Justificatif
                    </label>
                    <input type="file" id="justification-file" class="w-full border border-gray-300 rounded-md px-3 py-2" accept=".pdf,.jpg,.png">
                    <p class="text-xs text-gray-500 mt-1">Certificat médical, justificatif, etc.</p>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Commentaire
                    </label>
                    <textarea id="justification-comment" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Détails supplémentaires..."></textarea>
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" id="cancel-justification" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                        Annuler
                    </button>
                    <button type="button" id="submit-justification" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        <i class="fas fa-check mr-2"></i>Envoyer
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter les événements
    modal.querySelector('#close-justification-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-justification').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#submit-justification').addEventListener('click', () => {
        submitJustification(absence, modal);
    });
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    return modal;
}

// Soumettre la justification
function submitJustification(absence, modal) {
    const reasonSelect = modal.querySelector('#absence-reason');
    const fileInput = modal.querySelector('#justification-file');
    const commentInput = modal.querySelector('#justification-comment');
    
    if (!reasonSelect.value) {
        showNotification('Veuillez sélectionner un motif', 'error');
        return;
    }
    
    showNotification('Envoi de la justification...', 'info');
    
    setTimeout(() => {
        // Mettre à jour l'absence
        absence.status = 'justified';
        absence.reason = reasonSelect.value;
        absence.justification_file = fileInput.files[0] ? fileInput.files[0].name : null;
        absence.comment = commentInput.value.trim() || null;
        
        showNotification('Justification envoyée avec succès !', 'success');
        
        // Fermer la modal
        document.body.removeChild(modal);
        
        // Recharger les absences
        loadAbsences();
        
    }, 2000);
}

// Système de documents
function initializeDocumentsSystem() {
    // Les filtres seront initialisés lors du chargement
}

// Chargement des documents
function loadDocuments() {
    const documentsContainer = document.getElementById('documents-container');
    documentsContainer.innerHTML = '';

    studentData.documents.forEach(doc => {
        const docElement = createDocumentElement(doc);
        documentsContainer.appendChild(docElement);
    });

    if (documentsContainer.innerHTML === '') {
        documentsContainer.innerHTML = '<p class="text-gray-500">Aucun document disponible pour le moment.</p>';
    }

    // Filtres de documents
    const docFilters = document.querySelectorAll('.doc-filter');
    docFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Mise à jour visuelle
            docFilters.forEach(f => {
                f.classList.remove('bg-indigo-100', 'text-indigo-700');
                f.classList.add('text-gray-600', 'hover:bg-gray-100');
            });
            this.classList.add('bg-indigo-100', 'text-indigo-700');
            this.classList.remove('text-gray-600', 'hover:bg-gray-100');
            
            // Filtrer les documents
            filterDocuments(category);
        });
    });
    
    // Boutons d'action sur les documents existants
    document.querySelectorAll('.document-item .fa-eye').forEach(btn => {
        btn.addEventListener('click', function() {
            const docItem = this.closest('.document-item');
            const title = docItem.querySelector('h3').textContent;
            viewDocument(title);
        });
    });
    
    document.querySelectorAll('.document-item .fa-download').forEach(btn => {
        btn.addEventListener('click', function() {
            const docItem = this.closest('.document-item');
            const title = docItem.querySelector('h3').textContent;
            downloadDocument(title);
        });
    });
    
    // Boutons de demande de nouveaux documents
    const requestButtons = document.querySelectorAll('.request-doc-btn');
    requestButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const docType = this.textContent.trim();
            requestDocument(docType);
        });
    });
    
    showNotification('Documents chargés', 'success');
}

function createDocumentElement(doc) {
    const div = document.createElement('div');
    div.className = 'document-item bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105';
    div.setAttribute('data-category', doc.category);
    div.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas fa-file-pdf text-red-500 text-2xl mr-3"></i>
                <div>
                    <h3 class="font-medium text-gray-900">${doc.title}</h3>
                    <p class="text-xs text-gray-500">Ajouté le ${new Date(doc.date).toLocaleDateString('fr-FR')}</p>
                </div>
            </div>
            <div class="flex space-x-3 text-gray-400">
                <button class="hover:text-gray-600" title="Voir">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="hover:text-gray-600" title="Télécharger">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </div>
    `;
    return div;
}

// Voir un document
function viewDocument(title) {
    showNotification(`Ouverture du document: ${title}`, 'info');
    
    setTimeout(() => {
        showNotification('Document ouvert dans un nouvel onglet', 'success');
        // Simuler l'ouverture dans un nouvel onglet
        // window.open(`/documents/view/${title}`, '_blank');
    }, 1500);
}

// Télécharger un document
function downloadDocument(title) {
    showNotification(`Téléchargement: ${title}`, 'info');
    
    setTimeout(() => {
        showNotification('Document téléchargé avec succès !', 'success');
        // Simuler le téléchargement
        // const link = document.createElement('a');
        // link.download = title + '.pdf';
        // link.click();
    }, 2000);
}

// Demander un nouveau document
function requestDocument(docType) {
    if (confirm(`Demander un nouveau document: ${docType}?\n\nVous recevrez une notification une fois le document prêt.`)) {
        showNotification(`Demande envoyée pour: ${docType}`, 'success');
        
        // Ajouter à la liste des documents (simulation)
        setTimeout(() => {
            showNotification('Votre document sera disponible dans 2-3 jours ouvrables', 'info');
        }, 2000);
    }
}

// Filtrer les documents
function filterDocuments(category) {
    const documents = document.querySelectorAll('.document-item');
    
    documents.forEach(doc => {
        const docCategory = doc.getAttribute('data-category');
        
        if (category === 'all' || docCategory === category) {
            doc.style.display = 'block';
        } else {
            doc.style.display = 'none';
        }
    });
}

// Système de profil
function initializeProfileSystem() {
    const saveBtn = document.getElementById('save-profile-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProfile);
    }
    const changePhotoBtn = document.getElementById('change-photo-btn');
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', changeProfilePhoto);
    }
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', changePassword);
    }
}

// Chargement du profil
function loadProfile() {
    showNotification('Profil chargé', 'success');
    
    // Pré-remplir les champs avec les données de l'étudiant
    const emailField = document.querySelector('input[type="email"]');
    const phoneField = document.querySelector('input[type="tel"]');
    
    if (emailField) {
        emailField.value = `${studentData.name.toLowerCase().replace(' ', '.')}.etudiant@example.com`;
    }
    
    if (phoneField) {
        // Ajouter un numéro de téléphone simulé si nécessaire
        phoneField.value = '01 23 45 67 89';
    }
}

// Sauvegarder le profil
function saveProfile() {
    const emailField = document.querySelector('input[type="email"]');
    const phoneField = document.querySelector('input[type="tel"]');
    
    // Validation
    if (emailField && !isValidEmail(emailField.value)) {
        showNotification('Adresse email invalide', 'error');
        return;
    }
    
    if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
        showNotification('Numéro de téléphone invalide', 'error');
        return;
    }
    
    showNotification('Sauvegarde du profil...', 'info');
    
    setTimeout(() => {
        showNotification('Profil mis à jour avec succès !', 'success');
    }, 1500);
}

// Changer la photo de profil
function changeProfilePhoto() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB
                showNotification('La photo ne doit pas dépasser 2MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoElements = document.querySelectorAll('img[alt="Photo"]');
                photoElements.forEach(img => {
                    img.src = e.target.result;
                });
                showNotification('Photo de profil mise à jour !', 'success');
            };
            reader.readAsDataURL(file);
        }
        
        document.body.removeChild(fileInput);
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
}

// Changer le mot de passe
function changePassword() {
    const currentPassword = document.querySelector('#current-password');
    const newPassword = document.querySelector('#new-password');
    const confirmPassword = document.querySelector('#confirm-password');
    
    if (!currentPassword.value) {
        showNotification('Veuillez saisir votre mot de passe actuel', 'error');
        return;
    }
    if (!newPassword.value || newPassword.value.length < 6) {
        showNotification('Le nouveau mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    showNotification('Mise à jour du mot de passe...', 'info');
    
    setTimeout(() => {
        showNotification('Mot de passe mis à jour avec succès !', 'success');
        
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    }, 2000);
}

// Mise à jour en temps réel (simulation)
function startRealTimeUpdates() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000); 
    checkForUpdates();
    setInterval(checkForUpdates, 30000); 
    checkUpcomingHomework();
    setInterval(checkUpcomingHomework, 3600000); 
}

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    document.querySelectorAll('.current-time').forEach(element => {
        element.textContent = timeString;
    });
}

function checkForUpdates() {
    const updates = [
        'Nouvelle note disponible en Mathématiques',
        'Rappel: Devoir de Français à rendre demain',
        'Modification d\'horaire pour le cours d\'Anglais'
    ];
    
    if (Math.random() < 0.3) { 
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        showNotification(randomUpdate, 'info');
    }
}

function checkUpcomingHomework() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    const upcomingHomework = studentData.homework.filter(h => 
        h.status === 'pending' && h.due_date === tomorrowString
    );
    
    if (upcomingHomework.length > 0) {
        const titles = upcomingHomework.map(h => h.title).join(', ');
        showNotification(`Rappel: ${upcomingHomework.length} devoir(s) à rendre demain: ${titles}`, 'warning');
    }
}

// Fonctions utilitaires
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) return;

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
            icon = 'fas fa-times-circle';
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

    notification.className = `${bgColor} ${textColor} p-4 rounded-lg shadow-lg mb-4 flex items-center transition-all duration-300 transform translate-x-full`;
    notification.innerHTML = `<i class="${icon} mr-3"></i><span>${message}</span>`;
    
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
        notification.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValidPhone(phone) {
    const re = /^\d{10}$/;
    return re.test(String(phone).replace(/\s/g, ''));
}