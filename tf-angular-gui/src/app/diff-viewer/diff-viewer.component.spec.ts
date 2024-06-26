import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffViewerComponent } from './diff-viewer.component';

describe('DiffViewerComponent', () => {
  let component: DiffViewerComponent;
  let fixture: ComponentFixture<DiffViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
