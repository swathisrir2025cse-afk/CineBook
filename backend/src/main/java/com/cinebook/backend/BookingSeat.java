
package com.cinebook.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "booking_seats")
@IdClass(BookingSeatId.class)
public class BookingSeat {

    @Id
    @Column(name = "booking_id")
    private Integer bookingId;

    @Id
    @Column(name = "seat_id")
    private Integer seatId;

    @Column(name = "show_id", nullable = false)
    private Integer showId;

    @Column(name = "ticket_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal ticketPrice;

    public BookingSeat() {}

    public BookingSeat(Integer bookingId, Integer seatId,
                       Integer showId, BigDecimal ticketPrice) {
        this.bookingId = bookingId;
        this.seatId = seatId;
        this.showId = showId;
        this.ticketPrice = ticketPrice;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public Integer getSeatId() {
        return seatId;
    }

    public Integer getShowId() {
        return showId;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }
}
