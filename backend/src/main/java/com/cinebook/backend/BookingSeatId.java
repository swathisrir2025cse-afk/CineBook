
package com.cinebook.backend;

import java.io.Serializable;
import java.util.Objects;

public class BookingSeatId implements Serializable {

    private Integer bookingId;
    private Integer seatId;

    public BookingSeatId() {}

    public BookingSeatId(Integer bookingId, Integer seatId) {
        this.bookingId = bookingId;
        this.seatId = seatId;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof BookingSeatId)) return false;

        BookingSeatId other = (BookingSeatId) obj;

        return Objects.equals(bookingId, other.bookingId)
                && Objects.equals(seatId, other.seatId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bookingId, seatId);
    }
}
