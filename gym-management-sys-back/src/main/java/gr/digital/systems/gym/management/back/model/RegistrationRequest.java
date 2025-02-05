package gr.digital.systems.gym.management.back.model;

import gr.digital.systems.gym.management.back.types.RegistrationStatus;
import jakarta.persistence.*;
import lombok.*;

/** The type Registration request. */
@Entity
@Table(name = "registration_requests")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistrationRequest extends BaseModel {

	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String firstName;

	@Column(nullable = false)
	private String lastName;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String country;

	@Column(nullable = false)
	private String city;

	@Column(nullable = false)
	private String address;

	@Enumerated(EnumType.STRING)
	private RegistrationStatus registrationStatus;
}
