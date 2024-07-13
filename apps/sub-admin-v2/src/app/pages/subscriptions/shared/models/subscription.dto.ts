export interface SubscriptionDto {
  id: string;
  last_name: string;
  first_name: string;
  mail: string;
  address: string;
  zipcode: string;
  city: string;
  receipt_needed: boolean;
  identity_card_recto_url: string;
  identity_card_verso_url: string;
  signature_url: string;
}
