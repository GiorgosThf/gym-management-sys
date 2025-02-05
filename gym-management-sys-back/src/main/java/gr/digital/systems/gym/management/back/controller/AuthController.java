package gr.digital.systems.gym.management.back.controller;

import gr.digital.systems.gym.management.back.dto.Credentials;
import gr.digital.systems.gym.management.back.model.RegistrationRequest;
import gr.digital.systems.gym.management.back.model.User;
import gr.digital.systems.gym.management.back.service.AuthService;
import gr.digital.systems.gym.management.back.transfer.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** The type Auth controller. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	/**
	 * Instantiates a new Auth controller.
	 *
	 * @param authService the auth service
	 */
	@Autowired
	public AuthController(final AuthService authService) {
		this.authService = authService;
	}

	/**
	 * Register user response entity.
	 *
	 * @param registrationRequest the registration request
	 * @return the response entity
	 */
	@PostMapping("/register")
	public ResponseEntity<ApiResponse<RegistrationRequest>> registerUser(
			@RequestBody RegistrationRequest registrationRequest) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(
						ApiResponse.<RegistrationRequest>builder()
								.data(this.authService.register(registrationRequest))
								.build());
	}

	/**
	 * Login user response entity.
	 *
	 * @param credentials the credentials
	 * @return the response entity
	 */
	@PostMapping("/login")
	public ResponseEntity<ApiResponse<User>> loginUser(@RequestBody Credentials credentials) {
		var userKeyEntry = this.authService.login(credentials.getUsername(), credentials.getPassword());
		return ResponseEntity.status(HttpStatus.OK)
				.header(HttpHeaders.AUTHORIZATION, "Bearer " + userKeyEntry.getValue())
				.body(ApiResponse.<User>builder().data(userKeyEntry.getKey()).build());
	}
}
