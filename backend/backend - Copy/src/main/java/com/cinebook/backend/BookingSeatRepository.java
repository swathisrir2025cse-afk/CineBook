
package com.cinebook.backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingSeatRepository
        extends JpaRepository<BookingSeat, BookingSeatId> {

    List<BookingSeat> findByShowId(Integer showId);

    boolean existsByShowIdAndSeatId(Integer showId, Integer seatId);

    @Query(value = """
        SELECT s.seat_number
        FROM booking_seats bs
        JOIN seats s ON s.seat_id = bs.seat_id
        WHERE bs.booking_id = :bookingId
        """, nativeQuery = true)
    List<String> findSeatNumbersByBookingId(
            @Param("bookingId") Integer bookingId);
}
