package gr.digital.systems.gym.management.back.controller;

import gr.digital.systems.gym.management.back.dto.AdminStats;
import gr.digital.systems.gym.management.back.dto.UserStats;
import gr.digital.systems.gym.management.back.model.Activity;
import gr.digital.systems.gym.management.back.service.StatsService;
import gr.digital.systems.gym.management.back.transfer.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** The type Stats controller. */
@RestController
@RequestMapping("/api/stats")
public class StatsController {

	private final StatsService statsService;

	/**
	 * Instantiates a new Stats controller.
	 *
	 * @param statsService the stats service
	 */
	@Autowired
	public StatsController(StatsService statsService) {
		this.statsService = statsService;
	}

	/**
	 * Gets stats.
	 *
	 * @return the stats
	 */
	@GetMapping("/admin")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<AdminStats>> getStats() {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<AdminStats>builder()
								.data(this.statsService.calculateAdminStats())
								.build());
	}

	/**
	 * Gets user stats.
	 *
	 * @param id the id
	 * @return the user stats
	 */
	@GetMapping("/user/{id}")
	@PreAuthorize("hasRole('ROLE_USER')")
	public ResponseEntity<ApiResponse<UserStats>> getUserStats(@PathVariable Long id) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<UserStats>builder()
								.data(this.statsService.calculateUserStats(id))
								.build());
	}

	/**
	 * Gets user activity paginated.
	 *
	 * @param id the id
	 * @param page the page
	 * @param size the size
	 * @return the user activity paginated
	 */
	@GetMapping("/user/{id}/activity/page")
	@PreAuthorize("hasRole('ROLE_USER')")
	public ResponseEntity<Page<Activity>> getUserActivityPaginated(
			@PathVariable Long id,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "6") int size) {
		return ResponseEntity.ok(this.statsService.getUserActivities(id, PageRequest.of(page, size)));
	}

	/**
	 * Gets admin activity paginated.
	 *
	 * @param page the page
	 * @param size the size
	 * @return the admin activity paginated
	 */
	@GetMapping("/admin/activity/page")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Page<Activity>> getAdminActivityPaginated(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {
		return ResponseEntity.ok(this.statsService.getRecentActivities(PageRequest.of(page, size)));
	}
}
