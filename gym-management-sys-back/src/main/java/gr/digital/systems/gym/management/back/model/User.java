package gr.digital.systems.gym.management.back.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gr.digital.systems.gym.management.back.types.UserRole;
import jakarta.persistence.*;
import java.util.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/** The type User. */
@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User extends BaseModel implements UserDetails {

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

	@Column(nullable = false)
	private Boolean enabled;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private UserRole role;

	@Override
	@JsonIgnore
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.singleton(() -> this.role.name());
	}

	@Override
	@JsonIgnore
	public boolean isAccountNonExpired() {
		return this.enabled;
	}

	@Override
	@JsonIgnore
	public boolean isAccountNonLocked() {
		return this.enabled;
	}

	@Override
	@JsonIgnore
	public boolean isCredentialsNonExpired() {
		return this.enabled;
	}

	@Override
	public boolean isEnabled() {
		return this.enabled;
	}

	@Override
	@JsonIgnore
	public String getUsername() {
		return email;
	}

	@Override
	@JsonIgnore
	public String getPassword() {
		return this.password;
	}
}
