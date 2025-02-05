package gr.digital.systems.gym.management.back.repository;

import gr.digital.systems.gym.management.back.model.RegistrationRequest;
import gr.digital.systems.gym.management.back.types.RegistrationStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** The interface Registration request repository. */
public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {
	/**
	 * Find by email registration request.
	 *
	 * @param email the email
	 * @return the registration request
	 */
	RegistrationRequest findByEmail(String email);

	/**
	 * Exists by email boolean.
	 *
	 * @param email the email
	 * @return the boolean
	 */
	Boolean existsByEmail(String email);

	/**
	 * Find all by registration status list.
	 *
	 * @param status the status
	 * @return the list
	 */
	List<RegistrationRequest> findAllByRegistrationStatus(RegistrationStatus status);

	/**
	 * Count all by registration status long.
	 *
	 * @param registrationStatus the registration status
	 * @return the long
	 */
	long countAllByRegistrationStatus(RegistrationStatus registrationStatus);
}
