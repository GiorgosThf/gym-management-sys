package gr.digital.systems.gym.management.back.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.*;

/** The type Session. */
@Entity
@Table(name = "sessions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Session extends BaseModel {

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "program_id", nullable = false)
	private Program program;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "trainer_id", nullable = false)
	private Trainer trainer;

	private LocalDate date;
	private LocalTime startTime;
	private LocalTime endTime;
	private Integer currentBookings;
	private Integer maxCapacity;
}
