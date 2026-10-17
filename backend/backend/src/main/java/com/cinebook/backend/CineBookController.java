
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
@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
public class CineBookController {

    private final MovieRepository movieRepository;
    private final MovieShowRepository movieShowRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    public CineBookController(
            MovieRepository movieRepository,
            MovieShowRepository movieShowRepository,
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            SeatRepository seatRepository,
            UserRepository userRepository) {

        this.movieRepository = movieRepository;
        this.movieShowRepository = movieShowRepository;
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/api/movies")
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @GetMapping("/api/shows")
    public List<MovieShow> getAllShows() {
        return movieShowRepository.findAll();
    }

    @PostMapping("/api/bookings")
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

            List<String> seatNumbers = request.getSeatNumbers();

            if (seatNumbers.stream()
                    .anyMatch(s -> s == null || s.isBlank())) {
                response.put("message", "Invalid seat number.");
                return ResponseEntity.badRequest().body(response);
            }

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
                        ticketPrice));
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

    @GetMapping("/api/bookings/my")
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
                            booking.getBookedAt());
                })
                .toList();

        return ResponseEntity.ok(result);
    }
}
class BookingRequest {

    private Integer userId;
    private Integer showId;
    private List<String> seatNumbers;

    public BookingRequest() {}

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getShowId() {
        return showId;
    }

    public void setShowId(Integer showId) {
        this.showId = showId;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }
}
class MyBookingResponse {

    private Integer bookingId;
    private String movieTitle;
    private java.time.LocalDate showDate;
    private java.time.LocalTime showTime;
    private List<String> seatNumbers;
    private BigDecimal totalAmount;
    private String bookingStatus;
    private java.time.LocalDateTime bookedAt;

    public MyBookingResponse(
            Integer bookingId,
            String movieTitle,
            java.time.LocalDate showDate,
            java.time.LocalTime showTime,
            List<String> seatNumbers,
            BigDecimal totalAmount,
            String bookingStatus,
            java.time.LocalDateTime bookedAt) {

        this.bookingId = bookingId;
        this.movieTitle = movieTitle;
        this.showDate = showDate;
        this.showTime = showTime;
        this.seatNumbers = seatNumbers;
        this.totalAmount = totalAmount;
        this.bookingStatus = bookingStatus;
        this.bookedAt = bookedAt;
    }

    public Integer getBookingId() { return bookingId; }
    public String getMovieTitle() { return movieTitle; }
    public java.time.LocalDate getShowDate() { return showDate; }
    public java.time.LocalTime getShowTime() { return showTime; }
    public List<String> getSeatNumbers() { return seatNumbers; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getBookingStatus() { return bookingStatus; }
    public java.time.LocalDateTime getBookedAt() { return bookedAt; }
}