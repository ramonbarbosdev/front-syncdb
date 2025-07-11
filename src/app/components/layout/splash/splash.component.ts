import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-splash',
  imports: [],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
})
export class SplashComponent {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.waitForBackend();
  }

  waitForBackend() {
    const checkInterval = 1000; // 1 segundo
    const maxRetries = 20;
    let attempts = 0;

    const check = () => {
      this.http
        .get('/status') // ajuste para a rota que seu backend responde
        .subscribe({
          next: () => this.removeSplash(),
          error: () => {
            if (attempts++ < maxRetries) {
              setTimeout(check, checkInterval);
            } else {
              this.showOfflineMessage();
            }
          },
        });
    };

    check();
  }

  removeSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.remove();
  }

  showOfflineMessage() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.innerHTML =
        '<p>Servidor indisponível. Tente novamente mais tarde.</p>';
    }
  }
}
