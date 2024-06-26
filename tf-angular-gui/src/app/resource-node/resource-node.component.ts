import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-resource-node',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatListModule],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>
          {{ resource.type }}
        </mat-panel-title>
        <mat-panel-description>
          {{ resource.name }}
        </mat-panel-description>
      </mat-expansion-panel-header>
      <mat-list>
        <mat-list-item *ngFor="let instance of resource.instances">
          <h3 matListItemTitle>Instance</h3>
          <p matListItemLine>{{ instance.attributes | json }}</p>
        </mat-list-item>
      </mat-list>
    </mat-expansion-panel>
  `,
  styles: []
})
export class ResourceNodeComponent {
  @Input() resource: any;
}