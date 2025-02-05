package gr.digital.systems.gym.management.back.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;

/** The type Base model. */
@Getter
@ToString
@MappedSuperclass
public abstract class BaseModel {
	@Id
	@Column(updatable = false)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
}
