
package com.cinebook.backend;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
public class BookingController {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final MovieShowRepository movieShowRepository;

    public BookingController(
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            SeatRepository seatRepository,
            UserRepository userRepository,
            MovieShowRepository movieShowRepository) {

        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
        this.movieShowRepository = movieShowRepository;
    }

    // Create a new booking
    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> createBooking(
            @RequestBody BookingRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            if (request.getUserId() == null
                    || request.getShowId() == null
                    || request.getSeatNumbers() == null
                    || request.getSeatNumbers().isEmpty()) {

                response.put("message",
                        "User, show, and at least one seat are required.");

                return ResponseEntity.badRequest().body(response);
            }

            if (request.getSeatNumbers().stream()
                    .anyMatch(s -> s == null || s.isBlank())) {

                response.put("message", "Invalid seat number.");
                return ResponseEntity.badRequest().body(response);
            }

            List<String> seatNumbers = request.getSeatNumbers();
            Set<String> uniqueSeats = new HashSet<>(seatNumbers);

            if (uniqueSeats.size() != seatNumbers.size()) {
                response.put("message",
                        "The same seat cannot be selected more than once.");

                return ResponseEntity.badRequest().body(response);
            }

            if (!userRepository.existsById(request.getUserId())) {
                response.put("message",
                        "User not found. Please register or log in first.");

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(response);
            }

            MovieShow show = movieShowRepository
                    .findById(request.getShowId().longValue())
                    .orElse(null);

            if (show == null || show.getTicketPrice() == null) {
                response.put("message", "Movie show not found.");

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(response);
            }

            List<Seat> selectedSeats = new ArrayList<>();

            for (String seatNumber : seatNumbers) {
                Seat seat = seatRepository
                        .findBySeatNumber(seatNumber)
                        .orElse(null);

                if (seat == null) {
                    response.put("message",
                            "Seat " + seatNumber + " does not exist.");

                    return ResponseEntity.badRequest().body(response);
                }

                if (bookingSeatRepository.existsByShowIdAndSeatId(
                        request.getShowId(), seat.getSeatId())) {

                    response.put("message",
                            "Seat " + seatNumber
                            + " is already booked for this show.");

                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(response);
                }

                selectedSeats.add(seat);
            }

            BigDecimal ticketPrice =
                    BigDecimal.valueOf(show.getTicketPrice());

            BigDecimal totalAmount = ticketPrice.multiply(
                    BigDecimal.valueOf(selectedSeats.size()));

            Booking booking = new Booking();
            booking.setUserId(request.getUserId());
            booking.setShowId(request.getShowId());
            booking.setTotalAmount(totalAmount);

            Booking savedBooking =
                    bookingRepository.saveAndFlush(booking);

            List<BookingSeat> bookingSeats = new ArrayList<>();

            for (Seat seat : selectedSeats) {
                bookingSeats.add(new BookingSeat(
                        savedBooking.getBookingId(),
                        seat.getSeatId(),
                        request.getShowId(),
                        ticketPrice
                ));
            }

            bookingSeatRepository.saveAll(bookingSeats);

            response.put("message", "Booking created successfully.");
            response.put("bookingId", savedBooking.getBookingId());
            response.put("showId", request.getShowId());
            response.put("seatNumbers", seatNumbers);
            response.put("totalAmount", totalAmount);
            response.put("status", savedBooking.getBookingStatus());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(response);

        } catch (Exception e) {
            response.put("message",
                    "Booking could not be completed. Please try again.");

            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get the current user's booking history
    @GetMapping("/my")
    public ResponseEntity<List<MyBookingResponse>> getMyBookings(
            @RequestParam Integer userId) {

        List<Booking> bookings =
                bookingRepository.findByUserIdOrderByBookedAtDesc(userId);

        List<MyBookingResponse> result = bookings.stream()
                .map(booking -> {
                    MovieShow show = movieShowRepository
                            .findById(booking.getShowId().longValue())
                            .orElse(null);

                    String movieTitle = show != null
                            ? show.getMovieTitle()
                            : "Movie unavailable";

                    return new MyBookingResponse(
                            booking.getBookingId(),
                            movieTitle,
                            show != null ? show.getShowDate() : null,
                            show != null ? show.getShowTime() : null,
                            bookingSeatRepository
                                    .findSeatNumbersByBookingId(
                                            booking.getBookingId()),
                            booking.getTotalAmount(),
                            booking.getBookingStatus(),
                            booking.getBookedAt()
                    );
                })
                .toList();

        return ResponseEntity.ok(result);
    }
}
