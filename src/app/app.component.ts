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
