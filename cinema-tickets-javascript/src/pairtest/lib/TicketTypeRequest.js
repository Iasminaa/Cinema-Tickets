/**
 * Immutable Object.
 */
export default class TicketTypeRequest {
  #type;

  #noOfTickets;

  constructor(type, noOfTickets) {
    if (!this.#Type.includes(type)) {
      throw new TypeError(`type must be ${this.#Type.slice(0, -1).join(', ')}, or ${this.#Type.slice(-1)}`);
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError('noOfTickets must be an integer');
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }

  getPrice() {
    if(this.#type.getTicketType === this.#type.ADULT){
      return 20; 
    }

    if(this.#type.getTicketType === this.#type.CHILD){
      return 10; 
    }
    
    return 0; 
  }

  #Type = ['ADULT', 'CHILD', 'INFANT'];
}
