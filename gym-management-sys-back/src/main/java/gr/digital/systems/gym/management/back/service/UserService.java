package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.model.RegistrationRequest;
import gr.digital.systems.gym.management.back.model.User;
import gr.digital.systems.gym.management.back.repository.UserRepository;
import gr.digital.systems.gym.management.back.types.UserRole;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The type User service. */
@Service
@Transactional
public class UserService extends BaseServiceImpl<User> {

	/** The User repository. */
	protected final UserRepository userRepository;

	/**
	 * Instantiates a new User service.
	 *
	 * @param userRepository the user repository
	 * @param passwordEncoder the password encoder
	 */
	@Autowired
	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
	}

	@Override
	public JpaRepository<User, Long> getRepository() {
		return this.userRepository;
	}

	/**
	 * Gets authenticated user.
	 *
	 * @return the authenticated user
	 */
	public User getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return (User) authentication.getPrincipal();
	}

	@Override
	public List<User> findAll() {
		return this.userRepository.findAllByIdIsNot(this.getAuthenticatedUser().getId());
	}

	/**
	 * Update by id user.
	 *
	 * @param id the id
	 * @param userDetails the user details
	 * @return the user
	 */
	public User updateById(Long id, User userDetails) {
		User user = this.get(id);
		user.setFirstName(userDetails.getFirstName());
		user.setLastName(userDetails.getLastName());
		user.setEmail(userDetails.getEmail());
		user.setCountry(userDetails.getCountry());
		user.setCity(userDetails.getCity());
		user.setAddress(userDetails.getAddress());
		user.setRole(userDetails.getRole());
		return this.userRepository.save(user);
	}

	/**
	 * Create from registration request.
	 *
	 * @param registrationRequest the registration request
	 */
	public void createFromRegistrationRequest(RegistrationRequest registrationRequest) {
		this.userRepository.save(
				User.builder()
						.email(registrationRequest.getEmail())
						.password(registrationRequest.getPassword())
						.city(registrationRequest.getCity())
						.address(registrationRequest.getAddress())
						.country(registrationRequest.getCountry())
						.firstName(registrationRequest.getFirstName())
						.lastName(registrationRequest.getLastName())
						.role(UserRole.ROLE_USER)
						.enabled(Boolean.TRUE)
						.build());
	}
}
