import TicketPaymentService from "../../thirdparty/paymentgateway/TicketPaymentService";
import SeatReservationService from "../../thirdparty/seatbooking/SeatReservationService";

export default class Adult extends TicketTypeRequest {
    PRICE = 20; 
    #accountId

    constructor(type, noOfTickets, accountId) {
        super(type, noOfTickets); 
        this.#accountId = accountId;
    }
    
    pay() {
        TicketPaymentService.makePayment(accountId, this.getNoOfTickets()*PRICE); 
    }

    allocateSeat() {
        SeatReservationService.reserveSeat(this.getNoOfTickets()); 
    }

    isValid = () => this.getNoOfTickets() > 0; 

    book () {
        if (isValid()) {
            pay();
            allocateSeat(); 
        }
    }
}