'use strict';
require('dotenv').config()
const BootBot = require('bootbot');

const bot = new BootBot({
  accessToken:  process.env.FB_ACCESS_TOKEN,
  verifyToken: process.env.FB_VERIFY_TOKEN,
  appSecret:  process.env.FB_APP_SECRET
});

bot.setGreetingText('Hey there! Welcome to BootBot!');
bot.setGetStartedButton((payload, chat) => {
  chat.say('Buen día, gracias por permitirnos decorar la luz de sus ventanas. Eliga una opción para continuar:');
});
bot.setPersistentMenu([
  {
    type: 'postback',
    title: 'Cotizar',
    payload: 'COTIZAR'
  },
  {
    type: 'postback',
    title: 'Enviar Mensaje',
    payload: 'SEND_MESSAGE'
  },
  {
    type: 'postback',
    title: 'Contacto',
    payload: 'DISPLAY_CONTACT'
  }
]);

bot.hear([
  'cotizacion',
  'cotización',
  'cotisacion',
  'cotisasion',
  'cotizar',
  'cotisar',
  'precio',
  'presio',
], (payload, chat) => {
  chat.conversation(async (convo) => {
    await convo.sendTypingIndicator(1000);
    await launchCotizacion(convo);
  });
});

bot.on('postback:COTIZAR', (payload, chat) => {
  chat.conversation(async (convo) => {
    await convo.sendTypingIndicator(1000);
    await launchCotizacion(convo);
  });
});

bot.on('postback:COTIZAR', (payload, chat) => {
  chat.conversation(async (convo) => {
    await convo.sendTypingIndicator(1000);
    await launchCotizacion(convo);
  });
});

bot.on('postback:SEND_MESSAGE', (payload, chat) => {
  chat.say(`Envía tu mensaje y en unos momentos te estaremos respondiendo :)`);
});

bot.on('postback:DISPLAY_CONTACT', (payload, chat) => {
  chat.say(`En construcción`);
});

const launchCotizacion = async (convo) => {
  convo.ask((convo) => {
    const buttons = [
      { type: 'postback', title: 'Enrollable', payload: 'ENROLLABLE' },
      { type: 'postback', title: 'Sheer', payload: 'SHEER' },
      { type: 'postback', title: 'Panel Japonés', payload: 'PANEL' }
    ];
    convo.sendButtonTemplate(`Elige un tipo de persiana para comenzar tu cotización:`, buttons);
  }, (payload, convo, data) => {
    const text = payload.message.text;
    convo.set('gender', text);
    convo.say(`Great, you are a ${text}`).then(() => askAge(convo));
  }, [
      {
        event: 'postback:ENROLLABLE',
        callback: (payload, convo) => {
          convo.say('Elegiste persiana enrollable');
        }
      },
      {
        event: 'postback:SHEER',
        callback: (payload, convo) => {
          convo.say('Elegiste persiana sheer');
        }
      },
      {
        event: 'postback:PANEL',
        callback: (payload, convo) => {
          convo.say('Elegiste panel japonés');
        }
      },
    ]);
};

bot.start();