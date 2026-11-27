import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housinglocation';
import { waitForMinimumSkeletonDuration } from '../skeleton-loading';
import { ToastService } from '../toast.service';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <ng-container *ngIf="isLoading; else loadedDetails">
      <section class="details-skeleton" aria-hidden="true">
        <div class="skeleton skeleton-photo"></div>
        <div class="skeleton skeleton-line skeleton-title"></div>
        <div class="skeleton skeleton-line skeleton-location"></div>
        <div class="skeleton skeleton-line skeleton-section"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line skeleton-short"></div>
        <div class="skeleton skeleton-line skeleton-section"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-input"></div>
      </section>
      <p class="visually-hidden" role="status">Loading home details...</p>
    </ng-container>
    <ng-template #loadedDetails>
      <p *ngIf="loadError" class="load-error" role="alert">{{ loadError }}</p>
      <p *ngIf="!loadError && !housingLocation" role="status">
        Home details could not be found.
      </p>
      <article
        *ngIf="housingLocation"
        class="content-enter"
        [class.modal-layout]="modalLayout"
      >
        <img
          class="listing-photo"
          [src]="housingLocation.photo"
          alt="Exterior photo of {{ housingLocation.name }}"
        />
        <section class="listing-description">
          <h2 class="listing-heading">{{ housingLocation.name }}</h2>
          <p class="listing-location">
            {{ housingLocation.city }}, {{ housingLocation.state }}
          </p>
        </section>
        <section class="listing-features">
          <h2 class="section-heading">About this housing location</h2>
          <ul>
            <li>Units available: {{ housingLocation.availableUnits }}</li>
            <li>Does this location have wifi: {{ housingLocation.wifi }}</li>
            <li>
              Does this location have laundry: {{ housingLocation.laundry }}
            </li>
          </ul>
        </section>
        <section class="listing-apply">
          <h2 class="section-heading">Apply now to live here</h2>
          <form [formGroup]="applyForm" (ngSubmit)="submitApplication()">
            <label for="first-name">First Name</label>
            <input id="first-name" type="text" formControlName="firstName" required />

            <label for="last-name">Last Name</label>
            <input id="last-name" type="text" formControlName="lastName" required />

            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" required />
            <button type="submit" class="primary">Apply now</button>
          </form>
        </section>
      </article>
    </ng-template>
  `,
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly parentDialogRef = inject(MatDialogRef, { optional: true });
  @Input() housingLocationId?: number;
  @Input() modalLayout = false;
  housingLocation: HousingLocation | undefined;
  isLoading = true;
  loadError: string | null = null;

  applyForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  async ngOnInit(): Promise<void> {
    const housingLocationId =
      this.housingLocationId ?? parseInt(this.route.snapshot.params['id'], 10);
    const [locationResult] = await Promise.allSettled([
      this.housingService.getHousingLocationById(housingLocationId),
      waitForMinimumSkeletonDuration(),
    ]);

    if (locationResult.status === 'fulfilled') {
      this.housingLocation = locationResult.value;
    } else {
      this.loadError = 'Unable to load home details. Please try again later.';
      console.error(
        'Failed to load housing location details',
        locationResult.reason,
      );
    }

    this.isLoading = false;
  }
  submitApplication(): void {
    if (this.applyForm.invalid) {
      this.applyForm.markAllAsTouched();
      return;
    }

    this.housingService.submitApplication(
      this.applyForm.controls.firstName.value,
      this.applyForm.controls.lastName.value,
      this.applyForm.controls.email.value,
    );
    this.toastService.showSuccess('Application submitted successfully.');
    this.parentDialogRef?.close();
    void this.router.navigateByUrl('/');
  }
}
