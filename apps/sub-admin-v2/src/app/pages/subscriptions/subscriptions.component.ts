import { SelectionModel } from '@angular/cdk/collections';
import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  TrackByFunction
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideChevronDown,
  lucideMoreHorizontal
} from '@ng-icons/lucide';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import {
  HlmCheckboxCheckIconComponent,
  HlmCheckboxComponent
} from '@spartan-ng/ui-checkbox-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import {
  BrnTableModule,
  PaginatorState,
  useBrnColumnManager
} from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { map } from 'rxjs';
import { Subscription } from './shared/models/subscription.model';
import { SubscriptionStore } from './store/subscription/subscription.store';

@Component({
  selector: 'sub-admin-subscriptions',
  standalone: true,
  imports: [
    FormsModule,
    UpperCasePipe,

    BrnMenuTriggerDirective,
    BrnTableModule,
    BrnSelectModule,

    HlmMenuModule,
    HlmTableModule,
    HlmButtonModule,
    HlmIconComponent,
    HlmInputDirective,
    HlmCheckboxCheckIconComponent,
    HlmCheckboxComponent,
    HlmSelectModule
  ],
  providers: [
    provideIcons({ lucideChevronDown, lucideMoreHorizontal, lucideArrowUpDown })
  ],
  host: {
    class: 'w-full'
  },
  template: `
    <brn-table
      hlm
      stickyHeader
      class="border-border mt-4 block h-auto overflow-auto rounded-md border"
      bodyRowClasses="w-full"
      [dataSource]="_filteredSortedPaginatedSubscriptions()"
      [displayedColumns]="_allDisplayedColumns()"
      [trackBy]="_trackBy"
    >
      <brn-column-def name="select" class="w-12">
        <hlm-th *brnHeaderDef>
          <hlm-checkbox
            [checked]="_checkboxState()"
            (changed)="handleHeaderCheckboxChange()"
          />
        </hlm-th>
        <hlm-td *brnCellDef="let element">
          <hlm-checkbox
            [checked]="_isSubscriptionSelected(element)"
            (changed)="toggleSubscription(element)"
          />
        </hlm-td>
      </brn-column-def>

      <brn-column-def name="lastName" class="w-32 sm:w-40">
        <hlm-th truncate *brnHeaderDef>Last Name</hlm-th>
        <hlm-td truncate *brnCellDef="let element">
          {{ element.lastName | uppercase }}
        </hlm-td>
      </brn-column-def>

      <brn-column-def name="firstName" class="w-32 sm:w-40">
        <hlm-th truncate *brnHeaderDef>First Name</hlm-th>
        <hlm-td truncate *brnCellDef="let element">
          {{ element.firstName }}
        </hlm-td>
      </brn-column-def>

      <brn-column-def name="mail" class="w-56">
        <hlm-th *brnHeaderDef> Mail </hlm-th>
        <hlm-td truncate *brnCellDef="let element">
          {{ element.mail }}
        </hlm-td>
      </brn-column-def>

      <brn-column-def name="address" class="w-60 flex-1">
        <hlm-th *brnHeaderDef>Address</hlm-th>
        <hlm-td class="font-medium tabular-nums" *brnCellDef="let element">
          {{ element.address }} - {{ element.zipcode }} {{ element.city }}
        </hlm-td>
      </brn-column-def>

      <brn-column-def name="receiptNeeded" class="w-40 justify-center">
        <hlm-th *brnHeaderDef>Is Receipt Needed</hlm-th>
        <hlm-td *brnCellDef="let element">
          <hlm-checkbox [checked]="element.receiptNeeded" [disabled]="true" />
        </hlm-td>
      </brn-column-def>

      <brn-column-def name="actions" class="justify-end">
        <hlm-th *brnHeaderDef>Actions</hlm-th>
        <hlm-td *brnCellDef="let element">
          <button
            hlmBtn
            variant="ghost"
            class="h-6 w-6 p-0.5"
            align="end"
            [brnMenuTriggerFor]="menu"
          >
            <hlm-icon class="w-4 h-4" name="lucideMoreHorizontal" />
          </button>

          <ng-template #menu>
            <hlm-menu>
              <hlm-menu-label>Actions</hlm-menu-label>
              <hlm-menu-separator />
              <hlm-menu-group>
                <button hlmMenuItem (click)="goToDetail(element)">
                  Detail
                </button>
              </hlm-menu-group>
              <hlm-menu-separator />
              <hlm-menu-group>
                <button hlmMenuItem>
                  <span class="text-red">Delete</span>
                </button>
              </hlm-menu-group>
            </hlm-menu>
          </ng-template>
        </hlm-td>
      </brn-column-def>
      <div
        class="flex items-center justify-center p-20 text-muted-foreground"
        brnNoDataRow
      >
        No data
      </div>
    </brn-table>
    <div
      class="flex flex-col justify-between mt-4 sm:flex-row sm:items-center"
      *brnPaginator="
        let ctx;
        totalElements: _totalElements();
        pageSize: _pageSize();
        onStateChange: _onStateChange
      "
    >
      <span class="text-sm text-muted-foreground"
        >{{ _selected().length }} of {{ _totalElements() }} row(s)
        selected</span
      >
      <div class="flex mt-2 sm:mt-0">
        <brn-select
          class="inline-block"
          placeholder="{{ _availablePageSizes[0] }}"
          [(ngModel)]="_pageSize"
        >
          <hlm-select-trigger class="inline-flex mr-1 w-15 h-9">
            <hlm-select-value />
          </hlm-select-trigger>
          <hlm-select-content>
            @for (size of _availablePageSizes; track size) {
              <hlm-option [value]="size">
                {{ size === 10000 ? 'All' : size }}
              </hlm-option>
            }
          </hlm-select-content>
        </brn-select>

        <div class="flex space-x-1">
          <button
            size="sm"
            variant="outline"
            hlmBtn
            [disabled]="!ctx.decrementable()"
            (click)="ctx.decrement()"
          >
            Previous
          </button>
          <button
            size="sm"
            variant="outline"
            hlmBtn
            [disabled]="!ctx.incrementable()"
            (click)="ctx.increment()"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionsComponent {
  private readonly store = inject(SubscriptionStore);
  private readonly router = inject(Router);

  private readonly _displayedIndices = signal({ start: 0, end: 10 });
  protected readonly _availablePageSizes = [5, 10, 20, 50];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<Partial<Subscription>>(
    true
  );
  protected readonly _isSubscriptionSelected = (subscription: Subscription) =>
    this._selectionModel.isSelected(subscription);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map(change => change.source.selected)),
    {
      initialValue: []
    }
  );
  protected readonly _brnColumnManager = useBrnColumnManager({
    lastName: { visible: true },
    firstName: { visible: true },
    mail: { visible: true },
    address: { visible: true },
    receiptNeeded: { visible: true }
  });
  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...(this._brnColumnManager.displayedColumns() as string[]),
    'actions'
  ]);

  private readonly _subscriptions = this.store.subscriptions;
  private readonly _filteredSubscriptions = computed(() =>
    this._subscriptions()
  );
  protected readonly _filteredSortedPaginatedSubscriptions = computed(() => {
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const subscriptions = this._filteredSubscriptions();

    return subscriptions.slice(start, end);
  });

  protected readonly _allFilteredPaginatedSubscriptionsSelected = computed(() =>
    this._filteredSortedPaginatedSubscriptions().every(subscription =>
      this._selected().includes(subscription)
    )
  );

  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate =
      this._allFilteredPaginatedSubscriptionsSelected()
        ? true
        : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<Subscription> = (
    _: number,
    s: Subscription
  ) => s.id;
  protected readonly _totalElements = computed(
    () => this._filteredSubscriptions().length
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex
  }: PaginatorState) => {
    this._displayedIndices.set({ start: startIndex, end: endIndex });
  };

  // effects
  private loadSubscriptionEffect = effect(() => {
    const { end } = this._displayedIndices();
    end > 0 &&
      this.store.loadSubscriptions({
        start: this._displayedIndices().start,
        end: this._displayedIndices().end
      });
  });

  protected toggleSubscription(subscription: Subscription) {
    this._selectionModel.toggle(subscription);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(
        ...this._filteredSortedPaginatedSubscriptions()
      );
    } else {
      this._selectionModel.deselect(
        ...this._filteredSortedPaginatedSubscriptions()
      );
    }
  }

  protected goToDetail(subscription: Partial<Subscription>) {
    this.router.navigate(['/subscriptions', subscription.id]);
  }
}
