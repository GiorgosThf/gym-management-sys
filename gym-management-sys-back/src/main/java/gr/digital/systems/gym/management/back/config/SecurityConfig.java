package gr.digital.systems.gym.management.back.config;

import gr.digital.systems.gym.management.back.component.JwtAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/** The type Security config. */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	private final JwtAuthentication jwtAuthentication;
	private final AuthenticationProvider authenticationProvider;

	/**
	 * Instantiates a new Security config.
	 *
	 * @param jwtAuthentication the jwt authentication
	 * @param authenticationProvider the authentication provider
	 */
	@Autowired
	public SecurityConfig(
			final JwtAuthentication jwtAuthentication, AuthenticationProvider authenticationProvider) {
		this.jwtAuthentication = jwtAuthentication;
		this.authenticationProvider = authenticationProvider;
	}

	/**
	 * Security filter chain security filter chain.
	 *
	 * @param http the http
	 * @return the security filter chain
	 * @throws Exception the exception
	 */
	@Bean
	public SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable)
				.cors(Customizer.withDefaults())
				.authorizeHttpRequests(
						auth ->
								auth.requestMatchers(
												"/swagger-ui*/**",
												"/swagger-ui*/*swagger-initializer.js",
												"/swagger-ui.html",
												"/error",
												"/actuator/**",
												"/swagger-ui/**",
												"/v3/api-docs/**",
												"/swagger-ui/index.html",
												"/api/auth/register",
												"/api/auth/login",
												"/h2-console/**",
												"/api/programs/page",
												"/api/sessions",
												"/api/programs")
										.permitAll()
										.anyRequest()
										.authenticated())
				.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
				.authenticationProvider(authenticationProvider)
				.sessionManagement(
						session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(this.jwtAuthentication, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
