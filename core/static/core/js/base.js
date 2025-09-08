// Base Template JavaScript Functionality

// Initialize keyboard navigation for sidebar
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Add keyboard navigation for sidebar
        const sidebar = document.querySelector('.sidebar');
        const navLinks = sidebar.querySelectorAll('.nav-link');
        
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextLink = navLinks[index + 1] || navLinks[0];
                    nextLink.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
                    prevLink.focus();
                }
            });
        });
        
    } catch (error) {
        console.error('Error initializing sidebar navigation:', error);
    }
});
