import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
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

  public isConnected: boolean = true; // <-- Variable para guardar el estado de red
  private networkListener: any; // <-- Guardar la suscripción para removerla luego

  constructor(
    private platform: Platform,
    private locationService: LocationService,
    private elapsedTimeService: ElapsedTimeService,
    private developerModeService: DeveloperModeService
  ) {}

  async ngOnInit() {
    await this.platform.ready();

    this.developerMode = await this.developerModeService.isDeveloperMode();
    this.elapsedTime = await this.elapsedTimeService.getElapsedTime();

    const status: NetworkStatus = await Network.getStatus();
    this.isConnected = status.connected;
    console.log('[AppComponent] Estado inicial de red:', status);

    this.networkListener = Network.addListener('networkStatusChange', (status: NetworkStatus) => {
      this.isConnected = status.connected;
      console.log('[AppComponent] Cambio de red:', status);
    });

    await this.locationService.init();

    this.locationSub = this.locationService.locationHistory$.subscribe(history => {
      this.locations = history;
      console.log('[AppComponent] Historial actualizado:', this.locations);
    });

  }

  async testSave() {
    await this.locationService.saveCurrentLocationManually();
  }

  async clearHistory() {
    await this.locationService.clearLocationHistory();
  }

  ngOnDestroy() {
    this.locationSub?.unsubscribe();
    this.networkListener?.remove();
  }
}
