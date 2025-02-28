import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEntradaAlertComponent } from './delete-entrada-alert.component';

describe('DeleteEntradaAlertComponent', () => {
  let component: DeleteEntradaAlertComponent;
  let fixture: ComponentFixture<DeleteEntradaAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEntradaAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteEntradaAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
