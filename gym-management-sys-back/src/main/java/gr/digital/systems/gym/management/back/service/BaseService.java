package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.model.BaseModel;
import java.util.List;

/**
 * The interface Base service.
 *
 * @param <T> the type parameter
 */
public interface BaseService<T extends BaseModel> {

	/**
	 * Create t.
	 *
	 * @param entity the entity
	 * @return the t
	 */
	T create(final T entity);

	/**
	 * Create all list.
	 *
	 * @param entities the entities
	 * @return the list
	 */
	List<T> createAll(final List<T> entities);

	/**
	 * Update t.
	 *
	 * @param entity the entity
	 * @return the t
	 */
	T update(T entity);

	/**
	 * Delete.
	 *
	 * @param entity the entity
	 */
	void delete(T entity);

	/**
	 * Delete by id.
	 *
	 * @param id the id
	 */
	void deleteById(Long id);

	/**
	 * Exists by id boolean.
	 *
	 * @param iD the d
	 * @return the boolean
	 */
	boolean existsById(Long iD);

	/**
	 * Get t.
	 *
	 * @param id the id
	 * @return the t
	 */
	T get(Long id);

	/**
	 * Find all list.
	 *
	 * @return the list
	 */
	List<T> findAll();
}
