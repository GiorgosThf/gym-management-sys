package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.dto.AdminStats;
import gr.digital.systems.gym.management.back.dto.UserStats;
import gr.digital.systems.gym.management.back.model.Activity;
import gr.digital.systems.gym.management.back.repository.*;
import gr.digital.systems.gym.management.back.types.RegistrationStatus;
import java.time.LocalDate;
import java.time.ZoneOffset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The type Stats service. */
@Service
@Transactional
public class StatsService {
	private final UserRepository userRepository;
	private final ProgramRepository programRepository;
	private final BookingRepository bookingRepository;
	private final RegistrationRequestRepository registrationRequestRepository;
	private final ActivityRepository activityRepository;

	/**
	 * Instantiates a new Stats service.
	 *
	 * @param userRepository the user repository
	 * @param programRepository the program repository
	 * @param bookingRepository the booking repository
	 * @param registrationRequestRepository the registration request repository
	 * @param activityRepository the activity repository
	 */
	@Autowired
	public StatsService(
			UserRepository userRepository,
			ProgramRepository programRepository,
			BookingRepository bookingRepository,
			RegistrationRequestRepository registrationRequestRepository,
			ActivityRepository activityRepository) {
		this.userRepository = userRepository;
		this.programRepository = programRepository;
		this.bookingRepository = bookingRepository;
		this.registrationRequestRepository = registrationRequestRepository;
		this.activityRepository = activityRepository;
	}

	/**
	 * Calculate admin stats admin stats.
	 *
	 * @return the admin stats
	 */
	public AdminStats calculateAdminStats() {
		return AdminStats.builder()
				.totalPrograms((int) programRepository.count())
				.totalUsers((int) userRepository.count())
				.activeBookings((int) bookingRepository.countAllByCancelledIsFalse())
				.pendingRequests(
						(int)
								registrationRequestRepository.countAllByRegistrationStatus(
										RegistrationStatus.PENDING))
				.build();
	}

	/**
	 * Calculate user stats user stats.
	 *
	 * @param id the id
	 * @return the user stats
	 */
	public UserStats calculateUserStats(Long id) {
		return UserStats.builder()
				.totalBookings(bookingRepository.countAllByUserId(id))
				.upcomingBookings(bookingRepository.countUpcomingByUserId(id))
				.completedPrograms(bookingRepository.countCompletedByUserId(id))
				.build();
	}

	/**
	 * Gets recent activities.
	 *
	 * @param pageRequest the page request
	 * @return the recent activities
	 */
	public Page<Activity> getRecentActivities(PageRequest pageRequest) {
		return this.activityRepository.findAllByTimestampAfter(
				LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC), pageRequest);
	}

	/**
	 * Gets user activities.
	 *
	 * @param id the id
	 * @param pageRequest the page request
	 * @return the user activities
	 */
	public Page<Activity> getUserActivities(Long id, PageRequest pageRequest) {
		return this.activityRepository.findRecentActivitiesByUserId(
				String.valueOf(id), LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC), pageRequest);
	}
}
