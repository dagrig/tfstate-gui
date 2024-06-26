import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateDiffComponent } from './state-diff.component';

describe('StateDiffComponent', () => {
  let component: StateDiffComponent;
  let fixture: ComponentFixture<StateDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateDiffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
