import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonText,
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
export class AppComponent implements OnInit {
  locations: { lat: number; lng: number; timestamp: string }[] = [];

  constructor(
    private platform: Platform,
    private locationService: LocationService
  ) {}

  async ngOnInit() {
    await this.platform.ready(); // Espera que la plataforma esté lista
    await this.locationService.init();
  }

  // Obtener historial
  async showHistory() {
    this.locations = await this.locationService.getLocationHistory();
    console.log('Historial de ubicaciones:', this.locations);
    if (!this.locations.length) {
      console.log('No hay ubicaciones guardadas.');
    }
  }

  // Borrar historial
  async clearHistory() {
    await this.locationService.clearLocationHistory();
    this.locations = [];
    console.log('Historial eliminado');
  }

  async testSave() {
    await this.locationService.saveCurrentLocationManually();
    await this.showHistory();
  }
}
