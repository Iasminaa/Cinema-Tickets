import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import {types} from './Types.js';

export default class TicketService {
    #tickets;
    #paymentService
    #seatService
    #MAX_TICKETS = 20; 

    constructor(tickets){
        this.#tickets = tickets;
        this.#paymentService = new TicketPaymentService(); 
        this.#seatService = new SeatReservationService(); 
    }

    #getTicketsNonInfant = () => this.#tickets.filter(ticket => ticket.getTicketType() === types.ADULT || ticket.getTicketType() === types.CHILD); 
    
    #getTotalSeats = () => this.#getTicketsNonInfant().reduce((acc, ticket) => acc + ticket.getNoOfTickets(), 0);

    #getTotalPrice = () => this.#getTicketsNonInfant().reduce((acc, ticket) => acc + ticket.getNoOfTickets() * ticket.getPrice(), 0);
    
    #isRequestValid() {
        let adultTickets = this.#tickets.filter(ticket => ticket.getTicketType() === types.ADULT)
                                  .reduce((acc, ticket) => acc + ticket.getNoOfTickets(), 0); 
        if (adultTickets <= 0) {
           return "Sorry children and infants must be accompanied by an adult"; 
        }

        if(this.#getTotalSeats() > this.#MAX_TICKETS){
            return `Sorry a maximum of ${this.#MAX_TICKETS} tickets can be purchased at one time`;
        }

        return null; 
    }

    purchaseTickets(accountId, ...ticketTypeRequests) {
        let errMsg = this.#isRequestValid(); 
        if (errMsg != null) {
            throw new InvalidPurchaseException("Sorry there was an issue booking your tickets: "+errMsg);
        } 

        try {
              let numberOfSeatsToReserve = this.#getTotalSeats(); 
              let totalPrice = this.#getTotalPrice(); 
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