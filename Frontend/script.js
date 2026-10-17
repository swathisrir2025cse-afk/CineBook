
 // ===== CINEBOOK BOOKING PAGE =====

document.addEventListener("DOMContentLoaded", async function () {
    const movieSelect = document.getElementById("movieSelect");

    // Stop if this is not the booking page.
    if (!movieSelect) return;

    const showDate = document.getElementById("showDate");
    const showTime = document.getElementById("showTime");
    const seats = document.querySelectorAll(".seat");
    const selectedSeatsText = document.getElementById("selectedSeats");
    const ticketPriceText = document.getElementById("ticketPrice");
    const totalPriceText = document.getElementById("totalPrice");
    const confirmButton = document.getElementById("confirmBooking");
    const bookingMessage = document.getElementById("bookingMessage");

    // Shows will come from the Spring Boot backend.
    let availableShows = [];
    let selectedShow = null;

    const API_URL = "http://localhost:8080/api/shows";

    // Format a date using the user's local calendar.
    function getLocalDate() {
        const today = new Date();

        return [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");
    }

    // Accept either HH:mm or HH:mm:ss.
    function formatTime(time) {
        if (!time) return "";
        return String(time).substring(0, 5);
    }

    // Convert the API date into YYYY-MM-DD.
    function formatDate(date) {
        if (!date) return "";

        if (typeof date === "string") {
            return date.substring(0, 10);
        }

        return "";
    }

    function getSelectedSeats() {
        return Array.from(document.querySelectorAll(".seat.selected"))
            .map(function (seat) {
                return seat.dataset.seat;
            });
    }

    function showMessage(message, type) {
        bookingMessage.textContent = message;
        bookingMessage.className = "booking-message";

        if (type) {
            bookingMessage.classList.add(type);
        }
    }

    function updateSummary() {
        const selectedSeats = getSelectedSeats();
        const price = selectedShow
            ? Number(selectedShow.ticketPrice)
            : 0;

        selectedSeatsText.textContent =
            selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "None";

        ticketPriceText.textContent = "₹" + price;
        totalPriceText.textContent =
            "₹" + (selectedSeats.length * price);
    }

    // Find the selected show using the movie and date.
    function updateAvailableTimes() {
        const movieTitle = movieSelect.value;
        const date = showDate.value;

        const matchingShows = availableShows.filter(function (show) {
            return show.movieTitle === movieTitle &&
                formatDate(show.showDate) === date;
        });

        selectedShow = null;

        if (showTime.tagName === "SELECT") {
            showTime.replaceChildren();

            const placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = matchingShows.length
                ? "Select show time"
                : "No shows available";

            showTime.appendChild(placeholder);

            matchingShows.forEach(function (show) {
                const option = document.createElement("option");

                option.value = String(show.showId);
                option.textContent =
                    formatTime(show.showTime) +
                    " — ₹" + show.ticketPrice;

                showTime.appendChild(option);
            });

            if (matchingShows.length > 0) {
                showTime.value = String(matchingShows[0].showId);
            }
        } else {
            // Support an existing time input as well.
            if (matchingShows.length > 0) {
                showTime.value = formatTime(matchingShows[0].showTime);
            } else {
                showTime.value = "";
            }
        }

        updateSelectedShow();
    }

    function updateSelectedShow() {
        const movieTitle = movieSelect.value;
        const date = showDate.value;
        const time = showTime.value;

        let matchingShows = availableShows.filter(function (show) {
            return show.movieTitle === movieTitle &&
                formatDate(show.showDate) === date;
        });

        if (showTime.tagName === "SELECT") {
            selectedShow = matchingShows.find(function (show) {
                return String(show.showId) === time;
            }) || null;
        } else {
            selectedShow = matchingShows.find(function (show) {
                return formatTime(show.showTime) === time;
            }) || null;
        }

        updateSummary();
    }

    // Load actual shows from MySQL through Spring Boot.
    async function loadShows() {
        try {
            showMessage("Loading available shows...", "");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Could not load shows from the backend.");
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("The shows API did not return a list.");
            }

            availableShows = data.filter(function (show) {
                return show.movieTitle &&
                    show.showDate &&
                    show.showTime &&
                    show.ticketPrice != null;
            });

            if (availableShows.length === 0) {
                movieSelect.replaceChildren();
                showDate.value = "";
                showMessage("No shows are currently available.", "error");
                updateAvailableTimes();
                return;
            }

            // Populate movie names from the database.
            const movieNames = [
                ...new Set(availableShows.map(function (show) {
                    return show.movieTitle;
                }))
            ];

            const previousMovie = new URLSearchParams(
                window.location.search
            ).get("movie");

            movieSelect.replaceChildren();

            movieNames.forEach(function (name) {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                movieSelect.appendChild(option);
            });

            if (previousMovie && movieNames.includes(previousMovie)) {
                movieSelect.value = previousMovie;
            }

            // Only allow dates that have shows for the selected movie.
            showDate.min = getLocalDate();

            const futureShows = availableShows.filter(function (show) {
                return formatDate(show.showDate) >= getLocalDate();
            });

            const movieShows = futureShows.filter(function (show) {
                return show.movieTitle === movieSelect.value;
            });

            if (movieShows.length > 0) {
                const existingDate = showDate.value;

                const dateExists = movieShows.some(function (show) {
                    return formatDate(show.showDate) === existingDate;
                });

                showDate.value = dateExists
                    ? existingDate
                    : formatDate(movieShows[0].showDate);
            } else {
                showDate.value = "";
            }

            updateAvailableTimes();

            showMessage(
                "Shows loaded successfully. Select your movie, date and time.",
                "success"
            );
        } catch (error) {
            console.error("CineBook API error:", error);

            selectedShow = null;
            updateSummary();

            showMessage(
                "Unable to load shows. Make sure Spring Boot is running at " +
                API_URL + " and try refreshing this page.",
                "error"
            );
        }
    }

    // Seat selection. Do not invent unavailable seats.
    seats.forEach(function (seat) {
        seat.addEventListener("click", function () {
            if (
                seat.disabled ||
                seat.classList.contains("unavailable") ||
                !selectedShow
            ) {
                return;
            }

            seat.classList.toggle("selected");
            updateSummary();

            showMessage("", "");
        });
    });

    movieSelect.addEventListener("change", function () {
        const movieShows = availableShows.filter(function (show) {
            return show.movieTitle === movieSelect.value &&
                formatDate(show.showDate) >= getLocalDate();
        });

        showDate.value = movieShows.length
            ? formatDate(movieShows[0].showDate)
            : "";

        updateAvailableTimes();
    });

    showDate.addEventListener("change", updateAvailableTimes);
    showTime.addEventListener("change", updateSelectedShow);

    // Validate the selection and show a confirmation.
    
confirmButton.addEventListener("click", async function () {
    const selectedSeats = getSelectedSeats();

    if (!selectedShow) {
        showMessage(
            "Please select a valid movie, date and show time.",
            "error"
        );
        return;
    }

    if (formatDate(selectedShow.showDate) < getLocalDate()) {
        showMessage("Please select today or a future date.", "error");
        return;
    }

    if (selectedSeats.length === 0) {
        showMessage("Please select at least one seat.", "error");
        return;
    }

    // Check the demo login information.
    let user;

    try {
        user = JSON.parse(localStorage.getItem("cinebookUser"));
    } catch (error) {
        user = null;
    }

    if (!user || !user.userId) {
        showMessage("Please log in before booking tickets.", "error");
        window.location.href = "login.html";
        return;
    }

    const movie = selectedShow.movieTitle;
    const date = formatDate(selectedShow.showDate);
    const time = formatTime(selectedShow.showTime);
    const price = Number(selectedShow.ticketPrice);
    const total = selectedSeats.length * price;

    // Display a temporary message while saving.
    bookingMessage.replaceChildren();
    bookingMessage.textContent = "Saving your booking...";
    bookingMessage.className = "booking-message";

    confirmButton.disabled = true;

    try {
        const response = await fetch("http://localhost:8080/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: Number(user.userId),
                showId: Number(selectedShow.showId),
                seatNumbers: selectedSeats
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to complete your booking."
            );
        }

        bookingMessage.replaceChildren();

        const heading = document.createElement("strong");
        heading.textContent = "Booking Confirmed!";
        bookingMessage.appendChild(heading);

        const details = [
            "Booking ID: " + result.bookingId,
            "Movie: " + movie,
            "Date: " + date,
            "Show Time: " + time,
            "Seats: " + selectedSeats.join(", "),
            "Tickets: " + selectedSeats.length,
            "Ticket Price: ₹" + price,
            "Total Amount: ₹" + Number(result.totalAmount),
            "",
            "Thank you for choosing CineBook!"
        ];
        window.location.href = "my-bookings.html";
        return;

        details.forEach(function (detail) {
            const line = document.createElement("div");
            line.textContent = detail || "\u00A0";
            bookingMessage.appendChild(line);
        });

        bookingMessage.className = "booking-message success";

        bookingMessage.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    } catch (error) {
        bookingMessage.textContent =
            error.message === "Failed to fetch"
                ? "Cannot connect to the booking server. Check whether the backend is running."
                : error.message;

        bookingMessage.className = "booking-message error";

    } finally {
        confirmButton.disabled = false;
    }
});


    await loadShows();
});
