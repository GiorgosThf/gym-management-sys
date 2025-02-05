package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.model.Announcement;
import gr.digital.systems.gym.management.back.repository.AnnouncementRepository;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The type Announcement service. */
@Service
@Transactional
public class AnnouncementService extends BaseServiceImpl<Announcement> {

	private final AnnouncementRepository announcementRepository;

	/**
	 * Instantiates a new Announcement service.
	 *
	 * @param announcementRepository the announcement repository
	 */
	@Autowired
	public AnnouncementService(AnnouncementRepository announcementRepository) {
		this.announcementRepository = announcementRepository;
	}

	@Override
	public JpaRepository<Announcement, Long> getRepository() {
		return this.announcementRepository;
	}

	@Override
	public Announcement create(final Announcement announcement) {
		return this.getRepository()
				.save(
						Announcement.builder()
								.title(announcement.getTitle())
								.type(announcement.getType())
								.content(announcement.getContent())
								.createdAt(LocalDateTime.now())
								.build());
	}

	/**
	 * Update by id announcement.
	 *
	 * @param id the id
	 * @param announcementDetails the announcement details
	 * @return the announcement
	 */
	public Announcement updateById(final Long id, final Announcement announcementDetails) {
		Announcement announcement = announcementRepository.getReferenceById(id);
		announcement.setCreatedAt(announcementDetails.getCreatedAt());
		announcement.setType(announcementDetails.getType());
		announcement.setTitle(announcementDetails.getTitle());
		announcement.setContent(announcementDetails.getContent());
		return announcementRepository.save(announcement);
	}
}
