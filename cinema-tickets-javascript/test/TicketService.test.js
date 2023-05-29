import TicketService from '../src/pairtest/TicketService.js'; 
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';

describe("Happy path - can purchase tickets", () => {
    it.each([
      [3,2,1],
      [1,0,0],
      [1,0,1],
      [1,1,0]
    ])("when the input is '%s'", (adultNo, childNo, infantNo) => {
        const mockPaymentService = jest.fn();
        const mockSeatService = jest.fn();
        mockPaymentService.makePayment = jest.fn(); 
        mockSeatService.reserveSeat = jest.fn();
        let ticketSvc = new TicketService(mockPaymentService, mockSeatService); 
        let adult = new TicketTypeRequest('ADULT', adultNo); 
        let child = new TicketTypeRequest('CHILD', childNo); 
        let infant = new TicketTypeRequest('INFANT', infantNo); 
        expect(() => ticketSvc.purchaseTickets(2093874902, adult, child, infant)).not.toThrow();
    });
  });

describe("business rules violation", () => {
    it.each([
      [0,0,1], // no adult to supervise infant
      [0,1,0], // no adult to supervise child
      [100,20,20] // too many seats 
    ])("when the input is '%s'", (adultNo, childNo, infantNo) => {
        const mockPaymentService = jest.fn();
        const mockSeatService = jest.fn();
        mockPaymentService.makePayment = jest.fn(); 
        mockSeatService.reserveSeat = jest.fn();
        let ticketSvc = new TicketService(mockPaymentService, mockSeatService); 
        let adult = new TicketTypeRequest('ADULT', adultNo); 
        let child = new TicketTypeRequest('CHILD', childNo); 
        let infant = new TicketTypeRequest('INFANT', infantNo); 
        expect(() => ticketSvc.purchaseTickets(2093874902, adult, child, infant)).toThrow(InvalidPurchaseException);
    });
  });

test("Throw exception when third party svc fails", () => {
    const mockPaymentService = jest.fn().mockRejectedValue(InvalidPurchaseException);
    const mockSeatService = jest.fn();
    mockSeatService.reserveSeat = jest.fn();
    let ticketSvc = new TicketService(mockPaymentService, mockSeatService); 
    let adult = new TicketTypeRequest('ADULT', 1); 
    let child = new TicketTypeRequest('CHILD', 1); 
    let infant = new TicketTypeRequest('INFANT', 1); 
    expect(() => ticketSvc.purchaseTickets(2093874902, adult, child, infant)).toThrow(InvalidPurchaseException);
});
        
