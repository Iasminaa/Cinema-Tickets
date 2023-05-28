import prompt from 'prompt';
import TicketTypeRequest from './lib/TicketTypeRequest.js';
import TicketService from './TicketService.js'; 

import {typeList} from './Types.js';

const questions = [
  'Adults: ',
  'Children: ',
  'Infants: '
];

const tickets = []; 

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
        let basket = new TicketService(tickets); 
        basket.purchaseTickets(2093874902);  
    }
  });
}

getCustomerInput(0);


