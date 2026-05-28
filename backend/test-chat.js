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
    'join-project',

    '82e86eb9-853b-4f21-b7b2-f32011412d8b',
  );
  socket.emit(
  'user-online',

  '24617b5f-85e4-4673-9cd4-2b76e0aaefb4',
);

  socket.emit(
    'typing',

    {
      projectId:
        '82e86eb9-853b-4f21-b7b2-f32011412d8b',

      userName:
        'Alisson',
    },
  );

  setTimeout(() => {
    socket.emit(
      'send-message',

      {
        content:
          'Teste realtime',

        projectId:
          '82e86eb9-853b-4f21-b7b2-f32011412d8b',

        senderId:
          '24617b5f-85e4-4673-9cd4-2b76e0aaefb4',
      },
    );
  }, 2000);
});

socket.on(
  'receive-message',

  (data) => {
    console.log(
      'Nova mensagem:',
      data,
    );
  },
);

socket.on(
  'user-typing',

  (data) => {
    console.log(
      `${data.userName} está digitando...`,
    );
  },
);
socket.on(
  'users-online',

  (users) => {
    console.log(
      'Usuários online:',
      users,
    );
  },
);