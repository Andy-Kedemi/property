import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';

interface DetailsModalData {
  id: number;
}

@Component({
  selector: 'app-details-modal',
  standalone: true,
  imports: [DetailsComponent],
  template: `
    <header class="modal-header">
      <h2>Home details</h2>
      <button type="button" aria-label="Close details" (click)="close()">
        X
      </button>
    </header>
    <app-details
      [housingLocationId]="data.id"
      [modalLayout]="true"
    ></app-details>
  `,
  styleUrl: './details-modal.component.css',
})
export class DetailsModalComponent {
  readonly data: DetailsModalData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DetailsModalComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
