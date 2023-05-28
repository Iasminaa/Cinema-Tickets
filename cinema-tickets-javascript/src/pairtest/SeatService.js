import InvalidSeatAllocationException from './lib/InvalidPurchaseException.js';
import SeatReservationService from "../../thirdparty/seatbooking/SeatReservationService";
import TicketTypeRequest from './lib/TicketTypeRequest.js';

export default class SeatService {
  /**
   * Should only have private methods other than the one below.
   */

  reserveSeats(...ticketTypeRequests) {
    let totalSeatsToAllocate = ticketTypeRequests.filter(ticket => ticket.type === TicketTypeRequest.Type.ADULT || ticket.type === TicketTypeRequest.Type.CHILD)
                      .reduce((acc, ticket) => acc + ticket.getNoOfTickets, 0);
    
    if(totalSeatsToAllocate <= 20){
      try {
        SeatReservationService.reserveSeat(totalSeatsToAllocate); 
      }
      catch(err) {
        throw new Error(InvalidSeatAllocationException); 
      }
    } else {
        throw new Error(InvalidSeatAllocationException); 
    }
  }
}
