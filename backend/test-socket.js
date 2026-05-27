const { io } = require('socket.io-client');

const socket = io(
  'http://localhost:3000',
);

socket.on('connect', () => {
  console.log(
    'Conectado:',
    socket.id,
  );

  socket.emit(
    'join',

    '24617b5f-85e4-4673-9cd4-2b76e0aaefb4',
  );
});

socket.on(
  'notification',

  (data) => {
    console.log(
      'Nova notificação:',
      data,
    );
  },
);