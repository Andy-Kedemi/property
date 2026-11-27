import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastService } from './toast.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <img
            class="brand-logo"
            src="/assets/logo.jpg"
            alt="logo"
            aria-hidden="true"
          />
        </header>
      </a>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
    <div
      class="toast"
      role="status"
      aria-live="polite"
      [hidden]="!(toastService.message$ | async)"
    >
      {{ (toastService.message$ | async) ?? '' }}
    </div>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly toastService = inject(ToastService);
  title = 'Homes';
}
