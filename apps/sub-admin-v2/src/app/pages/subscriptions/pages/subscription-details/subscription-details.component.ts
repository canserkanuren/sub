import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sub-subscription-details',
  standalone: true,
  imports: [CommonModule],
  template: `<p>subscription-details works! {{ subscriptionId() }}</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionDetailsComponent {
  subscriptionId = input.required<string>();
}
