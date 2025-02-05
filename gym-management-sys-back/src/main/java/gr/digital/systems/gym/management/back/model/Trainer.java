package gr.digital.systems.gym.management.back.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

/** The type Trainer. */
@Entity
@Table(name = "trainers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Trainer extends BaseModel {

	@Column(nullable = false, unique = true)
	@Email
	private String email;

	private String firstName;
	private String lastName;
	private String specialization;
	private String bio;
	private Boolean enabled;
}
