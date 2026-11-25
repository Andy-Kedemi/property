import { Injectable } from '@angular/core';
import { HousingLocation } from './housinglocation';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private readonly url = '/db.json';

  async getAllHousingLocations(): Promise<HousingLocation[]> {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error(
        `Failed to load housing locations: ${response.status} ${response.statusText}`,
      );
    }

    const data: unknown = await response.json();
    if (
      typeof data !== 'object' ||
      data === null ||
      !('locations' in data) ||
      !Array.isArray(data.locations)
    ) {
      throw new Error('Invalid housing locations response');
    }

    return data.locations as HousingLocation[];
  }

  async getHousingLocationById(
    id: number,
  ): Promise<HousingLocation | undefined> {
    const locations = await this.getAllHousingLocations();
    return locations.find((location) => location.id === id);
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(firstName, lastName, email);
  }
}
