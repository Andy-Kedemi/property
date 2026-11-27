import { Component, Input, inject } from '@angular/core';
import { HousingLocation } from '../housinglocation';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetailsModalComponent } from '../details-modal/details-modal.component';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <section class="listing content-enter">
      <img
        class="listing-photo"
        [src]="housingLocation.photo"
        alt="Exterior photo of {{ housingLocation.name }}"
      />
      <h2 class="listing-heading">{{ housingLocation.name }}</h2>
      <p class="listing-location">
        {{ housingLocation.city }}, {{ housingLocation.state }}
      </p>
      <button type="button" (click)="openDetails()">Learn More</button>
    </section>
  `,
  styleUrl: './housing-location.component.css',
})
export class HousingLocationComponent {
  private readonly dialog = inject(MatDialog);
  @Input() housingLocation!: HousingLocation;

  openDetails(): void {
    this.dialog.open(DetailsModalComponent, {
      data: { id: this.housingLocation.id },
      width: '900px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      ariaLabel: `Details for ${this.housingLocation.name}`,
      autoFocus: false,
    });
  }
}
