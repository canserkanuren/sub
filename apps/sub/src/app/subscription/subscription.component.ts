import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
  selector: 'app-subscription',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmButtonDirective,

    HlmInputDirective,
    HlmLabelDirective,

    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
  ],
  template: `
    <section hlmCard>
      <div hlmCardHeader>
        <h3 hlmCardTitle>Card Title</h3>
        <p hlmCardDescription>Card Description</p>
      </div>
      <div hlmCardContent class="flex flex-col gap-4 justify-center">
        <div hlmCardContent class="flex flex-col gap-4 justify-center">
          <label hlmLabel
            >Nom
            <input class="w-80" hlmInput type="text" placeholder="Nom" />
          </label>

          <label hlmLabel
            >Prénom
            <input class="w-80" hlmInput type="text" placeholder="Prénom" />
          </label>

          <label hlmLabel
            >Carte d'identité (recto)
            <input
              class="w-80"
              hlmInput
              type="file"
              placeholder="Carte d'identité (recto)"
            />
          </label>
          <label hlmLabel
            >Carte d'identité (verso)
            <input
              class="w-80"
              hlmInput
              type="file"
              placeholder="Carte d'identité (verso)"
            />
          </label>
        </div>
      </div>
    </section>
  `,
})
export class SubscriptionComponent {}
