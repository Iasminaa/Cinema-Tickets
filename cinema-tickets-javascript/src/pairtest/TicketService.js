import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import {types} from './Types.js';

export default class TicketService {
    #paymentService
    #seatService
    #MAX_TICKETS = 20; 

    constructor(paymentService, seatService){
        this.#paymentService = paymentService;
        this.#seatService = seatService;
    }

    #getTicketsNonInfant = (ticketTypeRequests) => ticketTypeRequests.filter(ticket => ticket.getTicketType() === types.ADULT || ticket.getTicketType() === types.CHILD); 
    
    #getTotalSeats = (ticketTypeRequests) => this.#getTicketsNonInfant(ticketTypeRequests).reduce((acc, ticket) => acc + ticket.getNoOfTickets(), 0);

    #getTotalPrice = (ticketTypeRequests) => this.#getTicketsNonInfant(ticketTypeRequests).reduce((acc, ticket) => acc + ticket.getNoOfTickets() * ticket.getPrice(), 0);
    
    #isRequestValid(ticketTypeRequests) {
        let adultTickets = ticketTypeRequests.filter(ticket => ticket.getTicketType() === types.ADULT)
                                  .reduce((acc, ticket) => acc + ticket.getNoOfTickets(), 0); 
        if (adultTickets <= 0) {
           return "Sorry children and infants must be accompanied by an adult"; 
        }

        if(this.#getTotalSeats(ticketTypeRequests) > this.#MAX_TICKETS){
            return `Sorry a maximum of ${this.#MAX_TICKETS} tickets can be purchased at one time`;
        }

        return null; 
    }

    purchaseTickets(accountId, ...ticketTypeRequests) {
        let errMsg = this.#isRequestValid(ticketTypeRequests); 
        if (errMsg != null) {
            throw new InvalidPurchaseException("Sorry there was an issue booking your tickets: "+errMsg);
        } 

        try {
              let numberOfSeatsToReserve = this.#getTotalSeats(ticketTypeRequests); 
              let totalPrice = this.#getTotalPrice(ticketTypeRequests); 
              this.#paymentService.makePayment(accountId, totalPrice); 
              this.#seatService.reserveSeat(accountId, numberOfSeatsToReserve); 
          
              console.log(` \nORDER CONFIRMATION: 
                            \nAccount: ${accountId} 
                            \n${numberOfSeatsToReserve} seats reserved
                            \nTotal £${totalPrice} 
                            \nThank you for booking with us!\n\n`); 
        }
        catch (err) {
            throw new InvalidPurchaseException("Sorry there was an issue booking your tickets: "+err.message);
        }
    }
}