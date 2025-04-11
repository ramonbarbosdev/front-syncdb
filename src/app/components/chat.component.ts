// // src/app/components/chat.component.ts
// import { Component, OnInit } from '@angular/core';
// import { StompService } from '../services/stomp.service';

// @Component({
//   selector: 'app-chat',
//   standalone: true, // Se for um componente standalone
//   template: `
//     <div>
//       <button (click)="sendMessage()">Enviar Mensagem</button>
//     </div>
//   `,
// })
// export class ChatComponent implements OnInit {
//   constructor(private stompService: StompService) {}

//   ngOnInit() {
//     this.stompService.connect(() => {
//       console.log('Conectado ao WebSocket!');
//       this.stompService.subscribe('/topic/messages', (message) => {
//         console.log('Mensagem recebida:', JSON.parse(message.body));
//       });
//     });
//   }

//   sendMessage() {
//     this.stompService.send('/app/chat', { text: 'Olá WebSocket!' });
//   }
// }