// Check the query parameter 'token' in the URL to verify if it's a valid token
const urlParams = new URLSearchParams(window.location.search);
const verificationToken = urlParams.get('token');

// Resend the verification email if the user didn't get it
document.getElementById("resend-button").addEventListener("click", async function() {
    if (!verificationToken) {
        document.getElementById("message").innerText = "No verification token found.";
        return;
    }

    try {
        // Send the request to resend the verification email
        const response = await fetch(`/verify-email/${verificationToken}`, {
            method: 'GET'
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("message").innerText = "Verification email resent. Please check your inbox.";
        } else {
            document.getElementById("message").innerText = result.message || "Failed to resend the verification email.";
        }
    } catch (error) {
        console.error('Error while resending verification email:', error);
        document.getElementById("message").innerText = "An error occurred while resending the verification email.";
    }
});

// Perform an initial check to verify if the token is valid when the page loads
async function verifyEmail() {
    if (!verificationToken) {
        document.getElementById("message").innerText = "No verification token found.";
        return;
    }

    try {
        const response = await fetch(`/verify-email/${verificationToken}`, {
            method: 'GET'
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("message").innerText = "Your email has been successfully verified. You can now log in.";
            setTimeout(() => {
                window.location.href = '../pages/login.html'; // Redirect to login page after successful verification
            }, 2000); // Delay the redirect for 2 seconds
        } else {
            document.getElementById("message").innerText = result.message || "Email verification failed.";
        }
    } catch (error) {
        console.error('Error during email verification:', error);
        document.getElementById("message").innerText = "An error occurred during email verification.";
    }
}

// Trigger email verification when the page loads
window.onload = verifyEmail;
