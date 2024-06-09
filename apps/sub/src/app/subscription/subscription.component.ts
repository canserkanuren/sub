import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
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
import { Subscription } from '../shared/models/subscription.model';
import { SupabaseService } from '../shared/services/supabase.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    ReactiveFormsModule,

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

    HlmCheckboxComponent
  ],
  template: `
    <section hlmCard>
      <div hlmCardHeader>
        <h3 hlmCardTitle>Your personal information</h3>

        <p hlmCardDescription>
          In order to process your subscription, please fill in the required
          fields below.
        </p>
      </div>

      <form
        hlmCardContent
        class="flex flex-col gap-4 justify-center"
        [formGroup]="form"
        (ngSubmit)="submitSub()"
      >
        <label hlmLabel>
          Last name
          <input
            hlmInput
            class="w-full"
            type="text"
            formControlName="lastName"
          />

          @if (
            form.get('lastName')?.touched &&
            form.get('lastName')?.errors?.['required']
          ) {
            <span hlmInputError>This field is required.</span>
          }
        </label>

        <label hlmLabel>
          First name
          <input
            hlmInput
            class="w-full"
            type="text"
            formControlName="firstName"
          />

          @if (
            form.get('firstName')?.touched &&
            form.get('firstName')?.errors?.['required']
          ) {
            <span hlmInputError>This field is required.</span>
          }
        </label>

        <label hlmLabel>
          Mail
          <input hlmInput class="w-full" type="text" formControlName="mail" />

          @if (form.get('mail')?.touched) {
            <span hlmInputError>
              @if (form.get('mail')?.errors?.['required']) {
                This field is required.
              } @else if (form.get('mail')?.errors?.['email']) {
                This field is not an email.
              }
            </span>
          }
        </label>

        <label hlmLabel>
          Address
          <input
            hlmInput
            class="w-full"
            type="text"
            formControlName="address"
          />

          @if (
            form.get('address')?.touched &&
            form.get('address')?.errors?.['required']
          ) {
            <span hlmInputError>This field is required.</span>
          }
        </label>

        <label hlmLabel>
          Zip code
          <input
            hlmInput
            class="w-full"
            type="text"
            formControlName="zipcode"
          />

          @if (
            form.get('zipcode')?.touched &&
            form.get('zipcode')?.errors?.['required']
          ) {
            <span hlmInputError>This field is required.</span>
          }
        </label>

        <label hlmLabel>
          City
          <input hlmInput class="w-full" type="text" formControlName="city" />

          @if (
            form.get('city')?.touched && form.get('city')?.errors?.['required']
          ) {
            <span hlmInputError>This field is required.</span>
          }
        </label>

        <label
          hlmLabel
          [error]="
            form.get('identityCardRecto')?.touched &&
            form.get('identityCardRecto')?.errors?.['required']
              ? true
              : 'auto'
          "
        >
          Identity card (first page)
          <input
            hlmInput
            class="w-full"
            type="file"
            [error]="
              form.get('identityCardRecto')?.touched &&
              form.get('identityCardRecto')?.errors?.['required']
                ? true
                : 'auto'
            "
            (change)="updateIdentityCardRecto($event)"
          />

          @if (
            form.get('identityCardRecto')?.touched &&
            form.get('identityCardRecto')?.errors?.['required']
          ) {
            <span hlmInputError>This field is required.</span>
          }
        </label>

        <label
          hlmLabel
          [error]="
            form.get('identityCardVerso')?.touched &&
            form.get('identityCardVerso')?.errors?.['required']
              ? true
              : 'auto'
          "
        >
          Identity card (second page)
          <input
            hlmInput
            class="w-full"
            type="file"
            [error]="
              form.get('identityCardVerso')?.touched &&
              form.get('identityCardVerso')?.errors?.['required']
                ? true
                : 'auto'
            "
            (change)="updateIdentityCardVerso($event)"
          />

          @if (
            form.get('identityCardVerso')?.touched &&
            form.get('identityCardVerso')?.errors?.['required']
          ) {
            <span hlmInputError>This field is required.</span>
          }
        </label>

        <label class="flex items-center" hlmLabel>
          <hlm-checkbox class="mr-2" formControlName="receiptNeeded" />
          Would you like a receipt ?
        </label>

        <button hlmBtn type="submit">Valider</button>
      </form>
    </section>
  `
})
export class SubscriptionComponent {
  readonly cdr = inject(ChangeDetectorRef);
  readonly formBuilder = inject(FormBuilder);

  readonly supabaseService = inject(SupabaseService);

  form: FormGroup = this.formBuilder.group({
    mail: ['', Validators.compose([Validators.required, Validators.email])],
    lastName: ['', Validators.compose([Validators.required])],
    firstName: ['', Validators.compose([Validators.required])],
    address: ['', Validators.compose([Validators.required])],
    zipcode: ['', Validators.compose([Validators.required])],
    city: ['', Validators.compose([Validators.required])],
    identityCardRecto: [null, Validators.compose([Validators.required])],
    identityCardVerso: [null, Validators.compose([Validators.required])],
    receiptNeeded: false
  });

  updateIdentityCardRecto(event: Event): void {
    this.handleFileConversion(event, 'identityCardRecto');
  }

  updateIdentityCardVerso(event: Event): void {
    this.handleFileConversion(event, 'identityCardVerso');
  }

  submitSub(): void {
    if (this.form.valid) {
      this.supabaseService.addSub(new Subscription(this.form.getRawValue()));
    } else {
      this.form.markAllAsTouched();
    }
  }

  private handleFileConversion(event: Event, fieldName: string): void {
    // const reader = new FileReader();

    const file: File = (event.target as any)['files']?.[0];
    this.form.patchValue({ [fieldName]: file });

    // if (file) {
    //   reader.readAsDataURL(file);

    //   reader.onload = () => {
    //     this.form.patchValue({ [fieldName]: reader.result });

    //     this.form.updateValueAndValidity();

    //     this.cdr.markForCheck();
    //   };
    // }
  }
}
