import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReceitaAlertComponent } from './delete-receita-alert.component';

describe('DeleteReceitaAlertComponent', () => {
  let component: DeleteReceitaAlertComponent;
  let fixture: ComponentFixture<DeleteReceitaAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteReceitaAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteReceitaAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
