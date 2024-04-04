import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveOptionComponent } from './remove-option.component';

describe('RemoveOptionComponent', () => {
  let component: RemoveOptionComponent;
  let fixture: ComponentFixture<RemoveOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemoveOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
