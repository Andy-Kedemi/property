import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingLocation } from '../housinglocation';
import { HousingService } from '../housing.service';
import { waitForMinimumSkeletonDuration } from '../skeleton-loading';
import { ToastService } from '../toast.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocationComponent],
  template: `
    <section class="search">
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
    <p *ngIf="isLoading" class="visually-hidden" role="status">
      Loading housing locations...
    </p>
    <section *ngIf="isLoading" class="results" aria-hidden="true">
      <article *ngFor="let slot of skeletonCardSlots" class="skeleton-card">
        <div class="skeleton skeleton-photo"></div>
        <div class="skeleton skeleton-line skeleton-title"></div>
        <div class="skeleton skeleton-line skeleton-location"></div>
        <div class="skeleton skeleton-line skeleton-action"></div>
      </article>
    </section>
    <p *ngIf="loadError" class="load-error" role="alert">{{ loadError }}</p>
    <section *ngIf="!isLoading && !loadError" class="results">
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
  readonly skeletonCardSlots = Array.from({ length: 8 });
  housingLocationList: HousingLocation[] = [];
  filteredLocationList: HousingLocation[] = [];
  private filterText = '';
  isLoading = true;
  loadError: string | null = null;

  constructor() {
    void this.loadHousingLocations();
  }

  private async loadHousingLocations(): Promise<void> {
    const minimumDuration = waitForMinimumSkeletonDuration();
    const [locationsResult] = await Promise.allSettled([
      this.housingService.getAllHousingLocations(),
      minimumDuration,
    ]);

    if (locationsResult.status === 'fulfilled') {
      this.housingLocationList = locationsResult.value;
      this.filterLocations(this.filterText);
    } else {
      this.loadError = 'Failed to load housing locations. Please try again later.';
      console.error('Failed to load housing locations', locationsResult.reason);
    }

    this.isLoading = false;
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

