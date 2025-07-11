import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseService } from './services/base.service';
import { ElectronServiceService } from './services/electron.service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'front-syncdb';

  updateAvailable = false;
  updateDownloaded = false;
  electronService = inject(ElectronServiceService);

  constructor(private http: HttpClient) {

    this.electronService.updateAvailable$.subscribe(() => {
      this.updateAvailable = true;
      console.log('Nova atualização disponível');
    });

    this.electronService.updateDownloaded$.subscribe(() => {
      this.updateDownloaded = true;
      console.log('Atualização baixada!');
    });

  }

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
