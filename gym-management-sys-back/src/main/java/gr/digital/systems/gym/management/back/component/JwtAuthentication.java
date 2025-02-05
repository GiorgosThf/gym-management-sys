package gr.digital.systems.gym.management.back.component;

import gr.digital.systems.gym.management.back.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthentication extends OncePerRequestFilter {

	private final JwtUtils jwtUtils;
	private final UserDetailsService userDetailsService;

	public JwtAuthentication(JwtUtils jwtUtils, UserDetailsService userDetailsService) {
		this.jwtUtils = jwtUtils;
		this.userDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain)
			throws ServletException, IOException {
		final String authHeader = request.getHeader("Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		final String jwt = authHeader.substring(7);
		final String userEmail = jwtUtils.extractUsername(jwt);

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (userEmail != null && authentication == null) {
			UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

			if (jwtUtils.isTokenValid(jwt, userDetails)) {
				UsernamePasswordAuthenticationToken authToken =
						new UsernamePasswordAuthenticationToken(
								userDetails, null, userDetails.getAuthorities());

				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authToken);
			}
		}

		filterChain.doFilter(request, response);
	}
}
