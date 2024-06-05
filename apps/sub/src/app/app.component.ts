import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: `
    <section class="p-4">
      <router-outlet></router-outlet>
    </section>
  `,
})
export class AppComponent {
  title = 'sub';
}
