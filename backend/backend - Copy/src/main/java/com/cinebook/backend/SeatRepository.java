
package com.cinebook.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Integer> {

    Optional<Seat> findBySeatNumber(String seatNumber);
}
