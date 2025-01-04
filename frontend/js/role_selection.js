document.getElementById("nextBtn").addEventListener("click", function() {
    // Get the selected role
    const role = document.querySelector('input[name="role"]:checked');

    // If no role is selected, show an alert
    if (!role) {
        alert("Please select a role");
        return;
    }

    // Redirect based on the selected role
    if (role.value === 'patient') {
        window.location.href = 'patient_signup.html'; // Redirect to patient signup
    } else if (role.value === 'doctor') {
        window.location.href = 'doctor_signup.html'; // Redirect to doctor signup
    } else if (role.value === 'adminstrator') {
        window.location.href = 'adminstrator_signup.html'; // Redirect to adminstrator signup
    }
});
