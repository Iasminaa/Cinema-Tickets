import InvalidSeatAllocationException from './lib/InvalidPurchaseException.js';
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

export default class SeatService {
  /**
   * Should only have private methods other than the one below.
   */
  #seatService
  constructor() {
    this.#seatService = new SeatReservationService(); 
  }
 
  reserveSeats(accountId, totalSeatsToAllocate) {
    try {
      this.#seatService.reserveSeat(accountId, totalSeatsToAllocate); 
    }
    catch(err) {
      throw new Error(err); 
    }
  }
}
