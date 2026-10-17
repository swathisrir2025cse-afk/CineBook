
package com.cinebook.backend;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUserIdOrderByBookedAtDesc(Integer userId);
}
