// Users Page JavaScript Functionality

function openUserModal() {
    document.getElementById("userModal").style.display = "block";
}

function closeUserModal() {
    document.getElementById("userModal").style.display = "none";
}

function closeEditUserModal() {
    document.getElementById("editUserModal").style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById("userModal")) {
        closeUserModal();
    }
    if (event.target == document.getElementById("editUserModal")) {
        closeEditUserModal();
    }
}

function toggleModalPassword() {
    const input = document.getElementById('modalPassword');
    const icon = input.nextElementSibling.firstElementChild;
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
}

function toggleEditModalPassword() {
    const input = document.getElementById('editModalPassword');
    const icon = input.nextElementSibling.firstElementChild;
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
}
