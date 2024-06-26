import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';


import { TerraformStateService } from '../terraform-state.service';
import { TerraformState } from '../models/terraform-state.model';
import { ResourceNodeComponent } from '../resource-node/resource-node.component';
import { StateDiffComponent } from '../state-diff/state-diff.component';
import { DiffViewerComponent } from '../diff-viewer/diff-viewer.component';

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
    StateDiffComponent,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    DiffViewerComponent,
  ],
  templateUrl: './state-viewer.component.html',
  styleUrls: ['./state-viewer.component.scss']
})

export class StateViewerComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  terraformState: TerraformState | null = null;
  stateFiles: any[] = [];
  filterText: string = '';
  MAX_FILES = 5;
  stateSource: StateSource = 'local';
  sourceConfig: any = {
    local: { file: null as File | null },
    aws: { bucket: '', key: '', region: '' },
    azure: { storageAccount: '', container: '', key: '' }
  };
  selectedOldFile: any;
  selectedNewFile: any;
  
  getStateFileContent(file: any): string {
    return JSON.stringify(file.content, null, 2);
  }

  constructor(
    private terraformStateService: TerraformStateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  //trigger the file input
  triggerFileInput() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.tfstate';
    fileInput.onchange = (event) => this.onFileSelected(event);
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result as string;
          if (!content.trim()) {
            throw new Error('The file is empty.');
          }
          const parsedContent = this.parseTerraformState(content);
          this.addStateFile(file.name, parsedContent);
        } catch (error) {
          console.error('Error parsing Terraform state file:', error);
          this.showErrorMessage(`Error parsing file: ${this.getErrorMessage(error)}`);
        }
      };
      reader.readAsText(file);
    }
  }
  
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  getFilteredResources(stateFile: any): any[] {
    if (!stateFile || !stateFile.content || !stateFile.content.resources) return [];
    return stateFile.content.resources.filter((resource: any) =>
      resource.type.toLowerCase().includes(this.filterText.toLowerCase()) ||
      resource.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  addStateFile(name: string, content: any) {
    if (this.stateFiles.length < this.MAX_FILES) {
      this.stateFiles.push({ name, content });
      this.stateFiles = [...this.stateFiles];
      this.showSuccessMessage(`Successfully loaded: ${name}`);
    } else {
      this.showErrorMessage('Maximum number of files reached.');
    }
  }
  
  removeStateFile(index: number) {
    this.stateFiles.splice(index, 1);
  }

  loadState() {
    if (this.stateSource === 'local') {
      // Instead of calling loadLocalState directly, we'll trigger the file input
      this.triggerFileInput();
    } else {
      const config = this.sourceConfig[this.stateSource];
      this.terraformStateService.getStateFile(this.stateSource, config)
        .subscribe(
          (state: TerraformState) => {
            this.addStateFile(this.stateSource, state);
          },
          error => {
            console.error('Error loading state file:', error);
          }
        );
    }
  }
  

  parseTerraformState(stateContent: string): any {
    try {
      // First, try to parse as JSON
      return JSON.parse(stateContent);
    } catch (error) {
      // If JSON parsing fails, try custom parsing
      return this.parseCustomFormat(stateContent);
    }
  }

  parseCustomFormat(stateContent: string): any {
    const lines = stateContent.split('\n');
    const result: any = {};
    let currentObject: any = result;
    const stack: any[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.endsWith('{')) {
        const key = trimmedLine.slice(0, -1).trim();
        currentObject[key] = {};
        stack.push(currentObject);
        currentObject = currentObject[key];
      } else if (trimmedLine === '}') {
        currentObject = stack.pop();
      } else if (trimmedLine.includes('=')) {
        const [key, value] = trimmedLine.split('=').map(s => s.trim());
        currentObject[key] = this.parseValue(value);
      }
    }

    if (Object.keys(result).length === 0) {
      throw new Error('Unable to parse the file. It may be in an unsupported format.');
    }

    return result;
  }

  parseValue(value: string): any {
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(Number(value))) return Number(value);
    return value;
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

}