import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { StateViewerComponent } from './state-viewer/state-viewer.component';
import { ResourceNodeComponent } from './resource-node/resource-node.component';
import { DiffViewerComponent } from './diff-viewer/diff-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    StateViewerComponent,
    ResourceNodeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    // Angular Material Modules
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    DiffViewerComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }