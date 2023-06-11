const Ticket = require('../dao/models/Ticket.model');

class TicketService {
    static async createTicket(ticketData) {
        try {
            const ticket = new Ticket(ticketData);
            const savedTicket = await ticket.save();
            return savedTicket;
        } catch (error) {
            throw new Error('Error al crear el ticket');
        }
    }
}

module.exports = TicketService;