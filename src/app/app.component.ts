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
  standalone: true,
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
    await this.platform.ready();
    await this.locationService.init();
    await this.loadHistory();
  }

  // ✅ Cargar historial
  async loadHistory() {
    try {
      this.locations = await this.locationService.getLocationHistory();
      console.log('[AppComponent] Historial cargado:', this.locations);
    } catch (error) {
      console.error('[AppComponent] Error al cargar historial:', error);
    }
  }

  // ✅ Guardar ubicación manual y actualizar historial
  async testSave() {
    try {
      await this.locationService.saveCurrentLocationManually();
      await this.loadHistory();
    } catch (error) {
      console.error('[AppComponent] Error al guardar ubicación manual:', error);
    }
  }

  // ✅ Borrar historial
  async clearHistory() {
    try {
      await this.locationService.clearLocationHistory();
      this.locations = [];
      console.log('[AppComponent] Historial eliminado');
    } catch (error) {
      console.error('[AppComponent] Error al borrar historial:', error);
    }
  }
}
