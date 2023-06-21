/* eslint-disable no-case-declarations */
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const { Ticket } = require('./ticket');

const app = new Koa();
const tickets = [];

app.use(koaBody({
  urlencoded: true,
}));

app.use(async (ctx) => {
  // const { method } = ctx.request.querystring;
  ctx.response.set({ 'Access-Control-Allow-Origin': '*' });
  const { body } = ctx.request;
  const methodArr = ctx.request.url.split('&');
  const method = decodeURIComponent(ctx.request.url).replace('/?method=', '');
  // eslint-disable-next-line no-console
  // console.log(`method=${method}`);

  switch (method) {
    case 'allTickets':
      // ctx.response.set({ 'Access-Control-Allow-Origin': '*' });
      ctx.response.body = tickets;
      return;

    case 'ticketById':
      // eslint-disable-next-line no-case-declarations
      const id = methodArr[1].replace('id=', '');
      const tick = tickets.find((o) => o.id === id);
      if (tick) {
        ctx.response.body = tick;
        // eslint-disable-next-line no-console
        // console.log(tick);
      }
      return;

    case 'createTicket':
      // eslint-disable-next-line no-case-declarations
      let ticket;
      if (Object.keys(body).includes('id') && body.id) {
        ticket = tickets.find((o) => o.id === body.id);
        if (ticket) {
          ticket.name = body.name;
          ticket.description = body.description;
        }
      } else {
        ticket = new Ticket({
          name: body.name,
          description: body.description,
        });
        tickets.push(ticket);
      }
      ctx.response.body = ticket;
      return;

    case 'setStatus':
      if (body.id) {
        const tick2 = tickets.find((o) => o.id === body.id);
        if (tick2) {
          tick2.status = body.status;
        }
      }
      ctx.response.body = {};
      return;

    case 'delete':
      if (body.id) {
        const ticketIndex = tickets.findIndex((o) => o.id === body.id);
        if (ticketIndex >= 0) {
          tickets.splice(ticketIndex, 1);
        }
      }
      ctx.response.body = {};
      return;

    // eslint-disable-next-line no-fallthrough
    default:
      ctx.response.status = 404;
  }
});

// eslint-disable-next-line no-unused-vars
let port;
if (Object.keys(process.env).includes('PORT')) {
  port = process.env.PORT;
} else {
  port = 7070;
}

// app.listen(PORT, () => console.log(`Koa server has been started on port ${PORT} ...`));
const server = http.createServer(app.listen(port, () => console.log(`Koa server has been started on port ${port} ...`)));