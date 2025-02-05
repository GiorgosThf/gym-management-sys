package gr.digital.systems.gym.management.back.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

/** The type Booking. */
@Entity
@Table(name = "bookings")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Booking extends BaseModel {

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "session_id", nullable = false)
	private Session session;

	private LocalDateTime createdAt;

	@Column(nullable = false)
	private boolean cancelled;
}
