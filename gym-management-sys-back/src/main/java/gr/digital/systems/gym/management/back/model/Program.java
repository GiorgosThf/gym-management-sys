package gr.digital.systems.gym.management.back.model;

import gr.digital.systems.gym.management.back.types.ProgramType;
import jakarta.persistence.*;
import lombok.*;

/** The type Program. */
@Entity
@Table(name = "programs")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Program extends BaseModel {

	private String name;
	private String description;
	private Integer maxCapacity;
	private Boolean enabled;

	@Enumerated(EnumType.STRING)
	private ProgramType type;
}
