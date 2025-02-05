package gr.digital.systems.gym.management.back.service;

import gr.digital.systems.gym.management.back.exception.DatabaseSystemException;
import gr.digital.systems.gym.management.back.model.Booking;
import gr.digital.systems.gym.management.back.repository.BookingRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The type Booking service. */
@Service
@Transactional
public class BookingService extends BaseServiceImpl<Booking> {
	private final BookingRepository bookingRepository;

	/**
	 * Instantiates a new Booking service.
	 *
	 * @param bookingRepository the booking repository
	 */
	@Autowired
	public BookingService(final BookingRepository bookingRepository) {
		this.bookingRepository = bookingRepository;
	}

	@Override
	public JpaRepository<Booking, Long> getRepository() {
		return this.bookingRepository;
	}

	/**
	 * Find all by user list.
	 *
	 * @param id the id
	 * @return the list
	 */
	public List<Booking> findAllByUser(Long id) {
		return bookingRepository.findAllByUserId(id);
	}

	/**
	 * Find user booking booking.
	 *
	 * @param id the id
	 * @param bid the bid
	 * @return the booking
	 */
	public Booking findUserBooking(Long id, Long bid) {
		return bookingRepository.findByUserIdAndId(id, bid);
	}

	/**
	 * Update by id booking.
	 *
	 * @param id the id
	 * @param bookingDetails the booking details
	 * @return the booking
	 */
	public Booking updateById(Long id, Booking bookingDetails) {
		Booking booking = this.get(id);
		booking.setSession(bookingDetails.getSession());
		booking.setUser(bookingDetails.getUser());
		booking.setCreatedAt(bookingDetails.getCreatedAt());
		booking.setCancelled(bookingDetails.isCancelled());
		return this.bookingRepository.save(booking);
	}

	@Override
	public Booking create(Booking booking) {
		try {
			booking.setCancelled(Boolean.FALSE);
			booking.setCreatedAt(LocalDateTime.now());
			return this.bookingRepository.create_booking(
					booking.getUser().getId(), booking.getSession().getId(), LocalDateTime.now());
		} catch (final Exception e) {
			throw new DatabaseSystemException(e.getMessage());
		}
	}

	/**
	 * Cancel.
	 *
	 * @param id the id
	 */
	public void cancel(Long id) {
		try {
			var booking = this.get(id);
			this.bookingRepository.cancel_booking(
					booking.getId(), booking.getUser().getId(), LocalDateTime.now());
		} catch (Exception e) {
			throw new DatabaseSystemException(e.getMessage());
		}
	}
}
