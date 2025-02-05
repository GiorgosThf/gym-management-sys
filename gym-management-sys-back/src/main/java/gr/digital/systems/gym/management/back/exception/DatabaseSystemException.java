package gr.digital.systems.gym.management.back.exception;

/** The type Database system exception. */
public class DatabaseSystemException extends RuntimeException {

	/**
	 * Instantiates a new Database system exception.
	 *
	 * @param message the message
	 */
	public DatabaseSystemException(String message) {
		super(extractPostgresSQLError(message));
	}

	/**
	 * Instantiates a new Database system exception.
	 *
	 * @param message the message
	 * @param cause the cause
	 */
	public DatabaseSystemException(final String message, final Throwable cause) {
		super(extractPostgresSQLError(message), cause);
	}

	/**
	 * Extract postgres sql error string.
	 *
	 * @param fullMessage the full message
	 * @return the string
	 */
	public static String extractPostgresSQLError(String fullMessage) {
		if (fullMessage.contains("[ERROR:") && fullMessage.contains("Where:")) {
			return fullMessage.split("\\[ERROR:")[1].split("Where:")[0].trim();
		}
		return "An unknown error occurred.";
	}
}
