
/* ===== CINEBOOK BOOKING PAGE ===== */

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

    const API_URL = "http://localhost:8080/api/shows";

    let availableShows = [];
    let selectedShow = null;
    let seatAvailabilityRequest = 0;
    let availabilityLoaded = false;

    // ===== DATE AND TIME HELPERS =====

    function getLocalDate() {
        const today = new Date();

        return [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");
    }

    function formatTime(time) {
        if (!time) return "";
        return String(time).substring(0, 5);
    }

    function formatDate(date) {
        if (!date) return "";

        if (typeof date === "string") {
            return date.substring(0, 10);
        }

        return "";
    }

    // ===== MESSAGES =====

    function showMessage(message, type) {
        bookingMessage.textContent = message;
        bookingMessage.className = "booking-message";

        if (type) {
            bookingMessage.classList.add(type);
        }
    }

    // ===== SELECTED SEATS AND SUMMARY =====

    function getSelectedSeats() {
        return Array.from(document.querySelectorAll(".seat.selected"))
            .map(function (seat) {
                return seat.dataset.seat;
            });
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

    // ===== RESET SEAT AVAILABILITY =====

    function resetSeats() {
        availabilityLoaded = false;

        seats.forEach(function (seat) {
            seat.classList.remove("selected", "unavailable");
            seat.disabled = true;
        });

        updateSummary();
    }

    // ===== LOAD BOOKED SEATS FOR THE SELECTED SHOW =====

    async function loadBookedSeats(showId) {
        const requestId = ++seatAvailabilityRequest;

        availabilityLoaded = false;

        // Disable seats while checking availability.
        seats.forEach(function (seat) {
            seat.disabled = true;
            seat.classList.remove("selected", "unavailable");
        });

        updateSummary();

        try {
            const response = await fetch(
                `http://localhost:8080/api/shows/${showId}/booked-seats`
            );

            if (!response.ok) {
                throw new Error(
                    "Could not load booked seats. HTTP " + response.status
                );
            }

            const bookedSeatNumbers = await response.json();

            if (!Array.isArray(bookedSeatNumbers)) {
                throw new Error("Invalid booked-seats response.");
            }

            // Ignore responses from a previously selected show.
            if (
                requestId !== seatAvailabilityRequest ||
                !selectedShow ||
                String(selectedShow.showId) !== String(showId)
            ) {
                return;
            }

            const bookedSeatSet = new Set(
                bookedSeatNumbers.map(function (seatNumber) {
                    return String(seatNumber).trim().toUpperCase();
                })
            );

            seats.forEach(function (seat) {
                // data-seat="B7" gives B7, not just the text "7".
                const seatNumber = String(seat.dataset.seat || "")
                    .trim()
                    .toUpperCase();

                const isBooked = bookedSeatSet.has(seatNumber);

                seat.classList.remove("selected", "unavailable");

                if (isBooked) {
                    seat.classList.add("unavailable");
                    seat.disabled = true;
                } else {
                    seat.disabled = false;
                }
            });

            availabilityLoaded = true;
            updateSummary();

            showMessage("Seat availability loaded.", "success");

        } catch (error) {
            if (requestId !== seatAvailabilityRequest) {
                return;
            }

            console.error("Error loading booked seats:", error);

            availabilityLoaded = false;

            // Fail safely if seat availability cannot be checked.
            seats.forEach(function (seat) {
                seat.disabled = true;
            });

            showMessage(
                "Unable to check seat availability. Please try again.",
                "error"
            );
        }
    }

    // ===== SELECT THE SHOW =====

    function updateSelectedShow() {
        const movieTitle = movieSelect.value;
        const date = showDate.value;
        const time = showTime.value;

        const matchingShows = availableShows.filter(function (show) {
            return show.movieTitle === movieTitle &&
                formatDate(show.showDate) === date;
        });

        if (showTime.tagName === "SELECT") {
            selectedShow = matchingShows.find(function (show) {
                return String(show.showId) === String(time);
            }) || null;
        } else {
            selectedShow = matchingShows.find(function (show) {
                return formatTime(show.showTime) === time;
            }) || null;
        }

        // Invalidate requests belonging to a previously selected show.
        seatAvailabilityRequest++;

        resetSeats();

        if (selectedShow) {
            loadBookedSeats(selectedShow.showId);
        } else {
            showMessage(
                "Please select a valid movie, date and show time.",
                "error"
            );
        }
    }

    // ===== LOAD AVAILABLE TIMES =====

    function updateAvailableTimes() {
        const movieTitle = movieSelect.value;
        const date = showDate.value;

        const matchingShows = availableShows.filter(function (show) {
            return show.movieTitle === movieTitle &&
                formatDate(show.showDate) === date;
        });

        selectedShow = null;
        seatAvailabilityRequest++;

        resetSeats();

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
            if (matchingShows.length > 0) {
                showTime.value = formatTime(matchingShows[0].showTime);
            } else {
                showTime.value = "";
            }
        }

        updateSelectedShow();
    }

    // ===== LOAD SHOWS FROM SPRING BOOT =====

    async function loadShows() {
        try {
            showMessage("Loading available shows...", "");

            resetSeats();

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
                selectedShow = null;

                if (showTime.tagName === "SELECT") {
                    showTime.replaceChildren();
                    const option = document.createElement("option");
                    option.value = "";
                    option.textContent = "No shows available";
                    showTime.appendChild(option);
                }

                resetSeats();
                showMessage("No shows are currently available.", "error");
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

            // Do not offer past dates.
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
            seatAvailabilityRequest++;

            resetSeats();

            showMessage(
                "Unable to load shows. Make sure Spring Boot is running at " +
                API_URL + " and try refreshing this page.",
                "error"
            );
        }
    }

    // ===== SEAT CLICK HANDLERS =====

    seats.forEach(function (seat) {
        seat.addEventListener("click", function () {
            if (
                seat.disabled ||
                seat.classList.contains("unavailable") ||
                !selectedShow ||
                !availabilityLoaded
            ) {
                return;
            }

            seat.classList.toggle("selected");

            updateSummary();
            showMessage("", "");
        });
    });

    // ===== MOVIE, DATE AND TIME EVENTS =====

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

    // ===== CONFIRM BOOKING =====

    confirmButton.addEventListener("click", async function () {
        const selectedSeats = getSelectedSeats();

        if (!selectedShow) {
            showMessage(
                "Please select a valid movie, date and show time.",
                "error"
            );
            return;
        }

        if (!availabilityLoaded) {
            showMessage(
                "Seat availability is not ready. Please wait or try again.",
                "error"
            );
            return;
        }

        if (formatDate(selectedShow.showDate) < getLocalDate()) {
            showMessage(
                "Please select today or a future date.",
                "error"
            );
            return;
        }

        if (selectedSeats.length === 0) {
            showMessage("Please select at least one seat.", "error");
            return;
        }

        // Check the logged-in user.
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

        showMessage("Saving your booking...", "");

        confirmButton.disabled = true;

        try {
            const response = await fetch(
                "http://localhost:8080/api/bookings",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: Number(user.userId),
                        showId: Number(selectedShow.showId),
                        seatNumbers: selectedSeats
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to complete your booking."
                );
            }

            showMessage("Booking confirmed! Redirecting to My Bookings...", "success");

            // Refresh availability so seats booked by this request
            // cannot be selected again.
            await loadBookedSeats(selectedShow.showId);

            window.location.href = "my-bookings.html";

        } catch (error) {
            console.error("Booking error:", error);

            showMessage(
                error.message === "Failed to fetch"
                    ? "Cannot connect to the booking server. Check whether the backend is running."
                    : error.message,
                "error"
            );

            // Refresh seat availability after a booking error too.
            if (selectedShow) {
                await loadBookedSeats(selectedShow.showId);
            }

        } finally {
            confirmButton.disabled = false;
        }
    });

    // ===== START THE BOOKING PAGE =====

    await loadShows();
});
