package gr.digital.systems.gym.management.back.repository;

import gr.digital.systems.gym.management.back.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** The interface Trainer repository. */
@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {}
