import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';


import { TerraformStateService } from '../terraform-state.service';
import { TerraformState } from '../models/terraform-state.model';
import { ResourceNodeComponent } from '../resource-node/resource-node.component';

type StateSource = 'aws' | 'azure' | 'local';

@Component({
  selector: 'app-state-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatFormFieldModule,
    ResourceNodeComponent,
  ],
  templateUrl: './state-viewer.component.html',
  styleUrls: ['./state-viewer.component.scss']
})

export class StateViewerComponent implements OnInit {
  terraformState: TerraformState | null = null;
  stateSource: StateSource = 'local';
  sourceConfig: any = {
    local: { file: null as File | null },
    aws: { bucket: '', key: '', region: '' },
    azure: { storageAccount: '', container: '', key: '' }
  };

  constructor(private terraformStateService: TerraformStateService) {}

  ngOnInit() {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          this.terraformState = JSON.parse(e.target.result);
        } catch (error) {
          console.error('Error parsing Terraform state file:', error);
          // Handle error (e.g., show an error message to the user)
        }
      };
      reader.readAsText(file);
    }
  }

  loadState() {
    if (this.stateSource === 'local') {
      this.loadLocalState();
    } else {
      const config = this.sourceConfig[this.stateSource];
      this.terraformStateService.getStateFile(this.stateSource, config)
        .subscribe(
          (state: TerraformState) => {
            this.terraformState = state;
          },
          error => {
            console.error('Error loading state file:', error);
          }
        );
    }
  }

  loadLocalState() {
    const file = this.sourceConfig.local.file;
    if (!file) {
      console.error('No file selected');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result as string;
        this.terraformState = JSON.parse(content) as TerraformState;
      } catch (error) {
        console.error('Error parsing state file:', error);
      }
    };
    reader.readAsText(file);
  }
}