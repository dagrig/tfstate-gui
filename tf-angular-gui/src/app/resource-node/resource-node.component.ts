import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-resource-node',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatButtonModule],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>
          <mat-icon>{{ getResourceIcon(resource.type) }}</mat-icon>
          {{ resource.type }}: {{ resource.name }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <div class="resource-details">
        <div><strong>ID:</strong> {{ resource.instances[0]?.attributes?.id || 'N/A' }}</div>
        <div><strong>Provider:</strong> {{ resource.provider }}</div>
        <div *ngFor="let key of getTopLevelAttributes(resource)">
          <strong>{{ key }}:</strong> {{ resource.instances[0]?.attributes[key] }}
        </div>
        <button mat-button color="primary" (click)="showFullJson = !showFullJson">
          {{ showFullJson ? 'Hide' : 'Show' }} Full JSON
        </button>
        <pre *ngIf="showFullJson">{{ resourceJson }}</pre>
      </div>
    </mat-expansion-panel>
  `,
  styles: [`
    .resource-details { padding: 10px; }
    pre { 
      white-space: pre-wrap; 
      word-wrap: break-word; 
      max-height: 400px; 
      overflow-y: auto; 
      background-color: #f5f5f5; 
      padding: 10px; 
      border-radius: 4px;
    }
    mat-icon { margin-right: 8px; }
  `]
})
export class ResourceNodeComponent {
  @Input() resource: any;
  showFullJson = false;

  get resourceJson() {
    return JSON.stringify(this.resource, null, 2);
  }

  getResourceIcon(type: string): string {
    // Map resource types to Material icons
    const iconMap: {[key: string]: string} = {
      'aws_instance': 'computer',
      'aws_s3_bucket': 'storage',
      'aws_vpc': 'cloud',
      // Add more mappings as needed
    };
    return iconMap[type] || 'build';
  }

  getTopLevelAttributes(resource: any): string[] {
    const attributes = resource.instances[0]?.attributes || {};
    return Object.keys(attributes).slice(0, 5); // Show first 5 attributes
  }
}