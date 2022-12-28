import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEnComponent } from './page-en.component';

describe('PageEnComponent', () => {
  let component: PageEnComponent;
  let fixture: ComponentFixture<PageEnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageEnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
