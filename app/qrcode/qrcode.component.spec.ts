import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PageQRComponent } from './qrcode.component';

describe('PageQRComponent', () => {
  let component: PageQRComponent;
  let fixture: ComponentFixture<PageQRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageQRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
