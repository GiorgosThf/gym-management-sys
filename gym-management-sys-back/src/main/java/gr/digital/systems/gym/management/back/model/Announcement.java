package gr.digital.systems.gym.management.back.model;

import gr.digital.systems.gym.management.back.types.AnnouncementType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

/** The type Announcement. */
@Entity
@Table(name = "announcements")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Announcement extends BaseModel {

	private String title;
	private String content;

	@Enumerated(EnumType.STRING)
	private AnnouncementType type;

	private LocalDateTime createdAt;
}
