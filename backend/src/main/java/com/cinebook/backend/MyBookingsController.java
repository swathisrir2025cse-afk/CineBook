
package com.cinebook.backend;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
public class MyBookingsController {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final MovieShowRepository movieShowRepository;

    public MyBookingsController(
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            MovieShowRepository movieShowRepository) {

        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.movieShowRepository = movieShowRepository;
    }

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
