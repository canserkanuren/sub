import { Injectable } from '@angular/core';
import { SubscriptionDto } from '../models/subscription.dto';
import { Subscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionMapperService {
  mapToDto(subscription: Subscription): Partial<SubscriptionDto> {
    return {
      id: subscription.id,
      last_name: subscription.lastName,
      first_name: subscription.firstName,
      mail: subscription.mail,
      address: subscription.address,
      zipcode: subscription.zipcode,
      city: subscription.city,
      receipt_needed: subscription.receiptNeeded
    };
  }

  mapToModel(subscriptionDto: SubscriptionDto): Partial<Subscription> {
    return {
      id: subscriptionDto.id,
      lastName: subscriptionDto.last_name,
      firstName: subscriptionDto.first_name,
      mail: subscriptionDto.mail,
      address: subscriptionDto.address,
      zipcode: subscriptionDto.zipcode,
      city: subscriptionDto.city,
      receiptNeeded: subscriptionDto.receipt_needed
    };
  }
}
