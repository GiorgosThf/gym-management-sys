package gr.digital.systems.gym.management.back.repository;

import gr.digital.systems.gym.management.back.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** The interface User repository. */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	/**
	 * Find by email user.
	 *
	 * @param email the email
	 * @return the user
	 */
	User findByEmail(String email);

	/**
	 * Find all by id is not list.
	 *
	 * @param id the id
	 * @return the list
	 */
	List<User> findAllByIdIsNot(Long id);
}
