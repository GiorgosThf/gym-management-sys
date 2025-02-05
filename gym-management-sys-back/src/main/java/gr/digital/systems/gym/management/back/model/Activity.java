package gr.digital.systems.gym.management.back.model;

import gr.digital.systems.gym.management.back.types.ActivityType;
import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;

/** The type Activity. */
@Entity
@Table(name = "activities")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Activity extends BaseModel {

	@Enumerated(EnumType.STRING)
	private ActivityType type;

	private String message;

	private Instant timestamp;

	@Column(columnDefinition = "jsonb")
	private String metadata;
}
