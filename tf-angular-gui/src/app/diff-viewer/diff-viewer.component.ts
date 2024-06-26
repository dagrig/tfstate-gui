// diff-viewer.component.ts
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Change, diffLines } from 'diff';

@Component({
  selector: 'app-diff-viewer',
  templateUrl: './diff-viewer.component.html',
  styleUrls: ['./diff-viewer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DiffViewerComponent implements OnChanges {
  @Input() oldText: string = '';
  @Input() newText: string = '';
  
  diffResult: Change[] = [];

  ngOnChanges() {
    this.computeDiff();
  }

  private computeDiff() {
    this.diffResult = diffLines(this.oldText, this.newText);
  }

  getLineClass(change: Change): string {
    if (change.added) return 'added';
    if (change.removed) return 'removed';
    return '';
  }
}