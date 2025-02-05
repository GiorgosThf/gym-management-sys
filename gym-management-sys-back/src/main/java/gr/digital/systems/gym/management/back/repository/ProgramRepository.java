package gr.digital.systems.gym.management.back.repository;

import gr.digital.systems.gym.management.back.model.Program;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** The interface Program repository. */
@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
	/**
	 * Find all by page.
	 *
	 * @param pageable the pageable
	 * @return the page
	 */
	Page<Program> findAllBy(Pageable pageable);
}
