import prompt from 'prompt';
import {TicketTypeRequest} from '../pairtest/lib/TicketTypeRequest';

const questions = [
  'Adults: ',
  'Children: ',
  'Infants: '
];

const tickets = []; 

function askQuestion(index) {
  prompt.get(questions[index], (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    let numberOfTickets = result[questions[index]]; 
    console.log(numberOfTickets);
    tickets.push(new TicketTypeRequest(index,numberOfTickets))
 
    if (index !== questions.length - 1) {
      askQuestion(index + 1);
    }
    else {
        console.log(tickets);
    }
  });
}

prompt.start();
askQuestion(0);

