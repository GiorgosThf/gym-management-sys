package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.model.BaseModel;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The type Base service.
 *
 * @param <T> the type parameter
 */
public abstract class BaseServiceImpl<T extends BaseModel> implements BaseService<T> {

	/**
	 * Gets repository.
	 *
	 * @return the repository
	 */
	public abstract JpaRepository<T, Long> getRepository();

	@Override
	public List<T> findAll() {
		return this.getRepository().findAll();
	}

	@Override
	public List<T> createAll(final List<T> entities) {
		return this.getRepository().saveAll(entities);
	}

	@Override
	public T create(final T entity) {
		return this.getRepository().save(entity);
	}

	@Override
	public T update(final T entity) {
		return this.getRepository().save(entity);
	}

	@Override
	public void delete(final T entity) {
		this.getRepository().delete(entity);
	}

	@Override
	public void deleteById(final Long id) {
		this.getRepository().deleteById(id);
	}

	@Override
	public boolean existsById(final Long id) {
		return this.getRepository().existsById(id);
	}

	@Override
	public T get(final Long id) {
		return this.getRepository()
				.findById(id)
				.orElseThrow(
						() -> new NoSuchElementException(String.format("Entity with id %s not found", id)));
	}
}
