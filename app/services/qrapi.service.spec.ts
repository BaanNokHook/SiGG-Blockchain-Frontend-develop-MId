import { TestBed } from '@angular/core/testing';

import { QrapiService } from './qrapi.service';

describe('QrapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QrapiService = TestBed.get(QrapiService);
    expect(service).toBeTruthy();
  });
});
