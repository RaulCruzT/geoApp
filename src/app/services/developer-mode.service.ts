import { Injectable } from '@angular/core';
import { DeveloperModePlugin } from 'plugins/developer-mode-plugin/src';

@Injectable({
  providedIn: 'root'
})
export class DeveloperModeService {

  constructor() { }

  async isDeveloperMode(): Promise<boolean> {
    try {
      const result = await DeveloperModePlugin.isDeveloperMode();
      return result.isDeveloperMode;
    } catch (error) {
      console.error('Error checking developer mode:', error);
      return false;
    }
  }
}
