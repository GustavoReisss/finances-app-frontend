import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDespesaAlertComponent } from './delete-despesa-alert.component';

describe('DeleteDespesaAlertComponent', () => {
  let component: DeleteDespesaAlertComponent;
  let fixture: ComponentFixture<DeleteDespesaAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDespesaAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteDespesaAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
