package gr.digital.systems.gym.management.back.controller;

import gr.digital.systems.gym.management.back.model.Session;
import gr.digital.systems.gym.management.back.service.SessionService;
import gr.digital.systems.gym.management.back.transfer.ApiResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** The type Session controller. */
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

	private final SessionService sessionService;

	/**
	 * Instantiates a new Session controller.
	 *
	 * @param sessionService the session service
	 */
	@Autowired
	public SessionController(SessionService sessionService) {
		this.sessionService = sessionService;
	}

	/**
	 * Create response entity.
	 *
	 * @param session the session
	 * @return the response entity
	 */
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<Session>> create(@RequestBody Session session) {
		return ResponseEntity.ok()
				.body(ApiResponse.<Session>builder().data(this.sessionService.create(session)).build());
	}

	/**
	 * Find by id response entity.
	 *
	 * @param id the id
	 * @return the response entity
	 */
	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
	public ResponseEntity<ApiResponse<Session>> findById(@PathVariable Long id) {
		return ResponseEntity.ok()
				.body(ApiResponse.<Session>builder().data(this.sessionService.get(id)).build());
	}

	/**
	 * Find all response entity.
	 *
	 * @return the response entity
	 */
	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<List<Session>>> findAll() {
		return ResponseEntity.ok()
				.body(ApiResponse.<List<Session>>builder().data(this.sessionService.findAll()).build());
	}

	/**
	 * Find all recent response entity.
	 *
	 * @return the response entity
	 */
	@GetMapping("/recent")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
	public ResponseEntity<ApiResponse<List<Session>>> findAllRecent() {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<List<Session>>builder().data(this.sessionService.findAllRecent()).build());
	}

	/**
	 * Gets all recent sessions paginated.
	 *
	 * @param page the page
	 * @param size the size
	 * @return the all recent sessions paginated
	 */
	@GetMapping("/page")
	public ResponseEntity<Page<Session>> getAllRecentSessionsPaginated(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {
		return ResponseEntity.ok(this.sessionService.findAllRecentPageable(PageRequest.of(page, size)));
	}

	/**
	 * Update response entity.
	 *
	 * @param id the id
	 * @param sessionDetails the session details
	 * @return the response entity
	 */
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<Session>> update(
			@PathVariable Long id, @RequestBody Session sessionDetails) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<Session>builder()
								.data(this.sessionService.updateById(id, sessionDetails))
								.build());
	}

	/**
	 * Delete response entity.
	 *
	 * @param id the id
	 * @return the response entity
	 */
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		this.sessionService.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
