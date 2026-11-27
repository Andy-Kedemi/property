import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DetailsModalComponent } from '../details-modal/details-modal.component';
import { HousingLocation } from '../housinglocation';
import { HousingLocationComponent } from './housing-location.component';

describe('HousingLocationComponent', () => {
  it('opens the details modal for the selected housing location', async () => {
    const open = jasmine.createSpy('open');
    await TestBed.configureTestingModule({
      imports: [HousingLocationComponent],
      providers: [{ provide: MatDialog, useValue: { open } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(HousingLocationComponent);
    fixture.componentRef.setInput('housingLocation', {
      id: 42,
      name: 'Test home',
      city: 'Test city',
      state: 'TS',
      photo: '',
      availableUnits: 1,
      wifi: true,
      laundry: false,
    } satisfies HousingLocation);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement)
      .querySelector('button')
      ?.click();

    expect(open).toHaveBeenCalledWith(
      DetailsModalComponent,
      jasmine.objectContaining({ data: { id: 42 } }),
    );
  });
});
