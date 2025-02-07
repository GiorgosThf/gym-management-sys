package gr.digital.systems.gym.management.back.config;

import gr.digital.systems.gym.management.back.exception.DatabaseSystemException;
import gr.digital.systems.gym.management.back.exception.ManagementSystemException;
import gr.digital.systems.gym.management.back.transfer.ApiError;
import io.jsonwebtoken.ExpiredJwtException;
import java.util.NoSuchElementException;

import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/** The type Exception handler config. */
@RestControllerAdvice
@Configuration
public class ExceptionHandlerConfig {
	private static final Logger LOG = LoggerFactory.getLogger(ExceptionHandlerConfig.class);

	/**
	 * Handle illegal state exception response entity.
	 *
	 * @param ex the ex
	 * @param webRequest the web request
	 * @return the response entity
	 */
	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ApiError> handleIllegalStateException(
			final Throwable ex, final WebRequest webRequest) {
		LOG.error("IllegalStateException caught: {}.", ex.getMessage());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(
						ApiError.builder()
								.description(ex.getMessage())
								.httpStatus(HttpStatus.UNAUTHORIZED.value())
								.path(webRequest.getDescription(false))
								.build());
	}

	/**
	 * Handle null pointer exception response entity.
	 *
	 * @param ex the ex
	 * @param webRequest the web request
	 * @return the response entity
	 */
	@ExceptionHandler(NullPointerException.class)
	public ResponseEntity<ApiError> handleNullPointerException(
			final Throwable ex, final WebRequest webRequest) {
		LOG.error("NullPointerException caught: {}.", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(
						ApiError.builder()
								.description(ex.getMessage())
								.httpStatus(HttpStatus.BAD_REQUEST.value())
								.path(webRequest.getDescription(true))
								.build());
	}

	/**
	 * Handle no such element exception response entity.
	 *
	 * @param ex the ex
	 * @param webRequest the web request
	 * @return the response entity
	 */
	@ExceptionHandler(NoSuchElementException.class)
	public ResponseEntity<ApiError> handleNoSuchElementException(
			final Throwable ex, final WebRequest webRequest) {
		LOG.error("NoSuchElementException caught: {}.", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(
						ApiError.builder()
								.description(ex.getMessage())
								.httpStatus(HttpStatus.BAD_REQUEST.value())
								.path(webRequest.getDescription(false))
								.build());
	}

	/**
	 * Handle management system exception response entity.
	 *
	 * @param ex the ex
	 * @param webRequest the web request
	 * @return the response entity
	 */
	@ExceptionHandler(ManagementSystemException.class)
	protected ResponseEntity<ApiError> handleManagementSystemException(
			final Throwable ex, final WebRequest webRequest) {
		LOG.error("ManagementSystemException caught: {}", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(
						ApiError.builder()
								.description(ex.getMessage())
								.httpStatus(HttpStatus.NOT_FOUND.value())
								.path(webRequest.getDescription(false))
								.build());
	}

	/**
	 * Handle database system exception response entity.
	 *
	 * @param ex the ex
	 * @param webRequest the web request
	 * @return the response entity
	 */
	@ExceptionHandler(DatabaseSystemException.class)
	protected ResponseEntity<ApiError> handleDatabaseSystemException(
			final Throwable ex, final WebRequest webRequest) {
		LOG.error("DatabaseSystemException caught: {}", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(
						ApiError.builder()
								.description(ex.getMessage())
								.httpStatus(HttpStatus.NOT_FOUND.value())
								.path(webRequest.getDescription(false))
								.build());
	}

	/**
	 * Handle method argument not valid response entity.
	 *
	 * @param ex the ex
	 * @param webRequest the web request
	 * @return the response entity
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<ApiError> handleMethodArgumentNotValid(
			final MethodArgumentNotValidException ex, final WebRequest webRequest) {
		LOG.error("MethodArgumentNotValidException caught: {}.", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(
						ApiError.builder()
								.description(ex.getMessage())
								.httpStatus(HttpStatus.NOT_FOUND.value())
								.path(webRequest.getDescription(false))
								.build());
	}

	/**
	 * Handle http message not readable response entity.
	 *
	 * @param ex the ex
	 * @param webRequest the web request
	 * @return the response entity
	 */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	protected ResponseEntity<ApiError> handleHttpMessageNotReadable(
			final HttpMessageNotReadableException ex, final WebRequest webRequest) {
		LOG.error("HttpMessageNotReadableException caught: {}", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(
						ApiError.builder()
								.description(ex.getMessage())
								.httpStatus(HttpStatus.BAD_REQUEST.value())
								.path(webRequest.getDescription(false))
								.build());
	}

	/**
	 * Handle jwt exception response entity.
	 *
	 * @param ex the ex
	 * @param webRequest the web request
	 * @return the response entity
	 */
	@ExceptionHandler(ExpiredJwtException.class)
	protected ResponseEntity<ApiError> handleJwtExpiredException(
			final HttpMessageNotReadableException ex, final WebRequest webRequest) {
		LOG.error("JwtException Expired caught: {}", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(
						ApiError.builder()
								.description(ex.getMessage())
								.httpStatus(HttpStatus.BAD_REQUEST.value())
								.path(webRequest.getDescription(false))
								.build());
	}

	/**
	 * Handle jwt exception response entity.
	 *
	 * @param ex the ex
	 * @param webRequest the web request
	 * @return the response entity
	 */
	@ExceptionHandler(JwtException.class)
	protected ResponseEntity<ApiError> handleJwtException(
			final HttpMessageNotReadableException ex, final WebRequest webRequest) {
		LOG.error("JwtException caught: {}", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(
						ApiError.builder()
								.description(ex.getMessage())
								.httpStatus(HttpStatus.BAD_REQUEST.value())
								.path(webRequest.getDescription(false))
								.build());
	}
}
