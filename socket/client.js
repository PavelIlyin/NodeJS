'use strict';

import { io } from "socket.io-client";

const socket = io('localhost:3000');

const addMessage = message => {
  document.querySelector('#messages').insertAdjacentHTML('afterbegin', message);
};

socket.on('connect', () => {
  console.log('Connected');
  let name = prompt('Welcome. Please enter your name.');
  socket.emit('client_name', name);
});

socket.on('client_connected', data => {
  addMessage(`<p>${data.message}. Total online: ${data.online}</p>`);
});

socket.on('server_message', data => {
  addMessage(`<p><span style="color: ${data.color}">${data.user}</span> : ${data.message}</p>`);
});

socket.on('client_disconnected', data => {
  addMessage(`<p>${data.message}. Total online: ${data.online}</p>`);
});

document.querySelector('#form').onsubmit = e => {
  e.preventDefault();
  const input = document.querySelector('#input');
  socket.emit('client_message', input.value);
  input.value = '';
};
