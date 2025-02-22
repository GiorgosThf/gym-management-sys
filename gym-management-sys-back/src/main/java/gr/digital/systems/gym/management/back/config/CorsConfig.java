package gr.digital.systems.gym.management.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** The type Cors config. */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry
				.addMapping("/**")
				.allowedOrigins(
						"http://localhost:5173",
						"http://localhost:4173",
						"http://localhost:8080",
						"http://localhost:8081",
						"http://localhost:3000")
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
				.allowedHeaders("Authorization", "Content-Type", "X-Frame-Options")
				.exposedHeaders("Authorization")
				.allowCredentials(true);
	}
}
