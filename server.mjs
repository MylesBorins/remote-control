import SocketIO from 'socket.io';
import pino from 'pino';
import {SamsungTV} from 'samsungtv';

import { createStaticServer } from './lib/static-server.js';

const logger = pino({
  level: 'info'
});

const app = createStaticServer();

const io = new SocketIO(app.server);

const TV = new SamsungTV('192.168.1.94', 'c0:97:27:1f:1e:c2')
await TV.connect();

io.on('connection', (socket) => {
  logger.info('new session connected')
  socket.on('message', async message => {
    logger.info(message);
    await TV.sendKey(message);
  });
  socket.on('disconnect', () => {
    logger.info('session disconnected');
  });
});

app.listen(3000, (err) => console.error(err));
