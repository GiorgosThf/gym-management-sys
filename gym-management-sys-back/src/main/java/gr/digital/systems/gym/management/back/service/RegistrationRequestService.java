package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.model.RegistrationRequest;
import gr.digital.systems.gym.management.back.repository.RegistrationRequestRepository;
import gr.digital.systems.gym.management.back.types.RegistrationStatus;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The type Registration request service. */
@Service
@Transactional
public class RegistrationRequestService extends BaseServiceImpl<RegistrationRequest> {
	private final RegistrationRequestRepository registrationRequestRepository;
	private final UserService userService;

	/**
	 * Instantiates a new Registration request service.
	 *
	 * @param registrationRequestRepository the registration request repository
	 * @param userService the user service
	 */
	@Autowired
	public RegistrationRequestService(
			RegistrationRequestRepository registrationRequestRepository, UserService userService) {
		this.registrationRequestRepository = registrationRequestRepository;
		this.userService = userService;
	}

	@Override
	public JpaRepository<RegistrationRequest, Long> getRepository() {
		return this.registrationRequestRepository;
	}

	/**
	 * Update by id registration request.
	 *
	 * @param id the id
	 * @param approve the approval
	 * @return the registration request
	 */
	public RegistrationRequest updateById(Long id, Boolean approve) {
		var registrationRequest = this.get(id);
		if (Boolean.TRUE.equals(approve)) {
			this.userService.createFromRegistrationRequest(registrationRequest);
			registrationRequest.setRegistrationStatus(RegistrationStatus.ACCEPTED);
		} else {
			registrationRequest.setRegistrationStatus(RegistrationStatus.REJECTED);
		}
		return this.registrationRequestRepository.save(registrationRequest);
	}

	/**
	 * Exists boolean.
	 *
	 * @param email the email
	 * @return the boolean
	 */
	public Boolean exists(String email) {
		return this.registrationRequestRepository.existsByEmail(email);
	}

	/**
	 * Find all by status list.
	 *
	 * @param registrationStatus the registration status
	 * @return the list
	 */
	public List<RegistrationRequest> findAllByStatus(RegistrationStatus registrationStatus) {
		return registrationRequestRepository.findAllByRegistrationStatus(registrationStatus);
	}
}
