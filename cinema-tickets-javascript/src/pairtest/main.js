import prompt from 'prompt';
import TicketTypeRequest from './lib/TicketTypeRequest.js';
import TicketService from '../pairtest/TicketService.js';
import SeatService from '../pairtest/SeatService.js';
import {typeList} from '../pairtest/types.js';

const questions = [
  'Adults: ',
  'Children: ',
  'Infants: '
];

const tickets = []; 

const accountId = 2093874902; 
let ticketService = new TicketService(); 
let seatService = new SeatService(); 

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
          try {
            ticketService.purchaseTickets(accountId, tickets); 
            seatService.reserveSeats(accountId, tickets); 
          }
          catch (err) {
              console.error("Sorry there was an issue booking your tickets: ", err); 
          }
    }
  });
}

getCustomerInput(0);


