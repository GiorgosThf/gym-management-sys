package gr.digital.systems.gym.management.back.repository;

import gr.digital.systems.gym.management.back.model.Session;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** The interface Session repository. */
@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
	/**
	 * Find all by date is greater than equal list.
	 *
	 * @param date the date
	 * @return the list
	 */
	List<Session> findAllByDateIsGreaterThanEqual(LocalDate date);

	/**
	 * Find all by date is greater than equal page.
	 *
	 * @param date the date
	 * @param pageable the pageable
	 * @return the page
	 */
	Page<Session> findAllByDateIsGreaterThanEqual(LocalDate date, Pageable pageable);
}
