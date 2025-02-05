package gr.digital.systems.gym.management.back.controller;

import gr.digital.systems.gym.management.back.model.Program;
import gr.digital.systems.gym.management.back.service.ProgramService;
import gr.digital.systems.gym.management.back.transfer.ApiResponse;
import java.util.List;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** The type Program controller. */
@RestController
@RequestMapping("/api/programs")
public class ProgramController {

	private final ProgramService programService;

	/**
	 * Instantiates a new Program controller.
	 *
	 * @param programService the program service
	 */
	@Autowired
	public ProgramController(ProgramService programService) {
		this.programService = programService;
	}

	/**
	 * Add program response entity.
	 *
	 * @param program the program
	 * @return the response entity
	 */
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<Program>> addProgram(@RequestBody Program program) {
		LoggerFactory.getLogger(ProgramController.class).info("{}", program);
		return ResponseEntity.ok()
				.body(ApiResponse.<Program>builder().data(this.programService.create(program)).build());
	}

	/**
	 * Gets program.
	 *
	 * @param id the id
	 * @return the program
	 */
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<Program>> getProgram(@PathVariable Long id) {
		return ResponseEntity.ok()
				.body(ApiResponse.<Program>builder().data(this.programService.get(id)).build());
	}

	/**
	 * Gets all programs.
	 *
	 * @return the all programs
	 */
	@GetMapping
	public ResponseEntity<ApiResponse<List<Program>>> getAllPrograms() {
		return ResponseEntity.ok()
				.body(ApiResponse.<List<Program>>builder().data((this.programService.findAll())).build());
	}

	/**
	 * Gets all programs paginated.
	 *
	 * @param page the page
	 * @param size the size
	 * @return the all programs paginated
	 */
	@GetMapping("/page")
	public ResponseEntity<Page<Program>> getAllProgramsPaginated(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {
		return ResponseEntity.ok()
				.body(this.programService.findAllPageable(PageRequest.of(page, size)));
	}

	/**
	 * Update program response entity.
	 *
	 * @param id the id
	 * @param programDetails the program details
	 * @return the response entity
	 */
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<Program>> updateProgram(
			@PathVariable Long id, @RequestBody Program programDetails) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<Program>builder()
								.data(this.programService.updateById(id, programDetails))
								.build());
	}

	/**
	 * Delete program response entity.
	 *
	 * @param id the id
	 * @return the response entity
	 */
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
		this.programService.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
