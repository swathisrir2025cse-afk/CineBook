
package com.cinebook.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Integer seatId;

    @Column(name = "seat_number", nullable = false, unique = true, length = 10)
    private String seatNumber;

    @Column(name = "seat_type", length = 30)
    private String seatType;

    public Seat() {}

    public Integer getSeatId() {
        return seatId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public String getSeatType() {
        return seatType;
    }
}
