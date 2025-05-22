import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';

import { registerPlugin } from '@capacitor/core';
import type { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';

// Registrar plugin BackgroundGeolocation
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly STORAGE_KEY = 'location_history';

  constructor() {
    this.listenToAppState();
  }

  async init() {
    try {
      console.log('[LocationService] Init...');
      await this.requestPermissions();
      await this.getCurrentLocation();

      // ⚠️ Descomenta esto solo si sabes que el plugin está bien configurado en nativo
      await this.startBackgroundTracking();

      console.log('[LocationService] Inicialización completa');
    } catch (error) {
      console.error('[LocationService] Error durante init():', error);
    }
  }

  private async requestPermissions() {
    try {
      console.log('[LocationService] Solicitando permisos...');
      await Geolocation.requestPermissions();
      await LocalNotifications.requestPermissions();
      console.log('[LocationService] Permisos concedidos');
    } catch (error) {
      console.error('[LocationService] Error solicitando permisos:', error);
    }
  }

  private async getCurrentLocation() {
    try {
      console.log('[LocationService] Obteniendo ubicación actual...');
      const coordinates = await Geolocation.getCurrentPosition();
      await this.saveLocation({
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
        timestamp: new Date().toISOString(),
      });
      console.log('[LocationService] Ubicación actual guardada');
    } catch (e) {
      console.error('[LocationService] Error obteniendo ubicación actual:', e);
    }
  }

  private async startBackgroundTracking() {
    try {
      console.log('[LocationService] Iniciando seguimiento en segundo plano...');
      await BackgroundGeolocation.addWatcher(
        {
          requestPermissions: true,
          stale: false,
        },
        async (location, error) => {
          if (error) {
            console.error('[LocationService] Error en BackgroundGeolocation:', error);
            return;
          }

          if (location) {
            console.log('[LocationService] Ubicación en segundo plano recibida:', location);
            await this.saveLocation({
              lat: location.latitude,
              lng: location.longitude,
              timestamp: new Date().toISOString(),
            });
          }
        }
      );
      console.log('[LocationService] Seguimiento en segundo plano iniciado');
    } catch (error) {
      console.error('[LocationService] Error iniciando background tracking:', error);
    }
  }

  private listenToAppState() {
    App.addListener('appStateChange', async ({ isActive }) => {
      if (!isActive) {
        try {
          console.log('[LocationService] App en segundo plano, mostrando notificación...');
          await LocalNotifications.schedule({
            notifications: [
              {
                title: 'App en segundo plano',
                body: 'La app sigue rastreando tu ubicación',
                id: 1,
              },
            ],
          });
        } catch (e) {
          console.error('[LocationService] Error mostrando notificación:', e);
        }
      }
    });
  }

  private async saveLocation(entry: { lat: number; lng: number; timestamp: string }) {
    try {
      const existing = await this.getLocationHistory();
      existing.push(entry);
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(existing),
      });
      console.log('[LocationService] Ubicación guardada en el historial');
    } catch (error) {
      console.error('[LocationService] Error guardando ubicación:', error);
    }
  }

  async getLocationHistory(): Promise<{ lat: number; lng: number; timestamp: string }[]> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('[LocationService] Error obteniendo historial:', error);
      return [];
    }
  }

  async clearLocationHistory() {
    try {
      await Preferences.remove({ key: this.STORAGE_KEY });
      console.log('[LocationService] Historial de ubicaciones borrado');
    } catch (error) {
      console.error('[LocationService] Error al borrar historial:', error);
    }
  }

async saveCurrentLocationManually() {
  try {
    const coordinates = await Geolocation.getCurrentPosition();
    await this.saveLocation({
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
      timestamp: new Date().toISOString(),
    });
    console.log('Ubicación actual guardada manualmente');
  } catch (error) {
    console.error('Error al obtener o guardar ubicación manualmente:', error);
  }
}
}
