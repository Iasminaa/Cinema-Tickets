import InvalidSeatAllocationException from './lib/InvalidPurchaseException.js';
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import {types} from '../pairtest/types.js';

export default class SeatService {
  /**
   * Should only have private methods other than the one below.
   */
  #seatService
  constructor() {
    this.#seatService = new SeatReservationService(); 
  }
 
  reserveSeats(accountId, ticketTypeRequests) {
    let totalSeatsToAllocate = ticketTypeRequests.filter(ticket => ticket.getTicketType() === types.ADULT || 
                                                        ticket.getTicketType() === types.CHILD)
                      .reduce((acc, ticket) => acc + ticket.getNoOfTickets(), 0);
    
    if(totalSeatsToAllocate <= 20){
      try {
        this.#seatService.reserveSeat(accountId, totalSeatsToAllocate); 
      }
      catch(err) {
        throw new Error(err); 
      }
    } else {
        throw new Error(err); 
    }
  }
}
