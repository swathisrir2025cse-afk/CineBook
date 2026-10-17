
package com.cinebook.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = {
    "http://127.0.0.1:5500",
    "http://localhost:5500"
})
@RestController
@RequestMapping("/api/shows")
public class MovieShowController {

    private final MovieShowRepository movieShowRepository;

    public MovieShowController(
            MovieShowRepository movieShowRepository) {
        this.movieShowRepository = movieShowRepository;
    }

    @GetMapping
    public List<MovieShow> getAllShows() {
        return movieShowRepository.findAll();
    }
}
