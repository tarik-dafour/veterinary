// Report Page JavaScript Functionality

const reportModal = document.getElementById("reportModal");

function openReportModal() {
    reportModal.style.display = "block";
}

function closeReportModal() {
    reportModal.style.display = "none";
}

// Close if clicked outside
window.onclick = function(event) {
    if (event.target == reportModal) {
        reportModal.style.display = "none";
    }
}

// Close modal when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeReportModal();
    }
});
