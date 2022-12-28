import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageThComponent } from './page-th.component';

describe('PageThComponent', () => {
  let component: PageThComponent;
  let fixture: ComponentFixture<PageThComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageThComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageThComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
