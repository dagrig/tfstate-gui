import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-state-diff',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule],
  template: `
    <mat-accordion>
      <mat-expansion-panel *ngFor="let diff of diffs">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <mat-icon [ngStyle]="{color: getColorForChange(diff.changeType)}">
              {{getIconForChange(diff.changeType)}}
            </mat-icon>
            {{diff.resourceType}}: {{diff.resourceName}}
          </mat-panel-title>
        </mat-expansion-panel-header>
        <pre>{{diff.details | json}}</pre>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: [`
    pre { white-space: pre-wrap; word-wrap: break-word; }
  `]
})
export class StateDiffComponent implements OnChanges {
  @Input() stateFiles: { name: string; content: any }[] = [];
  diffs: any[] = [];

  ngOnChanges() {
    this.calculateDiffs();
  }

  calculateDiffs() {
    this.diffs = [];
    if (this.stateFiles.length < 2) return;

    const baseState = this.stateFiles[0].content;
    for (let i = 1; i < this.stateFiles.length; i++) {
      const compareState = this.stateFiles[i].content;
      this.diffStates(baseState, compareState);
    }
  }

  diffStates(baseState: any, compareState: any) {
    const baseResources = baseState.resources || [];
    const compareResources = compareState.resources || [];

    // Check for added or modified resources
    compareResources.forEach((compareResource: any) => {
      const baseResource = baseResources.find((r: any) => 
        r.type === compareResource.type && r.name === compareResource.name
      );

      if (!baseResource) {
        this.diffs.push({
          changeType: 'added',
          resourceType: compareResource.type,
          resourceName: compareResource.name,
          details: compareResource
        });
      } else if (JSON.stringify(baseResource) !== JSON.stringify(compareResource)) {
        this.diffs.push({
          changeType: 'modified',
          resourceType: compareResource.type,
          resourceName: compareResource.name,
          details: {
            old: baseResource,
            new: compareResource}
          });
        }
      });
  
      // Check for removed resources
      baseResources.forEach((baseResource: any) => {
        const compareResource = compareResources.find((r: any) => 
          r.type === baseResource.type && r.name === baseResource.name
        );
  
        if (!compareResource) {
          this.diffs.push({
            changeType: 'removed',
            resourceType: baseResource.type,
            resourceName: baseResource.name,
            details: baseResource
          });
        }
      });
    }
  
    getColorForChange(changeType: string): string {
      switch (changeType) {
        case 'added':
          return 'green';
        case 'removed':
          return 'red';
        case 'modified':
          return 'orange';
        default:
          return 'black';
      }
    }
  
    getIconForChange(changeType: string): string {
      switch (changeType) {
        case 'added':
          return 'add_circle';
        case 'removed':
          return 'remove_circle';
        case 'modified':
          return 'update';
        default:
          return 'info';
      }
    }
  }