document.getElementById('signupBtn').addEventListener('click', async function() {
    const fullName = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phone_number').value;
    const dob = document.getElementById('dob').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const data = {
        full_name: fullName,
        email: email,
        phone_number: phoneNumber,
        dob: dob,
        password: password,
        confirm_password: confirmPassword
    };

    try {
        const response = await fetch('http://localhost:3000/api/patient/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Patient signup successful!');
            window.location.href = '../pages/login.html'; // Redirect to login page after successful signup
        } else {
            alert('Signup failed: ' + result.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
});