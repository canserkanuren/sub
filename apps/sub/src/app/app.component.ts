import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';

@Component({
  standalone: true,
  imports: [RouterModule, HlmToasterComponent],
  selector: 'app-root',
  template: `
    <hlm-toaster position="top-center" invert />
    <section class="w-screen h-screen flex justify-center md:p-10 p-5">
      <router-outlet></router-outlet>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
