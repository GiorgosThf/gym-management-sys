package gr.digital.systems.gym.management.back.controller;

import gr.digital.systems.gym.management.back.model.Announcement;
import gr.digital.systems.gym.management.back.service.AnnouncementService;
import gr.digital.systems.gym.management.back.transfer.ApiResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** The type Announcement controller. */
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

	private final AnnouncementService announcementService;

	/**
	 * Instantiates a new Announcement controller.
	 *
	 * @param announcementService the announcement service
	 */
	@Autowired
	public AnnouncementController(AnnouncementService announcementService) {
		this.announcementService = announcementService;
	}

	/**
	 * Create announcement response entity.
	 *
	 * @param announcement the announcement
	 * @return the response entity
	 */
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(
			@RequestBody Announcement announcement) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<Announcement>builder()
								.data(this.announcementService.create(announcement))
								.build());
	}

	/**
	 * Gets announcement.
	 *
	 * @param id the id
	 * @return the announcement
	 */
	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
	public ResponseEntity<ApiResponse<Announcement>> getAnnouncement(@PathVariable Long id) {
		return ResponseEntity.ok()
				.body(ApiResponse.<Announcement>builder().data(this.announcementService.get(id)).build());
	}

	/**
	 * Gets all announcements.
	 *
	 * @return the all announcements
	 */
	@GetMapping
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
	public ResponseEntity<ApiResponse<List<Announcement>>> getAllAnnouncements() {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<List<Announcement>>builder()
								.data(this.announcementService.findAll())
								.build());
	}

	/**
	 * Update booking response entity.
	 *
	 * @param id the id
	 * @param announcementDetails the announcement details
	 * @return the response entity
	 */
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<Announcement>> updateBooking(
			@PathVariable Long id, @RequestBody Announcement announcementDetails) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<Announcement>builder()
								.data(this.announcementService.updateById(id, announcementDetails))
								.build());
	}

	/**
	 * Delete announcement response entity.
	 *
	 * @param id the id
	 * @return the response entity
	 */
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
		this.announcementService.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
