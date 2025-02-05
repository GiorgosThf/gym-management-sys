package gr.digital.systems.gym.management.back.controller;

import gr.digital.systems.gym.management.back.model.RegistrationRequest;
import gr.digital.systems.gym.management.back.service.RegistrationRequestService;
import gr.digital.systems.gym.management.back.transfer.ApiResponse;
import gr.digital.systems.gym.management.back.types.RegistrationStatus;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** The type Registration request controller. */
@RestController
@RequestMapping("/api/registration-requests")
public class RegistrationRequestController {
	private final RegistrationRequestService registrationRequestService;

	/**
	 * Instantiates a new Registration request controller.
	 *
	 * @param registrationRequestService the registration request service
	 */
	public RegistrationRequestController(RegistrationRequestService registrationRequestService) {
		this.registrationRequestService = registrationRequestService;
	}

	/**
	 * Gets request.
	 *
	 * @param id the id
	 * @return the request
	 */
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<RegistrationRequest>> getRequest(@PathVariable Long id) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<RegistrationRequest>builder()
								.data(this.registrationRequestService.get(id))
								.build());
	}

	/**
	 * Get all requests response entity.
	 *
	 * @return the response entity
	 */
	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<List<RegistrationRequest>>> getAllRequests() {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<List<RegistrationRequest>>builder()
								.data(this.registrationRequestService.findAll())
								.build());
	}

	/**
	 * Gets all requests by type.
	 *
	 * @param registrationStatus the registration status
	 * @return the all requests by type
	 */
	@GetMapping("/type")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<List<RegistrationRequest>>> getAllRequestsByType(
			@RequestParam RegistrationStatus registrationStatus) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<List<RegistrationRequest>>builder()
								.data(this.registrationRequestService.findAllByStatus(registrationStatus))
								.build());
	}

	/**
	 * Update request response entity.
	 *
	 * @param id the id
	 * @param action the action
	 * @return the response entity
	 */
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<ApiResponse<RegistrationRequest>> updateRequest(
			@PathVariable Long id, @RequestParam Boolean action) {
		return ResponseEntity.ok()
				.body(
						ApiResponse.<RegistrationRequest>builder()
								.data(this.registrationRequestService.updateById(id, action))
								.build());
	}
}
