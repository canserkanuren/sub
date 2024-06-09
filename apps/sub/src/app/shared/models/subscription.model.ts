export class Subscription {
  lastName!: string;
  firstName!: string;
  mail!: string;
  address!: string;
  zipcode!: string;
  city!: string;
  identityCardRecto!: File;
  identityCardVerso!: File;
  receiptNeeded!: boolean;

  constructor(model?: unknown) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
