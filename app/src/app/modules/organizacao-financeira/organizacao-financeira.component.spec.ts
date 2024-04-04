import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizacaoFinanceiraComponent } from './organizacao-financeira.component';

describe('OrganizacaoFinanceiraComponent', () => {
  let component: OrganizacaoFinanceiraComponent;
  let fixture: ComponentFixture<OrganizacaoFinanceiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizacaoFinanceiraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizacaoFinanceiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
