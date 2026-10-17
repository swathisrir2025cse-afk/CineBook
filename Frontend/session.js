
document.addEventListener("DOMContentLoaded", function () {
    const savedUser = localStorage.getItem("cinebookUser");

    // If nobody is logged in, keep the existing navigation.
    if (!savedUser) {
        return;
    }

    let user;

    try {
        user = JSON.parse(savedUser);
    } catch (error) {
        localStorage.removeItem("cinebookUser");
        return;
    }

    const nav = document.querySelector(".navbar nav");

    if (!nav) {
        return;
    }

    // Remove Login and Register links.
    nav.querySelectorAll("a").forEach(function (link) {
        if (
            link.getAttribute("href") === "login.html" ||
            link.getAttribute("href") === "register.html"
        ) {
            link.remove();
        }
    });

    // Display the user's name.
    const welcome = document.createElement("span");
    welcome.className = "nav-user";
    welcome.textContent = "Hi, " + user.fullName;
    nav.appendChild(welcome);

    
    // Create the My Bookings link.
    const bookings = document.createElement("a");
    bookings.href = "my-bookings.html";
    bookings.textContent = "My Bookings";
    nav.appendChild(bookings);

    // Create the Logout link.
    const logout = document.createElement("a");
    logout.href = "#";
    logout.textContent = "Logout";

    logout.addEventListener("click", function (event) {
        event.preventDefault();

        localStorage.removeItem("cinebookUser");
        window.location.href = "index.html";
    });

    nav.appendChild(logout);
});
