import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withState } from '@ngrx/signals';
import { Subscription } from '../../shared/models/subscription.model';
import { withSubscriptionStoreMethods } from './subscription.store.methods';

export type SubscriptionState = {
  subscriptions: Subscription[];
  selectedSubscription: Subscription | null;
};

const initialState: SubscriptionState = {
  subscriptions: [],
  selectedSubscription: null
};

export const SubscriptionStore = signalStore(
  { providedIn: 'root' },
  withDevtools('subscriptions'),
  withState(initialState),
  withSubscriptionStoreMethods()
);
