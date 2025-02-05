package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.model.Program;
import gr.digital.systems.gym.management.back.repository.ProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The type Program service. */
@Service
@Transactional
public class ProgramService extends BaseServiceImpl<Program> {

	private final ProgramRepository programRepository;

	/**
	 * Instantiates a new Program service.
	 *
	 * @param programRepository the program repository
	 */
	@Autowired
	public ProgramService(ProgramRepository programRepository) {
		this.programRepository = programRepository;
	}

	@Override
	public JpaRepository<Program, Long> getRepository() {
		return this.programRepository;
	}

	/**
	 * Update by id program.
	 *
	 * @param id the id
	 * @param programDetails the program details
	 * @return the program
	 */
	public Program updateById(Long id, Program programDetails) {
		Program program = this.get(id);
		program.setName(programDetails.getName());
		program.setDescription(programDetails.getDescription());
		program.setMaxCapacity(programDetails.getMaxCapacity());
		return this.programRepository.save(program);
	}

	/**
	 * Find all pageable page.
	 *
	 * @param pageRequest the page request
	 * @return the page
	 */
	public Page<Program> findAllPageable(PageRequest pageRequest) {
		return this.programRepository.findAllBy(pageRequest);
	}
}
