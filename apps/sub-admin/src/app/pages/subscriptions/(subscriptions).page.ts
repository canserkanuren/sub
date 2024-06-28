import { RouteMeta } from '@analogjs/router';
import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import {
  BrnTableModule,
  useBrnColumnManager
} from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { upperFirst } from 'lodash';
import { filter, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { Subscription } from '../../core/models/subscription.model';

export const routeMeta: RouteMeta = {
  title: 'Subscription admin',
  canActivate: [
    () => {
      const router = inject(Router);

      return inject(AuthService)
        .getCurrentUser()
        .pipe(
          filter(user => user !== null),
          switchMap(isAuthenticated =>
            of(!isAuthenticated ? router.createUrlTree(['/login']) : true)
          )
        );
    }
  ],
  providers: []
};

@Component({
  selector: 'sub-admin-subscriptions',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    TitleCasePipe,

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
      class="border-border mt-4 block h-[335px] overflow-auto rounded-md border"
      [dataSource]="_filteredSortedPaginatedPayments()"
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
            [checked]="_isPaymentSelected(element)"
            (changed)="togglePayment(element)"
          />
        </hlm-td>
      </brn-column-def>
      <brn-column-def name="status" class="w-32 sm:w-40">
        <hlm-th truncate *brnHeaderDef>Status</hlm-th>
        <hlm-td truncate *brnCellDef="let element">
          {{ element.status | titlecase }}
        </hlm-td>
      </brn-column-def>
      <brn-column-def name="email" class="w-60 lg:flex-1">
        <hlm-th *brnHeaderDef>
          <button
            hlmBtn
            size="sm"
            variant="ghost"
            (click)="handleEmailSortChange()"
          >
            Email
            <hlm-icon class="ml-3" size="sm" name="lucideArrowUpDown" />
          </button>
        </hlm-th>
        <hlm-td truncate *brnCellDef="let element">
          {{ element.email }}
        </hlm-td>
      </brn-column-def>
      <brn-column-def name="amount" class="justify-end w-20">
        <hlm-th *brnHeaderDef>Amount</hlm-th>
        <hlm-td class="font-medium tabular-nums" *brnCellDef="let element">
          $ {{ element.amount | number: '1.2-2' }}
        </hlm-td>
      </brn-column-def>
      <brn-column-def name="actions" class="w-16">
        <hlm-th *brnHeaderDef></hlm-th>
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
                <button hlmMenuItem>Copy payment ID</button>
              </hlm-menu-group>
              <hlm-menu-separator />
              <hlm-menu-group>
                <button hlmMenuItem>View customer</button>
                <button hlmMenuItem>View payment details</button>
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
  `
})
export default class SubscriptionDetailsComponent {
  subscriptionId = input.required<string>();

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<Subscription>(true);
  protected readonly _isPaymentSelected = (subscription: Subscription) =>
    this._selectionModel.isSelected(subscription);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map(change => change.source.selected)),
    {
      initialValue: []
    }
  );
  protected readonly _brnColumnManager = useBrnColumnManager(
    Object.keys(Subscription).reduce((acc, el) => {
      acc[el] = {
        visible: true,
        label: upperFirst(el)
      };

      return acc;
    }, {} as any)
  );
  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...(this._brnColumnManager.displayedColumns() as string[]),
    'actions'
  ]);

  private readonly _payments = signal([]);
  private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedPayments = computed(() => {
    const sort = this._emailSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const payments = this._payments();
    if (!sort) {
      return payments.slice(start, end);
    }
    return [...payments]
      .sort(
        (p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.email.localeCompare(p2.email)
      )
      .slice(start, end);
  });
}
