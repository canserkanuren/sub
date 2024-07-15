import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import {
  HlmInputDirective,
  HlmInputErrorDirective
} from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { Subscription } from '../../../shared/models/subscription.model';

@Component({
  selector: 'sub-subscription-information',
  standalone: true,
  imports: [
    FormsModule,

    HlmLabelDirective,
    HlmInputDirective,
    HlmInputErrorDirective,

    HlmCheckboxComponent
  ],
  host: {
    class: 'w-full'
  },
  template: `
    <section class="w-full flex gap-4">
      <section class="w-full flex flex-col gap-4">
        <label hlmLabel>
          Last name
          <input
            hlmInput
            class="w-full"
            type="text"
            [disabled]="true"
            [(ngModel)]="subscription().lastName"
          />
        </label>

        <label hlmLabel>
          First name
          <input
            hlmInput
            class="w-full"
            type="text"
            [disabled]="true"
            [(ngModel)]="subscription().firstName"
          />
        </label>

        <label hlmLabel>
          Mail
          <input
            hlmInput
            class="w-full"
            type="text"
            [disabled]="true"
            [(ngModel)]="subscription().mail"
          />
        </label>

        <label hlmLabel>
          Address
          <input
            hlmInput
            class="w-full"
            type="text"
            [disabled]="true"
            [(ngModel)]="subscription().address"
          />
        </label>

        <label hlmLabel>
          Zip code
          <input
            hlmInput
            class="w-full"
            type="text"
            [disabled]="true"
            [(ngModel)]="subscription().zipcode"
          />
        </label>

        <label hlmLabel>
          City
          <input
            hlmInput
            class="w-full"
            type="text"
            [disabled]="true"
            [(ngModel)]="subscription().city"
          />
        </label>

        <label class="flex items-center" hlmLabel>
          <hlm-checkbox
            class="mr-2"
            [disabled]="true"
            [(ngModel)]="subscription().receiptNeeded"
          />
          Receipt needed
        </label>
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionInformationComponent {
  // inputs
  subscription = input.required<Subscription>();
}
