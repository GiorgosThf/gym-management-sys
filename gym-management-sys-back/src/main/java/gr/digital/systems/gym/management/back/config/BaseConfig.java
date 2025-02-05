package gr.digital.systems.gym.management.back.config;

import gr.digital.systems.gym.management.back.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/** The type Base config. */
@Configuration
public class BaseConfig {

	private final UserRepository userRepository;

	/**
	 * Instantiates a new Base config.
	 *
	 * @param userRepository the user repository
	 */
	@Autowired
	public BaseConfig(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * User details service user details service.
	 *
	 * @return the user details service
	 */
	@Bean
	UserDetailsService userDetailsService() {
		return userRepository::findByEmail;
	}

	/**
	 * Password encoder b crypt password encoder.
	 *
	 * @return the b crypt password encoder
	 */
	@Bean
	BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	/**
	 * Authentication provider.
	 *
	 * @return the authentication provider
	 */
	@Bean
	AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService());
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}
}
