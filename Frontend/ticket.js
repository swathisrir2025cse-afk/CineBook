
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

        // Create the digital ticket
        const ticket = document.createElement("article");
        ticket.className = "digital-ticket";

        // Ticket brand
        const brand = document.createElement("p");
        brand.className = "ticket-brand";
        brand.textContent = "CINEBOOK • MOVIE TICKET";

        // Movie title
        const movieTitle = document.createElement("h2");
        movieTitle.textContent = booking.movieTitle || "Movie unavailable";

        // Movie posters
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

        // Ticket divider with cinema-ticket cutout effect
const divider = document.createElement("div");
divider.className = "ticket-divider";

// Blurred background using the movie poster
const ticketBackdrop = document.createElement("div");
ticketBackdrop.className = "ticket-backdrop";
ticketBackdrop.style.backgroundImage = `url("${poster.src}")`;

        // Booking details
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
        // Gold booking status badge
        const statusBadge = document.createElement("div");
        statusBadge.className = "ticket-status-badge";
        statusBadge.textContent = booking.bookingStatus || "BOOKED";

        // QR code section
        const qrSection = document.createElement("div");
        qrSection.className = "ticket-qr-section";

        const qrHeading = document.createElement("h3");
        qrHeading.textContent = "Your Ticket QR Code";

        const qrDescription = document.createElement("p");
        qrDescription.textContent =
            "Show this QR code along with your booking ID.";

        const qrBox = document.createElement("div");
        qrBox.id = "ticket-qr-code";
        qrBox.className = "ticket-qr-code";

        qrSection.append(qrHeading, qrDescription, qrBox);

        // Generate QR code
        if (typeof QRCode !== "undefined") {
            new QRCode(qrBox, {
                text: "CINEBOOK-BOOKING-" + booking.bookingId,
                width: 180,
                height: 180,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            qrBox.textContent = "QR code library could not load.";
        }

        // Ticket footer
        const footer = document.createElement("p");
        footer.className = "ticket-footer";
        footer.textContent =
            "Please keep this ticket available when you arrive at the cinema.";

        // Add everything to the ticket
        ticket.append(
            ticketBackdrop,
            brand,
            movieTitle,
            statusBadge,
            poster,
            qrSection,
            divider,
            details,
            footer
        );

        ticketContainer.replaceChildren(ticket);

        // Print ticket
        printButton.addEventListener("click", function () {
            window.print();
        });

    } catch (error) {
        console.error("Ticket loading error:", error);

        ticketContainer.textContent =
            "Could not load the ticket. Please check that the backend is running.";
    }
});
