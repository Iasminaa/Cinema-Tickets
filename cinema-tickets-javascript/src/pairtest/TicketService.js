import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from "../../thirdparty/paymentgateway/TicketPaymentService";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    ticketTypeRequests.forEach((ticket) => {
      try {
        TicketPaymentService.makePayment(accountId, ticket.getNoOfTickets()*ticket.getPrice()); 
      }
      catch(err) {
        throw new Error(InvalidPurchaseException); 
      }
    });
  }
}
