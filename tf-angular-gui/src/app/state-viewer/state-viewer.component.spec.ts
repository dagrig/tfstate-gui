import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateViewerComponent } from './state-viewer.component';

describe('StateViewerComponent', () => {
  let component: StateViewerComponent;
  let fixture: ComponentFixture<StateViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
