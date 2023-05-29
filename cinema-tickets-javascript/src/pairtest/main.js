import prompt from 'prompt';
import TicketTypeRequest from './lib/TicketTypeRequest.js';
import TicketService from './TicketService.js'; 
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

import {typeList} from './Types.js';

const questions = [
  'Adults: ',
  'Children: ',
  'Infants: '
];

const tickets = []; 
let paymentService = new TicketPaymentService(); 
let seatService = new SeatReservationService(); 
let ticketSvc = new TicketService(paymentService, seatService); 

function getCustomerInput(index) {
  prompt.get(questions[index], (err, result) => {
    if (err) {
      console.error("Error loading the questions: ", err);
      return;
    }

    try {
        let numberOfTickets = parseInt(result[questions[index]]); 
        tickets.push(new TicketTypeRequest(typeList[index], numberOfTickets))
    }
    catch(err) {
        console.error("Invalid input: ", err);
        index = index - 1; 
    }

    if (index !== questions.length - 1) {
        getCustomerInput(index + 1);
    } 
    else {
        ticketSvc.purchaseTickets(2093874902, tickets[0], tickets[1], tickets[2]);
    }
  });
}

getCustomerInput(0);


