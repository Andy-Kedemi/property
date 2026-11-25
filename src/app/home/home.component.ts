import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingLocation } from '../housinglocation';
import { HousingService } from '../housing.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocationComponent],
  template: `
    <section>
      <input
        type="text"
        placeholder="Filter by name or city"
        #filter
        (input)="filterLocations(filter.value)"
      />
      <button
        class="primary"
        type="button"
        (click)="filterLocations(filter.value)"
      >
        Search
      </button>
    </section>
    <section class="results">
      <app-housing-location
        *ngFor="let housingLocation of filteredLocationList"
        [housingLocation]="housingLocation"
      ></app-housing-location>
    </section>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private readonly housingService = inject(HousingService);
  housingLocationList: HousingLocation[] = [];
  filteredLocationList: HousingLocation[] = [];
  private filterText = '';

  constructor() {
    this.housingService
      .getAllHousingLocations()
      .then((housingLocationList: HousingLocation[]) => {
        this.housingLocationList = housingLocationList;
        this.filterLocations(this.filterText);
      });
  }

  filterLocations(text: string): void {
    const searchText = text.trim().toLowerCase();
    this.filterText = searchText;

    if (!searchText) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }

    this.filteredLocationList = this.housingLocationList.filter(
      (location) =>
        location.name.toLowerCase().includes(searchText) ||
        location.city.toLowerCase().includes(searchText),
    );
  }
}

