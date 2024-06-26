import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceNodeComponent } from './resource-node.component';

describe('ResourceNodeComponent', () => {
  let component: ResourceNodeComponent;
  let fixture: ComponentFixture<ResourceNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceNodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
