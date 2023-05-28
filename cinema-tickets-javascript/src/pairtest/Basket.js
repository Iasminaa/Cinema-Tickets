import TicketService from '../pairtest/TicketService.js';
import SeatService from '../pairtest/SeatService.js';
import {types} from './Types.js';

export default class Basket {
    #tickets;
    #ticketService
    #seatService
    #MAX_TICKETS = 20; 
    #accountId = 2093874902; 

    constructor(tickets){
        this.#tickets = tickets;
        this.#ticketService = new TicketService(); 
        this.#seatService = new SeatService(); 
    }

    getTicketsNonInfant = () => this.#tickets.filter(ticket => ticket.getTicketType() === types.ADULT || ticket.getTicketType() === types.CHILD); 
    
    getTotalSeats = () => this.getTicketsNonInfant().reduce((acc, ticket) => acc + ticket.getNoOfTickets(), 0);

    isRequestValid() {
        let adultTickets = this.#tickets.filter(ticket => ticket.getTicketType() === types.ADULT)
                                  .reduce((acc, ticket) => acc + ticket.getNoOfTickets(), 0); 
        if (adultTickets <= 0) {
            console.error("Sorry children and infants must be accompanied by an adult"); 
            return false; 
        }

        if(this.getTotalSeats() > this.#MAX_TICKETS){
            console.error(`Sorry a maximum of ${this.#MAX_TICKETS} tickets can be purchased at one time`); 
            return false; 
        }

        return true; 
    }

    book() {
        if (!this.isRequestValid()) {
            return; 
        } 

        try {
          this.#ticketService.purchaseTickets(this.#accountId, this.getTicketsNonInfant()); 
          this.#seatService.reserveSeats(this.#accountId, this.getTotalSeats());
          console.log("Enjoy your movie!"); 
        }
        catch (err) {
            console.error("Sorry there was an issue booking your tickets: ", err); 
            return; 
        }
    }
}