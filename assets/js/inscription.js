document.addEventListener('DOMContentLoaded', () => {

    // --- Données simulées (remplacez-les par des appels API réels plus tard) ---
    const parentData = {
        name: 'Mme KOUAME',
        children: {
            jean: {
                name: 'Jean KOUAME',
                class: '3ème A',
                id: 'eleve001',
                dashboard: {
                    average: 14.5,
                    presence: '94%',
                    homework: 3,
                    rank: '7/32'
                },
                notes: {
                    '1': [
                        { subject: 'Mathématiques', d1: 12, d2: 15, compo: 14, average: 13.75, comments: 'Progression à encourager' },
                        { subject: 'Français', d1: 16, d2: 14, compo: 15.5, average: 15.17, comments: 'Excellents résultats' },
                        { subject: 'Anglais', d1: 11, d2: 13, compo: 12, average: 12.0, comments: 'Peut mieux faire à l\'oral' },
                        { subject: 'Histoire-Géo', d1: 17, d2: 16, compo: 16.5, average: 16.5, comments: 'Très bon niveau' },
                        { subject: 'SVT', d1: 10, d2: 9, compo: 11, average: 10.0, comments: 'Manque de rigueur' },
                    ],
                    '2': [
                        // Ajoutez les notes du 2ème trimestre ici
                    ],
                    '3': [
                        // Ajoutez les notes du 3ème trimestre ici
                    ]
                },
                absences: [
                    { date: '05/09/2025', event: 'Cours de Mathématiques', type: 'Absence', duration: '1h', status: 'Non Justifiée', comments: 'Aucun motif fourni' },
                    { date: '03/09/2025', event: 'Entrée en classe', type: 'Retard', duration: '15 min', status: 'Justifié', comments: 'Rendez-vous médical' },
                ],
                homeworks: [
                    { subject: 'Français', title: 'Rédaction sur le thème de la liberté', dueDate: '20/09/2025', status: 'À faire' },
                    { subject: 'Mathématiques', title: 'Exercices sur les équations', dueDate: '18/09/2025', status: 'À faire' },
                    { subject: 'SVT', title: 'Préparation d\'un exposé', dueDate: '25/09/2025', status: 'À faire' },
                    { subject: 'Histoire-Géo', title: 'Résumé du chapitre sur la Révolution française', dueDate: '10/09/2025', status: 'Terminé' },
                ],
                performance: {
                    labels: ['Sep', 'Oct', 'Nov', 'Déc'],
                    data: [13.5, 14.2, 14.0, 14.5]
                }
            }
        }
    };

    // --- Éléments du DOM ---
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const childSelectors = document.querySelectorAll('select[id$="-selector"]');
    const notesTableBody = document.getElementById('notes-table-parent');
    const absencesTableBody = document.getElementById('absences-table-parent');
    const devoirsList = document.getElementById('devoirs-list-parent');
    const trimestreBtns = document.querySelectorAll('.trimestre-btn');
    const commTabs = document.querySelectorAll('.comm-tab');
    const commContents = document.querySelectorAll('.comm-content');
    let performanceChart = null; // Variable pour stocker l'instance du graphique

    // --- Fonctions utilitaires ---

    /**
     * Met à jour l'interface utilisateur avec les données de l'enfant sélectionné.
     * @param {string} childId - L'identifiant de l'enfant (e.g., 'jean').
     */
    const updateUI = (childId) => {
        const child = parentData.children[childId];
        if (!child) return;

        // Mise à jour du tableau de bord
        document.getElementById('child-average').textContent = child.dashboard.average;
        document.getElementById('child-presence').textContent = child.dashboard.presence;
        document.getElementById('child-homework').textContent = child.dashboard.homework;
        document.getElementById('child-rank').textContent = child.dashboard.rank;

        // Mise à jour du graphique des notes
        updateChart(child.performance.labels, child.performance.data);

        // Mise à jour de la table des notes (par défaut, 1er trimestre)
        updateNotesTable(child.notes['1']);

        // Mise à jour de la table des absences
        updateAbsencesTable(child.absences);
        
        // Mise à jour de la liste des devoirs
        updateHomeworksList(child.homeworks);
    };

    /**
     * Affiche la section de contenu correspondant au bouton de navigation cliqué.
     * @param {string} sectionId - L'identifiant de la section à afficher.
     */
    const showSection = (sectionId) => {
        contentSections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');

        navItems.forEach(item => {
            item.classList.remove('bg-green-100', 'text-green-700');
            item.classList.add('text-gray-600', 'hover:bg-gray-100');
        });
        document.querySelector(`.nav-item[data-section="${sectionId}"]`).classList.add('bg-green-100', 'text-green-700');
        document.querySelector(`.nav-item[data-section="${sectionId}"]`).classList.remove('text-gray-600', 'hover:bg-gray-100');
    };

    /**
     * Met à jour la table des notes avec les données du trimestre sélectionné.
     * @param {Array<Object>} notes - Le tableau des notes à afficher.
     */
    const updateNotesTable = (notes) => {
        notesTableBody.innerHTML = ''; // Vide la table existante
        if (notes.length === 0) {
            notesTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">Aucune note disponible pour ce trimestre.</td></tr>';
            return;
        }

        notes.forEach(note => {
            const row = document.createElement('tr');
            row.classList.add('hover:bg-gray-50');
            row.innerHTML = `
                <td class="px-4 py-3 text-sm font-medium text-gray-900">${note.subject}</td>
                <td class="px-4 py-3 text-center text-sm text-gray-600">${note.d1 || '-'}</td>
                <td class="px-4 py-3 text-center text-sm text-gray-600">${note.d2 || '-'}</td>
                <td class="px-4 py-3 text-center text-sm text-gray-600">${note.compo || '-'}</td>
                <td class="px-4 py-3 text-center font-bold text-gray-900">${note.average.toFixed(2)}</td>
                <td class="px-4 py-3 text-left text-sm text-gray-600">${note.comments}</td>
            `;
            notesTableBody.appendChild(row);
        });
    };
    
    /**
     * Met à jour la table des absences.
     * @param {Array<Object>} absences - Le tableau des absences à afficher.
     */
    const updateAbsencesTable = (absences) => {
        absencesTableBody.innerHTML = '';
        if (absences.length === 0) {
            absencesTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">Aucune absence ou retard récent.</td></tr>';
            return;
        }

        absences.forEach(absence => {
            const statusClass = absence.status === 'Justifié' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
            const row = document.createElement('tr');
            row.classList.add('hover:bg-gray-50');
            row.innerHTML = `
                <td class="px-4 py-3 text-sm text-gray-600">${absence.date}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${absence.event}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${absence.type}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${absence.duration}</td>
                <td class="px-4 py-3 text-center">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">${absence.status}</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">${absence.comments}</td>
            `;
            absencesTableBody.appendChild(row);
        });
    };

    /**
     * Met à jour la liste des devoirs.
     * @param {Array<Object>} homeworks - Le tableau des devoirs à afficher.
     */
    const updateHomeworksList = (homeworks) => {
        devoirsList.innerHTML = '';
        if (homeworks.length === 0) {
            devoirsList.innerHTML = '<div class="text-center py-4 text-gray-500">Aucun devoir en cours.</div>';
            return;
        }

        homeworks.forEach(hw => {
            const statusClass = hw.status === 'À faire' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
            const statusIcon = hw.status === 'À faire' ? 'fas fa-exclamation-circle text-yellow-500' : 'fas fa-check-circle text-green-500';

            const item = document.createElement('div');
            item.classList.add('p-4', 'border', 'border-gray-200', 'rounded-lg');
            item.innerHTML = `
                <div class="flex items-start">
                    <i class="${statusIcon} text-lg mr-4 mt-1"></i>
                    <div class="flex-grow">
                        <div class="flex items-center justify-between">
                            <h4 class="font-semibold text-gray-900">${hw.title}</h4>
                            <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">${hw.status}</span>
                        </div>
                        <p class="text-sm text-gray-600">Matière : ${hw.subject}</p>
                        <p class="text-sm text-gray-500 mt-1">Date limite : ${hw.dueDate}</p>
                    </div>
                </div>
            `;
            devoirsList.appendChild(item);
        });
    };

    /**
     * Met à jour ou initialise le graphique de performance.
     * @param {Array<string>} labels - Les étiquettes pour l'axe X.
     * @param {Array<number>} data - Les données pour l'axe Y.
     */
    const updateChart = (labels, data) => {
        const ctx = document.getElementById('performance-chart').getContext('2d');
        if (performanceChart) {
            performanceChart.destroy();
        }
        performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Moyenne générale',
                    data: data,
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 20,
                        title: {
                            display: true,
                            text: 'Moyenne / 20'
                        }
                    }
                }
            }
        });
    };

    // --- Gestion des événements ---

    // Navigation dans la sidebar
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            showSection(section);
        });
    });

    // Changement d'enfant (si plusieurs)
    childSelectors.forEach(selector => {
        selector.addEventListener('change', (event) => {
            const childId = event.target.value;
            updateUI(childId);
        });
    });

    // Changement de trimestre dans la section "Notes"
    trimestreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const trimestre = btn.dataset.trimestre;
            const currentChildId = document.getElementById('notes-child-selector').value;
            const childNotes = parentData.children[currentChildId].notes[trimestre];
            updateNotesTable(childNotes);

            // Gérer les classes actives des boutons
            trimestreBtns.forEach(b => {
                b.classList.remove('bg-blue-100', 'text-blue-700');
                b.classList.add('text-gray-600', 'hover:bg-gray-100');
            });
            btn.classList.add('bg-blue-100', 'text-blue-700');
            btn.classList.remove('text-gray-600', 'hover:bg-gray-100');
        });
    });

    // Navigation par onglets dans la section "Communication"
    commTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            commContents.forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');

            commTabs.forEach(t => {
                t.classList.remove('bg-white', 'text-blue-700', 'shadow-sm');
                t.classList.add('text-gray-600', 'hover:text-gray-900');
            });
            tab.classList.add('bg-white', 'text-blue-700', 'shadow-sm');
            tab.classList.remove('text-gray-600', 'hover:text-gray-900');
        });
    });
    
    // Initialisation
    updateUI('jean');
});