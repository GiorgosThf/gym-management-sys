package gr.digital.systems.gym.management.back.controller;

import gr.digital.systems.gym.management.back.model.Booking;
import gr.digital.systems.gym.management.back.service.BookingService;
import gr.digital.systems.gym.management.back.transfer.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** The type Booking controller. */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

	private final BookingService bookingService;

	/**
	 * Instantiates a new Booking controller.
	 *
	 * @param bookingService the booking service
	 */
	@Autowired
	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}

	/**
	 * Create booking response entity.
	 *
	 * @param booking the booking
	 * @return the response entity
	 */
	@PostMapping
	@PreAuthorize("hasRole('ROLE_USER')")
	public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody Booking booking) {
		return ResponseEntity.ok()
				.body(ApiResponse.<Booking>builder().data(this.bookingService.create(booking)).build());
	}

	/**
	 * Gets booking.
	 *
	 * @param id the id
	 * @return the booking
	 */
	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
	public ResponseEntity<ApiResponse<Booking>> getBooking(@PathVariable Long id) {
		return ResponseEntity.ok()
				.body(ApiResponse.<Booking>builder().data(this.bookingService.get(id)).build());
	}

	/**
	 * Cancel booking response entity.
	 *
	 * @param id the id
	 * @return the response entity
	 */
	@GetMapping("/cancel/{id}")
	@PreAuthorize("hasRole('ROLE_USER')")
	public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
		this.bookingService.cancel(id);
		return ResponseEntity.noContent().build();
	}

	/**
	 * Gets user bookings.
	 *
	 * @param id the id
	 * @return the user bookings
	 */
	@GetMapping("/user/{id}/all")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
	public ResponseEntity<ApiResponse<List<Booking>>> getUserBookings(@PathVariable Long id) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<List<Booking>>builder()
								.data(this.bookingService.findAllByUser(id))
								.build());
	}

	/**
	 * Gets user booking.
	 *
	 * @param id the id
	 * @param bid the bid
	 * @return the user booking
	 */
	@GetMapping("/user/{id}/booking/{bid}")
	@PreAuthorize("hasRole('ROLE_USER')")
	public ResponseEntity<ApiResponse<Booking>> getUserBooking(
			@PathVariable Long id, @PathVariable Long bid) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<Booking>builder()
								.data(this.bookingService.findUserBooking(id, bid))
								.build());
	}

	/**
	 * Gets all bookings.
	 *
	 * @return the all bookings
	 */
	@GetMapping
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
	public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
		return ResponseEntity.ok()
				.body(ApiResponse.<List<Booking>>builder().data(this.bookingService.findAll()).build());
	}

	/**
	 * Update booking response entity.
	 *
	 * @param id the id
	 * @param bookingDetails the booking details
	 * @return the response entity
	 */
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_USER')")
	public ResponseEntity<ApiResponse<Booking>> updateBooking(
			@PathVariable Long id, @RequestBody Booking bookingDetails) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<Booking>builder()
								.data(this.bookingService.updateById(id, bookingDetails))
								.build());
	}

	/**
	 * Delete booking response entity.
	 *
	 * @param id the id
	 * @return the response entity
	 */
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
		bookingService.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
