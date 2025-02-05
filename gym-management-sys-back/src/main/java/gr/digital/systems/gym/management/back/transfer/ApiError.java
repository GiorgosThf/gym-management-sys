package gr.digital.systems.gym.management.back.transfer;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Value;

/** The type Api error. */
@Value
@Builder
public class ApiError {
	String description;
	Integer httpStatus;
	String path;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd hh:mm:ss.SSS")
	LocalDateTime timestamp = LocalDateTime.now();
}
