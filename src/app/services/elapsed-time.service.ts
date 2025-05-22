import { Injectable } from '@angular/core';
import { ElapsedTimePlugin } from 'plugins/elapsed-time-plugin/src';

@Injectable({
  providedIn: 'root'
})
export class ElapsedTimeService {

  constructor() { }

  // Método para obtener el tiempo transcurrido
  async getElapsedTime(): Promise<number> {
    try {
      const result = await ElapsedTimePlugin.getElapsedTime();
      return result.elapsedTime; // Devuelve el tiempo transcurrido
    } catch (error) {
      console.error('Error al obtener el tiempo transcurrido:', error);
      throw error; // Propaga el error
    }
  }
}
