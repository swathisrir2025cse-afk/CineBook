package com.cinebook.backend;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.IdClass;
import java.io.Serializable;
import java.util.Objects;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
@Entity
@Table(name = "movies")
class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Long movieId;

    private String title;
    private String genre;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    private String language;
    private String description;

    @Column(name = "poster_url")
    private String posterUrl;

    public Movie() {}

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
}
@Entity
@Table(name = "shows")
class MovieShow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "show_id")
    private Long showId;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    @JsonIgnore
    private Movie movie;

    @Column(name = "show_date")
    private LocalDate showDate;

    @Column(name = "show_time")
    private LocalTime showTime;

    @Column(name = "ticket_price")
    private Double ticketPrice;

    public MovieShow() {}

    public Long getShowId() { return showId; }

    public Movie getMovie() { return movie; }

    public void setMovie(Movie movie) { this.movie = movie; }

    public LocalDate getShowDate() { return showDate; }

    public LocalTime getShowTime() { return showTime; }

    public Double getTicketPrice() { return ticketPrice; }

    public Long getMovieId() {
        return movie != null ? movie.getMovieId() : null;
    }

    public String getMovieTitle() {
        return movie != null ? movie.getTitle() : null;
    }
}
@Entity
@Table(name = "users")
class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "full_name")
    private String fullName;

    @Column(unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    private String role = "USER";

    public User() {}

    public Integer getUserId() { return userId; }

    public String getFullName() { return fullName; }

    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }
}
@Entity
@Table(name = "bookings")
class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "show_id")
    private Integer showId;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "booking_status")
    private String bookingStatus = "CONFIRMED";

    @Column(name = "booked_at", insertable = false, updatable = false)
    private LocalDateTime bookedAt;

    public Booking() {}

    public Integer getBookingId() { return bookingId; }

    public Integer getUserId() { return userId; }

    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getShowId() { return showId; }

    public void setShowId(Integer showId) { this.showId = showId; }

    public BigDecimal getTotalAmount() { return totalAmount; }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getBookingStatus() { return bookingStatus; }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getBookedAt() { return bookedAt; }
}
@Entity
@Table(name = "seats")
class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Integer seatId;

    @Column(name = "seat_number", unique = true)
    private String seatNumber;

    @Column(name = "seat_type")
    private String seatType;

    public Seat() {}

    public Integer getSeatId() { return seatId; }

    public String getSeatNumber() { return seatNumber; }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getSeatType() { return seatType; }

    public void setSeatType(String seatType) {
        this.seatType = seatType;
    }
}
class BookingSeatId implements Serializable {

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

@Entity
@Table(name = "booking_seats")
@IdClass(BookingSeatId.class)
class BookingSeat {

    @Id
    @Column(name = "booking_id")
    private Integer bookingId;

    @Id
    @Column(name = "seat_id")
    private Integer seatId;

    @Column(name = "show_id")
    private Integer showId;

    @Column(name = "ticket_price")
    private BigDecimal ticketPrice;

    public BookingSeat() {}

    public BookingSeat(
            Integer bookingId,
            Integer seatId,
            Integer showId,
            BigDecimal ticketPrice) {
        this.bookingId = bookingId;
        this.seatId = seatId;
        this.showId = showId;
        this.ticketPrice = ticketPrice;
    }

    public Integer getBookingId() { return bookingId; }

    public Integer getSeatId() { return seatId; }

    public Integer getShowId() { return showId; }

    public BigDecimal getTicketPrice() { return ticketPrice; }
}
interface MovieRepository extends JpaRepository<Movie, Long> {
}

interface MovieShowRepository extends JpaRepository<MovieShow, Long> {
}

interface UserRepository extends JpaRepository<User, Integer> {
    java.util.Optional<User> findByEmail(String email);
}

interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserIdOrderByBookedAtDesc(Integer userId);
}

interface SeatRepository extends JpaRepository<Seat, Integer> {
    java.util.Optional<Seat> findBySeatNumber(String seatNumber);
}

interface BookingSeatRepository
        extends JpaRepository<BookingSeat, BookingSeatId> {

    List<BookingSeat> findByShowId(Integer showId);

    boolean existsByShowIdAndSeatId(Integer showId, Integer seatId);

    @Query(value = """
            SELECT s.seat_number
            FROM booking_seats bs
            JOIN seats s ON bs.seat_id = s.seat_id
            WHERE bs.booking_id = :bookingId
            """, nativeQuery = true)
    List<String> findSeatNumbersByBookingId(
            @Param("bookingId") Integer bookingId);
}