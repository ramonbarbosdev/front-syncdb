import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseService } from './services/base.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'front-syncdb';

  constructor(private http: HttpClient) {}

  baseService = inject(BaseService);


  ngOnInit() {
    this.waitForBackend();
  }

  waitForBackend() {
    const checkInterval = 1000; // 1 segundo
    const maxRetries = 20;
    let attempts = 0;

    const check = () => {
      this.baseService.verificarStatus().subscribe({
        next: (res) => {
          console.log(res);
          if (res.status) this.removeSplash();
        },
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
