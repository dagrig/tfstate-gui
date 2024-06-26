import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing/app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Make sure this path is correct

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(routes), provideAnimationsAsync()
  ]
}).catch(err => console.error(err));