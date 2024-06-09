import { bootstrapApplication } from '@angular/platform-browser';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

registerLicense(environment.SYNCFUSION_KEY);

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
