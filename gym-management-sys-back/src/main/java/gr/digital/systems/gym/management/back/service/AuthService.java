package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.exception.ManagementSystemException;
import gr.digital.systems.gym.management.back.model.RegistrationRequest;
import gr.digital.systems.gym.management.back.model.User;
import gr.digital.systems.gym.management.back.repository.UserRepository;
import gr.digital.systems.gym.management.back.types.RegistrationStatus;
import gr.digital.systems.gym.management.back.utils.JwtUtils;
import java.util.Map;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The type Auth service. */
@Service
@Transactional
public class AuthService {

	private final RegistrationRequestService registrationRequestService;
	private final JwtUtils jwtUtils;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	/**
	 * Instantiates a new Auth service.
	 *
	 * @param userRepository the user repository
	 * @param registrationRequestService the registration request service
	 * @param jwtUtils the jwt utils
	 * @param passwordEncoder the password encoder
	 */
	public AuthService(
			final UserRepository userRepository,
			RegistrationRequestService registrationRequestService,
			JwtUtils jwtUtils,
			PasswordEncoder passwordEncoder) {
		this.registrationRequestService = registrationRequestService;
		this.jwtUtils = jwtUtils;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	/**
	 * Register registration request.
	 *
	 * @param registrationRequest the registration request
	 * @return the registration request
	 */
	public RegistrationRequest register(final RegistrationRequest registrationRequest) {
		this.checkUserExists(registrationRequest.getEmail());
		return this.registrationRequestService.create(
				RegistrationRequest.builder()
						.city(registrationRequest.getCity())
						.address(registrationRequest.getAddress())
						.country(registrationRequest.getCountry())
						.email(registrationRequest.getEmail())
						.firstName(registrationRequest.getFirstName())
						.lastName(registrationRequest.getLastName())
						.password(this.passwordEncoder.encode(registrationRequest.getPassword()))
						.registrationStatus(RegistrationStatus.PENDING)
						.build());
	}

	/**
	 * Login map . entry.
	 *
	 * @param email the email
	 * @param password the password
	 * @return the map . entry
	 */
	public Map.Entry<User, String> login(String email, String password) {
		final var foundUser = this.userRepository.findByEmail(email);
		this.checkUser(foundUser);
		this.checkPassword(password, foundUser.getPassword());
		this.checkStatus(foundUser);

		return Map.entry(foundUser, this.jwtUtils.generateToken(foundUser));
	}

	private void checkUser(final User foundUser) {
		if (foundUser == null){
			throw new ManagementSystemException("Invalid username or password");
		}
	}

	private void checkPassword(final String givenPassword, final String foundUserPassword) {
		if (!passwordEncoder.matches(givenPassword, foundUserPassword)) {
			throw new ManagementSystemException("Invalid username or password");
		}
	}

	private void checkStatus(final User foundUser) {
		if (!foundUser.isEnabled()) {
			throw new ManagementSystemException("Account is not activated, Please wait for activation");
		}
	}

	private void checkUserExists(final String userEmail) {
		if (Boolean.TRUE.equals(this.registrationRequestService.exists(userEmail))) {
			throw new ManagementSystemException("Registration request already submitted for this email");
		}
	}
}
