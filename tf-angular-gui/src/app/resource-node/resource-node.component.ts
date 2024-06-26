import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-resource-node',
  standalone: true,
  imports: [CommonModule, MatExpansionModule],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>
          {{ resource.type }}: {{ resource.name }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <pre>{{ resourceJson }}</pre>
    </mat-expansion-panel>
  `,
  styles: [`
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 400px;
      overflow-y: auto;
    }
  `]
})
export class ResourceNodeComponent {
  @Input() resource: any;

  get resourceJson() {
    return JSON.stringify(this.resource, null, 2);
  }
}