import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective
} from '@spartan-ng/ui-card-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import {
  HlmInputDirective,
  HlmInputErrorDirective
} from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective
} from '@spartan-ng/ui-tabs-helm';
import { HlmH3Directive } from '@spartan-ng/ui-typography-helm';
import { SubscriptionStore } from '../../store/subscription/subscription.store';
import { SubscriptionFilesComponent } from './subscription-files/subscription-files.component';
import { SubscriptionInformationComponent } from './subscription-information/subscription-information.component';

@Component({
  selector: 'sub-subscription-details',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FormsModule,

    HlmButtonDirective,

    HlmLabelDirective,
    HlmInputDirective,
    HlmInputErrorDirective,

    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,

    HlmCheckboxComponent,

    HlmH3Directive,

    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,

    SubscriptionInformationComponent,
    SubscriptionFilesComponent
  ],
  host: {
    class: 'w-full'
  },
  template: `
    <section class="flex flex-col justify-center gap-5">
      @if (subscription(); as s) {
        <div class="flex justify-between">
          <button hlmBtn variant="link" (click)="back()">Back</button>

          <h1 hlmH3 class="flex justify-center gap-1">
            <span class="font-normal">Subscription of:</span>
            <strong> {{ s.lastName }} - {{ s.firstName }} </strong>
          </h1>

          <div></div>
        </div>

        <hlm-tabs
          class="p-3"
          [tab]="selectedTab()"
          (tabActivated)="tabSelected($event)"
        >
          <hlm-tabs-list
            class="w-full grid grid-cols-2"
            aria-label="tabs example"
          >
            <button hlmTabsTrigger="details">Details</button>
            <button hlmTabsTrigger="files">Files</button>
          </hlm-tabs-list>

          <div hlmTabsContent="details">
            <!-- @defer (when isDetailsTabActive()) { -->
            @defer (on immediate) {
              <sub-subscription-information [subscription]="s" />
            } @placeholder {
              <span>Loading...</span>
            }
          </div>

          <div hlmTabsContent="files">
            <!-- @defer (when isFilesTabActive()) { -->
            @defer (on immediate) {
              <sub-subscription-files [subscription]="s" />
            } @placeholder {
              <span>Loading...</span>
            }
          </div>
        </hlm-tabs>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionDetailsComponent {
  // inputs
  subscriptionId = input.required<number>();

  // injections
  private readonly store = inject(SubscriptionStore);
  private readonly router = inject(Router);

  // variables
  protected subscription = this.store.selectedSubscription;
  protected selectedTab = signal('details');
  protected isDetailsTabActive = computed(
    () => this.selectedTab() === 'details'
  );
  protected isFilesTabActive = computed(() => this.selectedTab() === 'files');

  // effects
  private readonly getCurrentSubscription = effect(() => {
    this.store.loadSubscriptionById(this.subscriptionId());
  });

  // methods
  back(): void {
    this.router.navigate(['/subscriptions']);
  }

  tabSelected(tab: any): void {
    this.selectedTab.set(tab);
  }
}
