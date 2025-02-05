package gr.digital.systems.gym.management.back.transfer;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Value;

/**
 * The type Api response.
 *
 * @param <T> the type parameter
 */
@Value
@Builder
public class ApiResponse<T> {
	T data;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd hh:mm:ss.SSS")
	LocalDateTime timestamp = LocalDateTime.now();
}
