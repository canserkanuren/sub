import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap } from 'rxjs';
import { SubscriptionDto } from '../../shared/models/subscription.dto';
import { Subscription } from '../../shared/models/subscription.model';
import { SubscriptionMapperService } from '../../shared/services/subscription-mapper.service';
import { SubscriptionService } from '../../shared/services/subscription.service';

type SubscriptionState = {
  subscriptions: Partial<Subscription>[];
};

const initialState: SubscriptionState = {
  subscriptions: []
};

export const SubscriptionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      subscriptionService = inject(SubscriptionService),
      subscriptionMapperService = inject(SubscriptionMapperService)
    ) => ({
      loadSubscriptions: rxMethod<{ start: number; end: number }>(
        pipe(
          switchMap(params =>
            subscriptionService.getSubscriptions(params.start, params.end).pipe(
              switchMap(({ error, data }) => {
                if (error) {
                  console.error(error);
                } else {
                  patchState(store, {
                    subscriptions: (data as SubscriptionDto[]).map(
                      subscription =>
                        subscriptionMapperService.mapToModel(subscription)
                    )
                  });
                }

                return EMPTY;
              })
            )
          )
        )
      )
    })
  )
);
