document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailOrPhone = document.getElementById("emailOrPhone").value;
  const password = document.getElementById("password").value;

  const loginData = {
    emailOrPhone,
    password,
  };

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Successfully logged in, now redirect based on role
      if (data.role === 'patient') {
        window.location.href = "../pages/patient_dashboard.html";
      } else if (data.role === 'doctor') {
        window.location.href = "../pages/doctor_dashboard.html";
      } else if (data.role === 'receptionist') {
        window.location.href = "../pages/receptionist_dashboard.html";
      }
    } else {
      // Show error message if login fails
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
