package gr.digital.systems.gym.management.back.controller;

import gr.digital.systems.gym.management.back.model.User;
import gr.digital.systems.gym.management.back.service.UserService;
import gr.digital.systems.gym.management.back.transfer.ApiResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** The type User controller. */
@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	/**
	 * Instantiates a new User controller.
	 *
	 * @param userService the user service
	 */
	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	/**
	 * Create response entity.
	 *
	 * @param user the user
	 * @return the response entity
	 */
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<User>> create(@RequestBody User user) {
		return ResponseEntity.ok()
				.body(ApiResponse.<User>builder().data(this.userService.create(user)).build());
	}

	/**
	 * Find by id response entity.
	 *
	 * @param id the id
	 * @return the response entity
	 */
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<User>> findById(@PathVariable Long id) {
		return ResponseEntity.ok()
				.body(ApiResponse.<User>builder().data(this.userService.get(id)).build());
	}

	/**
	 * Find all response entity.
	 *
	 * @return the response entity
	 */
	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<List<User>>> findAll() {
		return ResponseEntity.ok()
				.body(ApiResponse.<List<User>>builder().data(this.userService.findAll()).build());
	}

	/**
	 * Update response entity.
	 *
	 * @param id the id
	 * @param userDetails the user details
	 * @return the response entity
	 */
	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER')")
	public ResponseEntity<ApiResponse<User>> update(
			@PathVariable Long id, @RequestBody User userDetails) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<User>builder().data(this.userService.updateById(id, userDetails)).build());
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
		this.userService.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
