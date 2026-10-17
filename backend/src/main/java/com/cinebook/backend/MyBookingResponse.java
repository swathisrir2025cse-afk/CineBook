
package com.cinebook.backend;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class MyBookingResponse {

    private Integer bookingId;
    private String movieTitle;
    private LocalDate showDate;
    private LocalTime showTime;
    private List<String> seatNumbers;
    private BigDecimal totalAmount;
    private String bookingStatus;
    private LocalDateTime bookedAt;

    public MyBookingResponse(
            Integer bookingId,
            String movieTitle,
            LocalDate showDate,
            LocalTime showTime,
            List<String> seatNumbers,
            BigDecimal totalAmount,
            String bookingStatus,
            LocalDateTime bookedAt) {

        this.bookingId = bookingId;
        this.movieTitle = movieTitle;
        this.showDate = showDate;
        this.showTime = showTime;
        this.seatNumbers = seatNumbers;
        this.totalAmount = totalAmount;
        this.bookingStatus = bookingStatus;
        this.bookedAt = bookedAt;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public LocalDate getShowDate() {
        return showDate;
    }

    public LocalTime getShowTime() {
        return showTime;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }
}
