import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElectronServiceService {
  private ipcRenderer = (window as any).require?.('electron')?.ipcRenderer;
  updateAvailable$ = new Subject<void>();
  updateDownloaded$ = new Subject<void>();

  constructor(private ngZone: NgZone) {
    if (this.ipcRenderer) {
      this.ipcRenderer.on('update_available', () => {
        this.ngZone.run(() => this.updateAvailable$.next());
      });

      this.ipcRenderer.on('update_downloaded', () => {
        this.ngZone.run(() => this.updateDownloaded$.next());
      });
    }
  }
}
