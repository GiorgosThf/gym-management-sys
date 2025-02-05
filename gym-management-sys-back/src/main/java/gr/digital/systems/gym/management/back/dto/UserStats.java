package gr.digital.systems.gym.management.back.dto;

import lombok.*;

/** The type User stats. */
@Builder
@Value
public class UserStats {
	int totalBookings;
	int upcomingBookings;
	int completedPrograms;
}
