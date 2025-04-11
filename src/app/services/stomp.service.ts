// // websocket.service.ts
// import { Injectable } from '@angular/core';
// import { Client, IMessage, Stomp } from '@stomp/stompjs';


// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService {
//   private stompClient!: Client;

//   connect(): void {
//     const socket = new SockJS('http://localhost:8080/ws'); // ajuste a porta se necessário
//     this.stompClient = Stomp.over(socket);
    
//     this.stompClient.connect({}, frame => {
//       console.log('Connected: ' + frame);

//       // Exemplo de subscribe
//       this.stompClient.subscribe('/user/queue/messages', (message: IMessage) => {
//         console.log('Received:', message.body);
//       });

//       // Exemplo de envio
//       this.stompClient.send('/app/hello', {}, JSON.stringify({ text: 'Olá servidor!' }));
//     });
//   }

//   disconnect(): void {
//     if (this.stompClient) {
//       this.stompClient.disconnect(() => {
//         console.log('Disconnected');
//       });
//     }
//   }
// }
