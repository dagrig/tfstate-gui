import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { diffLines, Change } from 'diff';

interface DiffLine {
  number: number;
  text: string;
  added?: boolean;
  removed?: boolean;
}

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
  
  diffLines: { left: DiffLine | null; right: DiffLine | null }[] = [];

  ngOnChanges() {
    this.computeDiff();
  }

  private computeDiff() {
    const diffResult = diffLines(this.oldText, this.newText);
    let leftLines: DiffLine[] = [];
    let rightLines: DiffLine[] = [];
    let leftLineNumber = 1;
    let rightLineNumber = 1;

    for (const change of diffResult) {
      const lines = change.value.split('\n').filter(line => line !== '');
      
      if (change.added) {
        lines.forEach(line => {
          rightLines.push({ number: rightLineNumber++, text: line, added: true });
        });
      } else if (change.removed) {
        lines.forEach(line => {
          leftLines.push({ number: leftLineNumber++, text: line, removed: true });
        });
      } else {
        lines.forEach(line => {
          leftLines.push({ number: leftLineNumber++, text: line });
          rightLines.push({ number: rightLineNumber++, text: line });
        });
      }
    }

    // Zip the left and right lines together
    this.diffLines = this.zipDiffLines(leftLines, rightLines);
  }

  private zipDiffLines(leftLines: DiffLine[], rightLines: DiffLine[]): { left: DiffLine | null; right: DiffLine | null }[] {
    const result: { left: DiffLine | null; right: DiffLine | null }[] = [];
    const maxLength = Math.max(leftLines.length, rightLines.length);

    for (let i = 0; i < maxLength; i++) {
      result.push({
        left: i < leftLines.length ? leftLines[i] : null,
        right: i < rightLines.length ? rightLines[i] : null
      });
    }

    return result;
  }
}