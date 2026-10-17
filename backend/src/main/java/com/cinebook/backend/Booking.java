
package com.cinebook.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "show_id", nullable = false)
    private Integer showId;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "booking_status", nullable = false, length = 20)
    private String bookingStatus = "CONFIRMED";

    @Column(name = "booked_at", insertable = false, updatable = false)
    private LocalDateTime bookedAt;

    public Booking() {}

    public Integer getBookingId() {
        return bookingId;
    }

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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }
}
