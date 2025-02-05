package gr.digital.systems.gym.management.back.repository;

import gr.digital.systems.gym.management.back.model.Activity;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/** The interface Activity repository. */
public interface ActivityRepository extends JpaRepository<Activity, Long> {
	/**
	 * Find recent activities by user id page.
	 *
	 * @param userId the user id
	 * @param timestamp the timestamp
	 * @param pageRequest the page request
	 * @return the page
	 */
	@Query(
			value =
					"SELECT * FROM activities WHERE activities.timestamp > :timestamp AND metadata ->> 'userId' = :userId ORDER BY timestamp DESC",
			nativeQuery = true)
	Page<Activity> findRecentActivitiesByUserId(
			String userId, Instant timestamp, PageRequest pageRequest);

	/**
	 * Find all by timestamp after page.
	 *
	 * @param timestamp the timestamp
	 * @param pageRequest the page request
	 * @return the page
	 */
	Page<Activity> findAllByTimestampAfter(Instant timestamp, PageRequest pageRequest);
}
