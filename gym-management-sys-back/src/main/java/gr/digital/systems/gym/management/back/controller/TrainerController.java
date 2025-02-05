package gr.digital.systems.gym.management.back.controller;

import gr.digital.systems.gym.management.back.model.Trainer;
import gr.digital.systems.gym.management.back.service.TrainerService;
import gr.digital.systems.gym.management.back.transfer.ApiResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** The type Trainer controller. */
@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

	private final TrainerService trainerService;

	/**
	 * Instantiates a new Trainer controller.
	 *
	 * @param trainerService the trainer service
	 */
	@Autowired
	public TrainerController(final TrainerService trainerService) {
		this.trainerService = trainerService;
	}

	/**
	 * Create response entity.
	 *
	 * @param trainer the trainer
	 * @return the response entity
	 */
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<Trainer>> create(@RequestBody Trainer trainer) {
		return ResponseEntity.ok()
				.body(ApiResponse.<Trainer>builder().data(this.trainerService.create(trainer)).build());
	}

	/**
	 * Find by id response entity.
	 *
	 * @param id the id
	 * @return the response entity
	 */
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<Trainer>> findById(@PathVariable Long id) {
		return ResponseEntity.ok()
				.body(ApiResponse.<Trainer>builder().data(this.trainerService.get(id)).build());
	}

	/**
	 * Find all response entity.
	 *
	 * @return the response entity
	 */
	@GetMapping
	public ResponseEntity<ApiResponse<List<Trainer>>> findAll() {
		return ResponseEntity.ok()
				.body(ApiResponse.<List<Trainer>>builder().data(this.trainerService.findAll()).build());
	}

	/**
	 * Update response entity.
	 *
	 * @param id the id
	 * @param trainerDetails the trainer details
	 * @return the response entity
	 */
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<Trainer>> update(
			@PathVariable Long id, @RequestBody Trainer trainerDetails) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<Trainer>builder()
								.data(this.trainerService.updateById(id, trainerDetails))
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
		trainerService.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
