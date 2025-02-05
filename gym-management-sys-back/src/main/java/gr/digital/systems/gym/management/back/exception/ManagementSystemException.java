package gr.digital.systems.gym.management.back.exception;

/** The type Management system exception. */
public class ManagementSystemException extends RuntimeException {
	/**
	 * Instantiates a new Management system exception.
	 *
	 * @param message the message
	 */
	public ManagementSystemException(final String message) {
		super(message);
	}

	/**
	 * Instantiates a new Management system exception.
	 *
	 * @param message the message
	 * @param cause the cause
	 */
	public ManagementSystemException(final String message, final Throwable cause) {
		super(message, cause);
	}
}
