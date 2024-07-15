export class Subscription {
  id?: string;
  lastName!: string;
  firstName!: string;
  mail!: string;
  address!: string;
  zipcode!: string;
  city!: string;
  identityCardRecto!: { url: string; file: File | null };
  identityCardVerso!: { url: string; file: File | null };
  signature!: { url: string; file: File | null };
  receiptNeeded!: boolean;
}
