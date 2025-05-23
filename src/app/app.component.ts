import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { LocationService } from './services/location.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ElapsedTimeService } from './services/elapsed-time.service';
import { DeveloperModeService } from './services/developer-mode.service';
import { Network, NetworkStatus } from '@capacitor/network';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonList,
    IonButton,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  public locations: { lat: number; lng: number; timestamp: string }[] = [];
  private locationSub!: Subscription;
  public elapsedTime: number = 0;
  public developerMode: boolean = false;

  public isConnected: boolean = true;
  private networkListener: any;

  constructor(
    private platform: Platform,
    private locationService: LocationService,
    private elapsedTimeService: ElapsedTimeService,
    private developerModeService: DeveloperModeService,
    private alertController: AlertController,
  ) {}

  async ngOnInit() {
    try {
      await this.platform.ready();

      try {
        this.developerMode = await this.developerModeService.isDeveloperMode();
        if (this.developerMode) {
          await this.showAlert(
            'Modo desarrollador',
            'La app está corriendo en modo desarrollador.',
          );
        }
      } catch (err) {
        console.error(
          '[AppComponent] Error al verificar modo desarrollador:',
          err,
        );
        await this.showAlert(
          'Error',
          'No se pudo verificar si está en modo desarrollador.',
        );
      }

      try {
        this.elapsedTime = await this.elapsedTimeService.getElapsedTime();
      } catch (err) {
        console.error(
          '[AppComponent] Error al obtener el tiempo transcurrido:',
          err,
        );
        await this.showAlert(
          'Error',
          'No se pudo obtener el tiempo transcurrido.',
        );
      }

      try {
        const status: NetworkStatus = await Network.getStatus();
        this.isConnected = status.connected;
        console.log('[AppComponent] Estado inicial de red:', status);
      } catch (err) {
        console.error('[AppComponent] Error al obtener estado de red:', err);
      }

      try {
        this.networkListener = Network.addListener(
          'networkStatusChange',
          (status: NetworkStatus) => {
            this.isConnected = status.connected;
            console.log('[AppComponent] Cambio de red:', status);
          },
        );
      } catch (err) {
        console.error(
          '[AppComponent] Error al suscribirse a cambios de red:',
          err,
        );
      }

      try {
        await this.locationService.init();
      } catch (err) {
        console.error(
          '[AppComponent] Error al inicializar el servicio de ubicación:',
          err,
        );
        await this.showAlert(
          'Error',
          'No se pudo inicializar el servicio de ubicación.',
        );
      }

      try {
        this.locationSub = this.locationService.locationHistory$.subscribe(
          (history) => {
            this.locations = history;
            console.log(
              '[AppComponent] Historial actualizado:',
              this.locations,
            );
          },
        );
      } catch (err) {
        console.error(
          '[AppComponent] Error al suscribirse al historial de ubicaciones:',
          err,
        );
        await this.showAlert(
          'Error',
          'No se pudo suscribir al historial de ubicaciones.',
        );
      }
    } catch (globalErr) {
      console.error('[AppComponent] Error inesperado en ngOnInit:', globalErr);
    }
  }

  public async testSave() {
    try {
      await this.locationService.saveCurrentLocationManually();
    } catch (err) {
      console.error('[AppComponent] Error al guardar ubicación manual:', err);
      await this.showAlert(
        'Error',
        'No se pudo guardar manualmente la ubicación. Intentelo de nuevo.',
      );
    }
  }

  public async clearHistory() {
    try {
      await this.locationService.clearLocationHistory();
    } catch (err) {
      console.error(
        '[AppComponent] Error al limpiar historial de ubicaciones:',
        err,
      );
      await this.showAlert(
        'Error',
        'No se pudo limpiar el historial de ubicaciones. Intentelo de nuevo.',
      );
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnDestroy() {
    this.locationSub?.unsubscribe();
    this.networkListener?.remove();
  }
}
