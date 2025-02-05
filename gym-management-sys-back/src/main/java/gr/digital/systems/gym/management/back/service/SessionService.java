package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.model.Session;
import gr.digital.systems.gym.management.back.repository.SessionRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The type Session service. */
@Service
@Transactional
public class SessionService extends BaseServiceImpl<Session> {

	private final SessionRepository sessionRepository;

	/**
	 * Instantiates a new Session service.
	 *
	 * @param sessionRepository the session repository
	 */
	@Autowired
	public SessionService(SessionRepository sessionRepository) {
		this.sessionRepository = sessionRepository;
	}

	@Override
	public JpaRepository<Session, Long> getRepository() {
		return this.sessionRepository;
	}

	/**
	 * Update by id session.
	 *
	 * @param id the id
	 * @param sessionDetails the session details
	 * @return the session
	 */
	public Session updateById(Long id, Session sessionDetails) {
		Session session = sessionRepository.getReferenceById(id);
		session.setDate(sessionDetails.getDate());
		session.setStartTime(sessionDetails.getStartTime());
		session.setEndTime(sessionDetails.getEndTime());
		session.setMaxCapacity(sessionDetails.getMaxCapacity());
		session.setProgram(sessionDetails.getProgram());
		session.setCurrentBookings(sessionDetails.getCurrentBookings());
		session.setTrainer(sessionDetails.getTrainer());
		return sessionRepository.save(session);
	}

	/**
	 * Find all recent list.
	 *
	 * @return the list
	 */
	public List<Session> findAllRecent() {
		return this.sessionRepository.findAllByDateIsGreaterThanEqual(
				LocalDate.now().atStartOfDay().toLocalDate());
	}

	/**
	 * Find all recent pageable page.
	 *
	 * @param pageRequest the page request
	 * @return the page
	 */
	public Page<Session> findAllRecentPageable(PageRequest pageRequest) {
		return this.sessionRepository.findAllByDateIsGreaterThanEqual(
				LocalDate.now().atStartOfDay().toLocalDate(), pageRequest);
	}
}
