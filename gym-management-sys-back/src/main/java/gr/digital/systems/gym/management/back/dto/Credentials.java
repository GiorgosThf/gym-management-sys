package gr.digital.systems.gym.management.back.dto;

import lombok.Builder;
import lombok.Value;

/** The type Credentials. */
@Value
@Builder
public class Credentials {
	String username;
	String password;
}
