package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.model.Trainer;
import gr.digital.systems.gym.management.back.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The type Trainer service. */
@Service
@Transactional
public class TrainerService extends BaseServiceImpl<Trainer> {

	private final TrainerRepository trainerRepository;

	/**
	 * Instantiates a new Trainer service.
	 *
	 * @param trainerRepository the trainer repository
	 */
	@Autowired
	public TrainerService(TrainerRepository trainerRepository) {
		this.trainerRepository = trainerRepository;
	}

	@Override
	public JpaRepository<Trainer, Long> getRepository() {
		return this.trainerRepository;
	}

	/**
	 * Update by id trainer.
	 *
	 * @param id the id
	 * @param trainerDetails the trainer details
	 * @return the trainer
	 */
	public Trainer updateById(Long id, Trainer trainerDetails) {
		Trainer trainer = this.get(id);
		trainer.setFirstName(trainerDetails.getFirstName());
		trainer.setLastName(trainerDetails.getLastName());
		trainer.setSpecialization(trainerDetails.getSpecialization());
		trainer.setBio(trainerDetails.getBio());
		trainer.setEnabled(trainerDetails.getEnabled());
		return this.trainerRepository.save(trainer);
	}
}
