import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';

@Component({
  selector: 'sub-admin-root',
  standalone: true,
  imports: [RouterOutlet, HlmToasterComponent],
  template: `
    <hlm-toaster position="top-center" invert />
    <section class="w-screen h-screen flex justify-center md:p-10 p-5">
      <router-outlet></router-outlet>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
