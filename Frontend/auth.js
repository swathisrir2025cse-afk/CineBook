
const API_BASE_URL = "http://localhost:8080/api/auth";

// Registration
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const message = document.getElementById("authMessage");

        const data = {
            fullName: document.getElementById("fullName").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value
        };

        message.textContent = "Creating your account...";

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Registration failed.");
            }

            message.textContent = "Registration successful! Redirecting to login...";

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);

        } catch (error) {
            message.textContent =
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server. Check whether the backend is running."
                    : error.message;
        }
    });
}

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const message = document.getElementById("authMessage");

        const data = {
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value
        };

        message.textContent = "Signing in...";

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Login failed.");
            }

            // Demo only: this is not a secure authentication session.
            localStorage.setItem("cinebookUser", JSON.stringify({
                userId: result.userId,
                fullName: result.fullName,
                email: result.email
            }));

            message.textContent = "Login successful! Redirecting...";

            setTimeout(() => {
                window.location.href = "movies.html";
            }, 800);

        } catch (error) {
            message.textContent =
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server. Check whether the backend is running."
                    : error.message;
        }
    });
}
