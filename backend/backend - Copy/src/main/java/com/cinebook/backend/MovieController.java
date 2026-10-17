
package com.cinebook.backend;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
@RestController
public class MovieController {

    private final MovieRepository movieRepository;
    private final MovieShowRepository movieShowRepository;

    public MovieController(
            MovieRepository movieRepository,
            MovieShowRepository movieShowRepository) {
        this.movieRepository = movieRepository;
        this.movieShowRepository = movieShowRepository;
    }

    @GetMapping("/api/movies")
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @GetMapping("/api/shows")
    public List<MovieShow> getAllShows() {
        return movieShowRepository.findAll();
    }
}
