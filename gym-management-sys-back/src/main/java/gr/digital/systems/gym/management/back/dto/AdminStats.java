package gr.digital.systems.gym.management.back.dto;

import lombok.*;

/** The type Admin stats. */
@Builder
@Value
public class AdminStats {
	int totalUsers;
	int totalPrograms;
	int activeBookings;
	int pendingRequests;
}
