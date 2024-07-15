import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Subscription } from '../../../shared/models/subscription.model';

@Component({
  selector: 'sub-subscription-files',
  standalone: true,
  imports: [FormsModule, HlmButtonDirective],
  host: {
    class: 'w-full'
  },
  template: `
    <section class="w-full flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label hlmLabel> Identity card (first page) </label>
        <a hlmBtn [href]="subscription().identityCardRecto.file" target="_blank"
          >Click here to see the document</a
        >
      </div>

      <div class="flex flex-col gap-2">
        <label hlmLabel> Identity card (second page) </label
        ><a
          hlmBtn
          [href]="subscription().identityCardVerso.file"
          target="_blank"
          >Click here to see the document</a
        >
      </div>

      <div class="flex flex-col gap-2">
        <label hlmLabel> Signature </label
        ><a hlmBtn [href]="subscription().signature.file" target="_blank"
          >Click here to see the document</a
        >
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionFilesComponent {
  // inputs
  subscription = input.required<Subscription>();
}
