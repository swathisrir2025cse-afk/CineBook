
document.addEventListener("DOMContentLoaded", async function () {
    const bookingsList = document.getElementById("bookings-list");
    const savedUser = localStorage.getItem("cinebookUser");

    if (!savedUser) {
        alert("Please log in to view your bookings.");
        window.location.href = "login.html";
        return;
    }

    let user;

    try {
        user = JSON.parse(savedUser);
    } catch (error) {
        localStorage.removeItem("cinebookUser");
        window.location.href = "login.html";
        return;
    }

    bookingsList.textContent = "Loading your bookings...";

    try {
        const response = await fetch(
            "http://localhost:8080/api/bookings/my?userId=" +
            encodeURIComponent(user.userId)
        );

        if (!response.ok) {
            throw new Error("Unable to load bookings.");
        }

        const bookings = await response.json();
        bookingsList.replaceChildren();

        if (bookings.length === 0) {
            bookingsList.textContent = "You have no bookings yet.";
            return;
        }

        bookings.forEach(function (booking) {
            const card = document.createElement("div");
            card.className = "booking-history-card";

            const title = document.createElement("h3");
            title.textContent = booking.movieTitle || "Movie unavailable";

            const bookingId = document.createElement("p");
            bookingId.textContent = "Booking ID: #" + booking.bookingId;

            const showDate = document.createElement("p");
            showDate.textContent = "Show date: " +
                (booking.showDate || "Unavailable");

            const showTime = document.createElement("p");
            showTime.textContent = "Show time: " +
                (booking.showTime || "Unavailable");

            const seats = document.createElement("p");
            seats.textContent = "Seats: " +
                ((booking.seatNumbers || []).join(", ") || "Unavailable");

            const amount = document.createElement("p");
            amount.textContent = "Total amount: ₹" + booking.totalAmount;

            const status = document.createElement("p");
            status.textContent = "Status: " + booking.bookingStatus;

            const bookedAt = document.createElement("p");
            bookedAt.textContent = "Booked on: " +
                (booking.bookedAt
                    ? new Date(booking.bookedAt).toLocaleString()
                    : "Unavailable");

            
const viewTicket = document.createElement("a");
viewTicket.className = "view-ticket-link";
viewTicket.href =
    "ticket.html?bookingId=" +
    encodeURIComponent(booking.bookingId);
viewTicket.textContent = "View Digital Ticket";

card.append(
    title,
    bookingId,
    showDate,
    showTime,
    seats,
    amount,
    status,
    bookedAt,
    viewTicket
);

bookingsList.appendChild(card);

        });

    } catch (error) {
        console.error("My Bookings error:", error);
        bookingsList.textContent =
            "Could not load bookings. Please check the backend and try again.";
    }
});
