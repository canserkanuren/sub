import { inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { toast } from 'ngx-sonner';
import { EMPTY, forkJoin, pipe, retry, switchMap } from 'rxjs';
import { SubscriptionDto } from '../../shared/models/subscription.dto';
import { SubscriptionMapperService } from '../../shared/services/subscription-mapper.service';
import { SubscriptionService } from '../../shared/services/subscription.service';
import { SubscriptionState } from './subscription.store';

export const withSubscriptionStoreMethods = () => {
  return signalStoreFeature(
    { state: type<SubscriptionState>() },
    withMethods(
      (
        store,
        subscriptionService = inject(SubscriptionService),
        subscriptionMapperService = inject(SubscriptionMapperService)
      ) => ({
        loadSubscriptions: rxMethod<{
          start: number;
          end: number;
          size: number;
        }>(
          pipe(
            switchMap(
              params =>
                // interval(3000).pipe(
                // switchMap(() =>
                subscriptionService
                  .getSubscriptions(params.start, params.end, params.size)
                  .pipe(
                    retry(3),
                    switchMap(({ error, data }) => {
                      if (error) {
                        toast.error(
                          'An error occurred while fetching subscriptions'
                        );
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
              //   )
              // )
            )
          )
        ),
        loadSubscriptionById: rxMethod<number>(
          pipe(
            switchMap(id =>
              subscriptionService.getSubscriptionById(id).pipe(
                switchMap(({ error, data }) => {
                  if (error) {
                    console.error(error);

                    return EMPTY;
                  } else {
                    const subscription = subscriptionMapperService.mapToModel(
                      data as SubscriptionDto
                    );
                    patchState(store, {
                      selectedSubscription: subscription
                    });

                    return forkJoin(
                      [
                        subscription.identityCardRecto.url,
                        subscription.identityCardVerso.url,
                        subscription.signature.url
                      ].map(fileName =>
                        subscriptionService.getFileFromBucket(fileName)
                      )
                    );
                  }
                }),
                switchMap(
                  ([identityCardRecto, identityCardVerso, signature]) => {
                    if (
                      identityCardRecto.error ||
                      identityCardVerso.error ||
                      signature.error
                    ) {
                      toast.error('An error occurred while fetching the files');
                    } else {
                      const selectedSubscription = store.selectedSubscription();

                      if (selectedSubscription) {
                        patchState(store, {
                          selectedSubscription: {
                            ...selectedSubscription,
                            identityCardRecto: {
                              ...selectedSubscription.identityCardRecto,
                              file: identityCardRecto.data.signedUrl
                            },
                            identityCardVerso: {
                              ...selectedSubscription.identityCardVerso,
                              file: identityCardVerso.data.signedUrl
                            },
                            signature: {
                              ...selectedSubscription.signature,
                              file: signature.data.signedUrl
                            }
                          }
                        });
                      }
                    }

                    return EMPTY;
                  }
                )
              )
            )
          )
        )
      })
    )
  );
};
