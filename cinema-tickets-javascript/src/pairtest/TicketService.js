import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import InvalidSeatAllocationException from './lib/InvalidPurchaseException.js';
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import {types} from './Types.js';

export default class Basket {
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
            console.error("Sorry children and infants must be accompanied by an adult"); 
            return false; 
        }

        if(this.#getTotalSeats() > this.#MAX_TICKETS){
            console.error(`Sorry a maximum of ${this.#MAX_TICKETS} tickets can be purchased at one time`); 
            return false; 
        }

        return true; 
    }

    purchaseTickets(accountId, ...ticketTypeRequests) {
        if (!this.#isRequestValid()) {
            return; 
        } 

        try {
          
          let numberOfSeatsToReserve = this.#getTotalSeats(); 
          let totalPrice = this.#getTotalPrice(); 

          try {
            this.#paymentService.makePayment(accountId, totalPrice); 
          }
          catch(err) {
            throw new Error(err); 
          }

          try {
            this.#seatService.reserveSeat(accountId, numberOfSeatsToReserve); 
          }
          catch(err) {
            throw new Error(err); 
          }
    
          console.log(` \nORDER CONFIRMATION: 
                        \nAccount: ${accountId} 
                        \n${numberOfSeatsToReserve} seats reserved
                        \nTotal £${totalPrice} 
                        \nThank you for booking with us!\n\n`); 
        }
        catch (err) {
            console.error("Sorry there was an issue booking your tickets: ", err); 
            return; 
        }
    }
}