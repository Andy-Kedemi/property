import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly messageSubject = new BehaviorSubject<string | null>(null);
  readonly message$ = this.messageSubject.asObservable();
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  showSuccess(message: string, durationMs = 10000): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    this.messageSubject.next(message);
    this.timeoutId = setTimeout(() => {
      this.messageSubject.next(null);
      this.timeoutId = null;
    }, durationMs);
  }
}

