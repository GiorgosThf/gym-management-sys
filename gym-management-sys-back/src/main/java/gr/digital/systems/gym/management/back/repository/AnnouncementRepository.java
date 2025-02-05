package gr.digital.systems.gym.management.back.repository;

import gr.digital.systems.gym.management.back.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** The interface Announcement repository. */
@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {}
