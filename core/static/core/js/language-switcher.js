// Comprehensive Language Switching System
// This system translates all French text to English and vice versa across the entire site

const translations = {
    fr: {
        // Navigation and Common Elements
        'Dashboard': 'Tableau de bord',
        'Clients': 'Clients',
        'Animals': 'Animaux',
        'Reservations': 'Réservations',
        'Stock': 'Stock',
        'Store': 'Boutique',
        'Users': 'Utilisateurs',
        'Reports': 'Rapports',
        'Invoices': 'Factures',
        'Settings': 'Paramètres',
        'Logout': 'Déconnexion',
        
        // Welcome Messages
        'Welcome': 'Bienvenue',
        'Welcome,': 'Bienvenue,',
        
        // Form Labels and Buttons
        'First Name': 'Prénom',
        'Last Name': 'Nom',
        'Phone': 'Téléphone',
        'Email': 'Email',
        'Username': 'Nom d\'utilisateur',
        'Password': 'Mot de passe',
        'Animal Name': 'Nom de l\'animal',
        'Breed': 'Race',
        'Age': 'Âge',
        'Owner (Client)': 'Propriétaire (Client)',
        'Type': 'Type',
        'Service': 'Service',
        'Status': 'Statut',
        'Note': 'Note',
        'Date': 'Date',
        'Category': 'Catégorie',
        'Quantity': 'Quantité',
        'Price': 'Prix',
        'Description': 'Description',
        'Supplier': 'Fournisseur',
        'Expiration Date': 'Date d\'expiration',
        
        // Buttons
        'Add': 'Ajouter',
        'Update': 'Modifier',
        'Delete': 'Supprimer',
        'Edit': 'Modifier',
        'Save': 'Enregistrer',
        'Cancel': 'Annuler',
        'Search': 'Rechercher',
        'Export': 'Exporter',
        'Import': 'Importer',
        'Close': 'Fermer',
        'Submit': 'Soumettre',
        'Reset': 'Réinitialiser',
        'Back': 'Retour',
        'Next': 'Suivant',
        'Previous': 'Précédent',
        
        // Table Headers
        'Name': 'Nom',
        'Actions': 'Actions',
        'Owner': 'Propriétaire',
        'Client': 'Client',
        'Animal': 'Animal',
        'Date': 'Date',
        'Time': 'Heure',
        'Role': 'Rôle',
        'Phone': 'Téléphone',
        'Address': 'Adresse',
        'Created': 'Créé le',
        'Updated': 'Modifié le',
        
        // Messages
        'No clients found': 'Aucun client trouvé',
        'No animals found': 'Aucun animal trouvé',
        'No reservations found': 'Aucune réservation trouvée',
        'No products found': 'Aucun produit trouvé',
        'No users found': 'Aucun utilisateur trouvé',
        'No reports found': 'Aucun rapport trouvé',
        'No logs found': 'Aucun log trouvé',
        
        // Empty States
        'Start by adding your first client': 'Commencez par ajouter votre premier client',
        'Start by adding your first animal': 'Commencez par ajouter votre premier animal',
        'Start by adding your first reservation': 'Commencez par ajouter votre première réservation',
        'Start by adding your first product': 'Commencez par ajouter votre premier produit',
        'Start by adding your first user': 'Commencez par ajouter votre premier utilisateur',
        
        // Search Placeholders
        'Search for a client...': 'Rechercher un client...',
        'Search for an animal...': 'Rechercher un animal...',
        'Search for a reservation...': 'Rechercher une réservation...',
        'Search for a product...': 'Rechercher un produit...',
        'Search for a user...': 'Rechercher un utilisateur...',
        'Search for a report...': 'Rechercher un rapport...',
        'Search for a log...': 'Rechercher un log...',
        
        // Bulk Actions
        'Delete Selection': 'Supprimer la sélection',
        'Select All': 'Tout sélectionner',
        'Deselect All': 'Tout désélectionner',
        'Selected': 'Sélectionné',
        'items': 'éléments',
        
        // Confirmations
        'Are you sure you want to delete this item?': 'Êtes-vous sûr de vouloir supprimer cet élément ?',
        'Are you sure you want to delete the selected items?': 'Êtes-vous sûr de vouloir supprimer les éléments sélectionnés ?',
        'Are you sure you want to logout?': 'Êtes-vous sûr de vouloir vous déconnecter ?',
        
        // Success Messages
        'Item created successfully': 'Élément créé avec succès',
        'Item updated successfully': 'Élément mis à jour avec succès',
        'Item deleted successfully': 'Élément supprimé avec succès',
        'Items deleted successfully': 'Éléments supprimés avec succès',
        'Profile updated successfully': 'Profil mis à jour avec succès',
        'Password changed successfully': 'Mot de passe modifié avec succès',
        'Theme changed successfully': 'Thème modifié avec succès',
        
        // Error Messages
        'An error occurred': 'Une erreur s\'est produite',
        'Please fill all required fields': 'Veuillez remplir tous les champs obligatoires',
        'Invalid credentials': 'Identifiants invalides',
        'Current password is incorrect': 'Le mot de passe actuel est incorrect',
        'New passwords do not match': 'Les nouveaux mots de passe ne correspondent pas',
        'Password must be at least 8 characters long': 'Le mot de passe doit contenir au moins 8 caractères',
        
        // Page Titles
        'Veterinary Management': 'Gestion Vétérinaire',
        'Client Management': 'Gestion des Clients',
        'Animal Management': 'Gestion des Animaux',
        'Reservation Management': 'Gestion des Réservations',
        'Stock Management': 'Gestion des Stocks',
        'Store Management': 'Gestion de la Boutique',
        'User Management': 'Gestion des Utilisateurs',
        'Report Management': 'Gestion des Rapports',
        'Invoice Management': 'Gestion des Factures',
        'Settings': 'Paramètres',
        'Dashboard': 'Tableau de Bord',
        
        // Statistics and KPIs
        'New Clients': 'Nouveaux Clients',
        'Total Clients': 'Total des Clients',
        'Total Animals': 'Total des Animaux',
        'Total Reservations': 'Total des Réservations',
        'Total Products': 'Total des Produits',
        'Low Stock Alerts': 'Alertes de Stock Faible',
        'Upcoming Appointments': 'Rendez-vous à Venir',
        'Team Members': 'Membres de l\'Équipe',
        'Recent Activity': 'Activité Récente',
        
        // Calendar and Time
        'Today': 'Aujourd\'hui',
        'Tomorrow': 'Demain',
        'This Week': 'Cette Semaine',
        'This Month': 'Ce Mois',
        'Next Month': 'Mois Prochain',
        'Previous Month': 'Mois Précédent',
        
        // Status Values
        'Active': 'Actif',
        'Inactive': 'Inactif',
        'Pending': 'En Attente',
        'Completed': 'Terminé',
        'Cancelled': 'Annulé',
        'Confirmed': 'Confirmé',
        'Rescheduled': 'Reprogrammé',
        
        // User Roles
        'Administrator': 'Administrateur',
        'Veterinarian': 'Vétérinaire',
        'Assistant': 'Assistant',
        'Receptionist': 'Réceptionniste',
        'No Role': 'Aucun Rôle',
        
        // Common Actions
        'View Details': 'Voir les Détails',
        'Download': 'Télécharger',
        'Print': 'Imprimer',
        'Share': 'Partager',
        'Copy': 'Copier',
        'Duplicate': 'Dupliquer',
        'Archive': 'Archiver',
        'Restore': 'Restaurer',
        
        // Form Validation
        'This field is required': 'Ce champ est obligatoire',
        'Please enter a valid email': 'Veuillez entrer un email valide',
        'Please enter a valid phone number': 'Veuillez entrer un numéro de téléphone valide',
        'Please enter a valid date': 'Veuillez entrer une date valide',
        'Please enter a valid number': 'Veuillez entrer un nombre valide',
        'Minimum length is': 'La longueur minimale est',
        'Maximum length is': 'La longueur maximale est',
        'characters': 'caractères'
    },
    
    en: {
        // Navigation and Common Elements
        'Tableau de bord': 'Dashboard',
        'Clients': 'Clients',
        'Animaux': 'Animals',
        'Réservations': 'Reservations',
        'Stock': 'Stock',
        'Boutique': 'Store',
        'Utilisateurs': 'Users',
        'Rapports': 'Reports',
        'Factures': 'Invoices',
        'Paramètres': 'Settings',
        'Déconnexion': 'Logout',
        
        // Welcome Messages
        'Bienvenue': 'Welcome',
        'Bienvenue,': 'Welcome,',
        
        // Form Labels and Buttons
        'Prénom': 'First Name',
        'Nom': 'Last Name',
        'Téléphone': 'Phone',
        'Email': 'Email',
        'Nom d\'utilisateur': 'Username',
        'Mot de passe': 'Password',
        'Nom de l\'animal': 'Animal Name',
        'Race': 'Breed',
        'Âge': 'Age',
        'Propriétaire (Client)': 'Owner (Client)',
        'Type': 'Type',
        'Service': 'Service',
        'Statut': 'Status',
        'Note': 'Note',
        'Date': 'Date',
        'Catégorie': 'Category',
        'Quantité': 'Quantity',
        'Prix': 'Price',
        'Description': 'Description',
        'Fournisseur': 'Supplier',
        'Date d\'expiration': 'Expiration Date',
        
        // Buttons
        'Ajouter': 'Add',
        'Modifier': 'Update',
        'Supprimer': 'Delete',
        'Modifier': 'Edit',
        'Enregistrer': 'Save',
        'Annuler': 'Cancel',
        'Rechercher': 'Search',
        'Exporter': 'Export',
        'Importer': 'Import',
        'Fermer': 'Close',
        'Soumettre': 'Submit',
        'Réinitialiser': 'Reset',
        'Retour': 'Back',
        'Suivant': 'Next',
        'Précédent': 'Previous',
        
        // Table Headers
        'Nom': 'Name',
        'Actions': 'Actions',
        'Propriétaire': 'Owner',
        'Client': 'Client',
        'Animal': 'Animal',
        'Date': 'Date',
        'Heure': 'Time',
        'Rôle': 'Role',
        'Téléphone': 'Phone',
        'Adresse': 'Address',
        'Créé le': 'Created',
        'Modifié le': 'Updated',
        
        // Messages
        'Aucun client trouvé': 'No clients found',
        'Aucun animal trouvé': 'No animals found',
        'Aucune réservation trouvée': 'No reservations found',
        'Aucun produit trouvé': 'No products found',
        'Aucun utilisateur trouvé': 'No users found',
        'Aucun rapport trouvé': 'No reports found',
        'Aucun log trouvé': 'No logs found',
        
        // Empty States
        'Commencez par ajouter votre premier client': 'Start by adding your first client',
        'Commencez par ajouter votre premier animal': 'Start by adding your first animal',
        'Commencez par ajouter votre première réservation': 'Start by adding your first reservation',
        'Commencez par ajouter votre premier produit': 'Start by adding your first product',
        'Commencez par ajouter votre premier utilisateur': 'Start by adding your first user',
        
        // Search Placeholders
        'Rechercher un client...': 'Search for a client...',
        'Rechercher un animal...': 'Search for an animal...',
        'Rechercher une réservation...': 'Search for a reservation...',
        'Rechercher un produit...': 'Search for a product...',
        'Rechercher un utilisateur...': 'Search for a user...',
        'Rechercher un rapport...': 'Search for a report...',
        'Rechercher un log...': 'Search for a log...',
        
        // Bulk Actions
        'Supprimer la sélection': 'Delete Selection',
        'Tout sélectionner': 'Select All',
        'Tout désélectionner': 'Deselect All',
        'Sélectionné': 'Selected',
        'éléments': 'items',
        
        // Confirmations
        'Êtes-vous sûr de vouloir supprimer cet élément ?': 'Are you sure you want to delete this item?',
        'Êtes-vous sûr de vouloir supprimer les éléments sélectionnés ?': 'Are you sure you want to delete the selected items?',
        'Êtes-vous sûr de vouloir vous déconnecter ?': 'Are you sure you want to logout?',
        
        // Success Messages
        'Élément créé avec succès': 'Item created successfully',
        'Élément mis à jour avec succès': 'Item updated successfully',
        'Élément supprimé avec succès': 'Item deleted successfully',
        'Éléments supprimés avec succès': 'Items deleted successfully',
        'Profil mis à jour avec succès': 'Profile updated successfully',
        'Mot de passe modifié avec succès': 'Password changed successfully',
        'Thème modifié avec succès': 'Theme changed successfully',
        
        // Error Messages
        'Une erreur s\'est produite': 'An error occurred',
        'Veuillez remplir tous les champs obligatoires': 'Please fill all required fields',
        'Identifiants invalides': 'Invalid credentials',
        'Le mot de passe actuel est incorrect': 'Current password is incorrect',
        'Les nouveaux mots de passe ne correspondent pas': 'New passwords do not match',
        'Le mot de passe doit contenir au moins 8 caractères': 'Password must be at least 8 characters long',
        
        // Page Titles
        'Gestion Vétérinaire': 'Veterinary Management',
        'Gestion des Clients': 'Client Management',
        'Gestion des Animaux': 'Animal Management',
        'Gestion des Réservations': 'Reservation Management',
        'Gestion des Stocks': 'Stock Management',
        'Gestion de la Boutique': 'Store Management',
        'Gestion des Utilisateurs': 'User Management',
        'Gestion des Rapports': 'Report Management',
        'Gestion des Factures': 'Invoice Management',
        'Paramètres': 'Settings',
        'Tableau de Bord': 'Dashboard',
        
        // Statistics and KPIs
        'Nouveaux Clients': 'New Clients',
        'Total des Clients': 'Total Clients',
        'Total des Animaux': 'Total Animals',
        'Total des Réservations': 'Total Reservations',
        'Total des Produits': 'Total Products',
        'Alertes de Stock Faible': 'Low Stock Alerts',
        'Rendez-vous à Venir': 'Upcoming Appointments',
        'Membres de l\'Équipe': 'Team Members',
        'Activité Récente': 'Recent Activity',
        
        // Calendar and Time
        'Aujourd\'hui': 'Today',
        'Demain': 'Tomorrow',
        'Cette Semaine': 'This Week',
        'Ce Mois': 'This Month',
        'Mois Prochain': 'Next Month',
        'Mois Précédent': 'Previous Month',
        
        // Status Values
        'Actif': 'Active',
        'Inactif': 'Inactive',
        'En Attente': 'Pending',
        'Terminé': 'Completed',
        'Annulé': 'Cancelled',
        'Confirmé': 'Confirmed',
        'Reprogrammé': 'Rescheduled',
        
        // User Roles
        'Administrateur': 'Administrator',
        'Vétérinaire': 'Veterinarian',
        'Assistant': 'Assistant',
        'Réceptionniste': 'Receptionist',
        'Aucun Rôle': 'No Role',
        
        // Common Actions
        'Voir les Détails': 'View Details',
        'Télécharger': 'Download',
        'Imprimer': 'Print',
        'Partager': 'Share',
        'Copier': 'Copy',
        'Dupliquer': 'Duplicate',
        'Archiver': 'Archive',
        'Restaurer': 'Restore',
        
        // Form Validation
        'Ce champ est obligatoire': 'This field is required',
        'Veuillez entrer un email valide': 'Please enter a valid email',
        'Veuillez entrer un numéro de téléphone valide': 'Please enter a valid phone number',
        'Veuillez entrer une date valide': 'Please enter a valid date',
        'Veuillez entrer un nombre valide': 'Please enter a valid number',
        'La longueur minimale est': 'Minimum length is',
        'La longueur maximale est': 'Maximum length is',
        'caractères': 'characters'
    }
};

// Language switching function
function switchLanguage(targetLang) {
    try {
        // Update button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        const activeBtn = document.querySelector(`[data-lang="${targetLang}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-pressed', 'true');
        }
        
        // Show/hide language-specific content
        if (targetLang === 'fr') {
            document.querySelectorAll('.welcome-fr').forEach(el => el.style.display = 'inline');
            document.querySelectorAll('.welcome-en').forEach(el => el.style.display = 'none');
            document.documentElement.lang = 'fr';
        } else {
            document.querySelectorAll('.welcome-fr').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.welcome-en').forEach(el => el.style.display = 'inline');
            document.documentElement.lang = 'en';
        }
        
        // Store language preference
        localStorage.setItem('preferred-language', targetLang);
        
        // Update page title for accessibility
        const currentTitle = document.title;
        if (targetLang === 'fr' && !currentTitle.includes('|')) {
            document.title = currentTitle + ' | FR';
        } else if (targetLang === 'en' && !currentTitle.includes('|')) {
            document.title = currentTitle + ' | EN';
        }
        
        // Translate all text content
        translatePageContent(targetLang);
        
        // Show success notification
        showLanguageNotification(targetLang);
        
    } catch (error) {
        console.error('Error switching language:', error);
    }
}

// Function to translate page content
function translatePageContent(targetLang) {
    try {
        const translationSet = translations[targetLang];
        if (!translationSet) return;
        
        // Get all text nodes in the document
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip script and style content
                    if (node.parentElement && 
                        (node.parentElement.tagName === 'SCRIPT' || 
                         node.parentElement.tagName === 'STYLE')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        // Translate text nodes
        textNodes.forEach(textNode => {
            const text = textNode.textContent.trim();
            if (text && translationSet[text]) {
                textNode.textContent = textNode.textContent.replace(text, translationSet[text]);
            }
        });
        
        // Translate form placeholders
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
            const placeholder = input.getAttribute('placeholder');
            if (placeholder && translationSet[placeholder]) {
                input.setAttribute('placeholder', translationSet[placeholder]);
            }
        });
        
        // Translate button text
        document.querySelectorAll('button, input[type="submit"], input[type="button"]').forEach(button => {
            const text = button.textContent.trim();
            if (text && translationSet[text]) {
                button.textContent = button.textContent.replace(text, translationSet[text]);
            }
        });
        
        // Translate link text
        document.querySelectorAll('a').forEach(link => {
            const text = link.textContent.trim();
            if (text && translationSet[text]) {
                link.textContent = link.textContent.replace(text, translationSet[text]);
            }
        });
        
        // Translate label text
        document.querySelectorAll('label').forEach(label => {
            const text = label.textContent.trim();
            if (text && translationSet[text]) {
                label.textContent = label.textContent.replace(text, translationSet[text]);
            }
        });
        
        // Translate table headers
        document.querySelectorAll('th').forEach(th => {
            const text = th.textContent.trim();
            if (text && translationSet[text]) {
                th.textContent = th.textContent.replace(text, translationSet[text]);
            }
        });
        
        // Translate option text
        document.querySelectorAll('option').forEach(option => {
            const text = option.textContent.trim();
            if (text && translationSet[text]) {
                option.textContent = option.textContent.replace(text, translationSet[text]);
            }
        });
        
    } catch (error) {
        console.error('Error translating page content:', error);
    }
}

// Initialize language system
document.addEventListener('DOMContentLoaded', function() {
    try {
        const savedLang = localStorage.getItem('preferred-language') || 'en';
        switchLanguage(savedLang);
        
        // Update button state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
            if (btn.dataset.lang === savedLang) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            }
        });
        
    } catch (error) {
        console.error('Error initializing language system:', error);
    }
});
