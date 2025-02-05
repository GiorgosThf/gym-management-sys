package gr.digital.systems.gym.management.back.repository;

import gr.digital.systems.gym.management.back.model.Booking;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** The interface Booking repository. */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
	/**
	 * Cancel booking.
	 *
	 * @param bookingId the booking id
	 * @param userId the user id
	 * @param currentTime the current time
	 */
	@Procedure(name = "cancel_booking")
	void cancel_booking(
			@Param("p_booking_id") Long bookingId,
			@Param("p_user_id") Long userId,
			@Param("p_current_time") LocalDateTime currentTime);

	/**
	 * Create booking booking.
	 *
	 * @param userId the user id
	 * @param sessionId the session id
	 * @param currentTime the current time
	 * @return the booking
	 */
	@Query(
			value = "SELECT * FROM create_booking(:p_user_id, :p_session_id, :p_current_time)",
			nativeQuery = true)
	Booking create_booking(
			@Param("p_user_id") Long userId,
			@Param("p_session_id") Long sessionId,
			@Param("p_current_time") LocalDateTime currentTime);

	/**
	 * Count all by cancelled is false long.
	 *
	 * @return the long
	 */
	long countAllByCancelledIsFalse();

	/**
	 * Find all by user id list.
	 *
	 * @param id the id
	 * @return the list
	 */
	List<Booking> findAllByUserId(Long id);

	/**
	 * Find by user id and id booking.
	 *
	 * @param id the id
	 * @param bid the bid
	 * @return the booking
	 */
	Booking findByUserIdAndId(Long id, Long bid);

	/**
	 * Count all by user id int.
	 *
	 * @param userId the user id
	 * @return the int
	 */
	int countAllByUserId(Long userId);

	/**
	 * Count upcoming by user id int.
	 *
	 * @param userId the user id
	 * @return the int
	 */
	@Query(
			"SELECT COUNT(b) FROM Booking b WHERE b.user.id = :userId AND b.cancelled = false "
					+ "AND (b.session.date > CURRENT_DATE OR (b.session.date = CURRENT_DATE AND b.session.startTime > CURRENT_TIME))")
	int countUpcomingByUserId(Long userId);

	/**
	 * Count completed by user id int.
	 *
	 * @param userId the user id
	 * @return the int
	 */
	@Query(
			"SELECT COUNT(b) FROM Booking b WHERE b.user.id = :userId AND b.cancelled = false "
					+ "AND (b.session.date < CURRENT_DATE OR (b.session.date = CURRENT_DATE AND b.session.endTime < CURRENT_TIME))")
	int countCompletedByUserId(Long userId);
}
