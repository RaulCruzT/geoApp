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
  IonText,
} from '@ionic/angular/standalone';
import { LocationService } from './services/location.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

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
  locations: { lat: number; lng: number; timestamp: string }[] = [];
  private locationSub!: Subscription;

  constructor(
    private platform: Platform,
    private locationService: LocationService
  ) {}

  async ngOnInit() {
    await this.platform.ready();
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
  }
}
