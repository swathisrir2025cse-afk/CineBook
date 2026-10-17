
document.addEventListener("DOMContentLoaded", async function () {
    const ticketContainer = document.getElementById("ticket-container");
    const printButton = document.getElementById("print-ticket");

    // Check whether a user is logged in
    let user;

    try {
        const savedUser = localStorage.getItem("cinebookUser");

        if (!savedUser) {
            window.location.href = "login.html";
            return;
        }

        user = JSON.parse(savedUser);
    } catch (error) {
        localStorage.removeItem("cinebookUser");
        window.location.href = "login.html";
        return;
    }

    // Read the booking ID from the URL
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get("bookingId");

    if (!bookingId || !/^\d+$/.test(bookingId)) {
        ticketContainer.textContent =
            "No valid booking was selected. Open a ticket from My Bookings.";
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:8080/api/bookings/my?userId=" +
            encodeURIComponent(user.userId)
        );

        if (!response.ok) {
            throw new Error("Could not retrieve bookings.");
        }

        const bookings = await response.json();

        // Find the requested booking among this user's bookings
        const booking = bookings.find(function (item) {
            return String(item.bookingId) === bookingId;
        });

        if (!booking) {
            ticketContainer.textContent =
                "This booking was not found in your booking history.";
            return;
        }

        // Build the ticket safely using textContent
        const ticket = document.createElement("article");
        ticket.className = "digital-ticket";

        const brand = document.createElement("p");
        brand.className = "ticket-brand";
        brand.textContent = "CINEBOOK • MOVIE TICKET";

        
const movieTitle = document.createElement("h2");
movieTitle.textContent = booking.movieTitle || "Movie unavailable";

// Get the correct poster for the booked movie
const posterUrls = {
    leo: "https://media.senscritique.com/media/000021439997/0/leo.png",
    jailer: "https://image.tmdb.org/t/p/w500/pTmMxAHqX4vsIDE6HPPxOR0Q6TN.jpg",
    vikram: "https://image.tmdb.org/t/p/w500/774UV1aCURb4s4JfEFg3IEMu5Zj.jpg"
};

const poster = document.createElement("img");
poster.className = "ticket-movie-poster";
poster.alt = (booking.movieTitle || "Movie") + " movie poster";
poster.src = posterUrls[
    (booking.movieTitle || "").trim().toLowerCase()
] || "";
poster.loading = "eager";

if (!poster.src || poster.getAttribute("src") === "") {
    poster.hidden = true;
}

poster.onerror = function () {
    poster.hidden = true;
};


        const divider = document.createElement("hr");

        const details = document.createElement("div");
        details.className = "ticket-details";

        function addDetail(label, value) {
            const item = document.createElement("div");
            item.className = "ticket-detail";

            const heading = document.createElement("span");
            heading.textContent = label;

            const content = document.createElement("strong");
            content.textContent = value ?? "Unavailable";

            item.append(heading, content);
            details.appendChild(item);
        }

        addDetail("Booking ID", "#" + booking.bookingId);
        addDetail("Show Date", booking.showDate);
        addDetail("Show Time", booking.showTime);
        addDetail(
            "Seats",
            (booking.seatNumbers || []).join(", ") || "Unavailable"
        );
        addDetail("Total Paid", "₹" + booking.totalAmount);
        addDetail("Status", booking.bookingStatus);

        const footer = document.createElement("p");
        footer.className = "ticket-footer";
        footer.textContent =
            "Please keep this ticket available when you arrive at the cinema.";

        ticket.append(brand,poster, movieTitle, divider, details, footer);
        ticketContainer.replaceChildren(ticket);

        printButton.addEventListener("click", function () {
            window.print();
        });

    } catch (error) {
        console.error("Ticket loading error:", error);
        ticketContainer.textContent =
            "Could not load the ticket. Please check that the backend is running.";
    }
});
