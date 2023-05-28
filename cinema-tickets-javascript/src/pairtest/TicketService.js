import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #paymentService
  constructor() {
    this.#paymentService = new TicketPaymentService(); 
  }
 
  purchaseTickets(accountId, totalAmountToPay) {
      try {
        this.#paymentService.makePayment(accountId, totalAmountToPay); 
      }
      catch(err) {
        throw new Error(err); 
      }
  }
}
