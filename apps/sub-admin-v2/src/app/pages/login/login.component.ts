import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective
} from '@spartan-ng/ui-card-helm';
import {
  HlmInputDirective,
  HlmInputErrorDirective
} from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { toast } from 'ngx-sonner';
import { RegisterPayload } from '../../core/auth/models/register.model';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'sub-admin-login',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
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
    HlmCardTitleDirective
  ],
  template: `
    <section class="flex justify-center md:p-10 p-5">
      <section hlmCard class="w-96">
        <div hlmCardHeader>
          <h3 hlmCardTitle>Login</h3>
        </div>

        <form
          hlmCardContent
          class="flex flex-col gap-4 justify-center"
          (ngSubmit)="login()"
          [formGroup]="credentials"
        >
          <label hlmLabel>
            Email
            <input
              hlmInput
              class="w-full"
              type="text"
              formControlName="email"
            />

            @if (
              credentials.get('email')?.touched &&
              credentials.get('email')?.errors?.['required']
            ) {
              <span hlmInputError>This field is required.</span>
            }
          </label>

          <label hlmLabel>
            Password
            <input
              hlmInput
              class="w-full"
              type="password"
              formControlName="password"
            />

            @if (
              credentials.get('password')?.touched &&
              credentials.get('password')?.errors?.['required']
            ) {
              <span hlmInputError>This field is required.</span>
            }
          </label>

          <button hlmBtn color="danger" type="submit">Login</button>
        </form>
      </section>
    </section>
  `
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  credentials = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async login() {
    const { valid } = this.credentials;

    if (valid) {
      // TODO Handle errors better here since we can have network issues aswell
      const credentials: RegisterPayload = this.credentials
        .value as RegisterPayload;

      try {
        await this.authService.login(credentials);

        // redirect to homepage
        this.router.navigateByUrl('/');
        console.log('toto');
      } catch (e) {
        toast(`User with email ${credentials.email} does not exist.`);
      }
    } else {
      this.credentials.markAllAsTouched();
    }
  }
}
