import { TestBed, async, inject } from '@angular/core/testing';

import { UrlChildGuard } from './url-child.guard';

describe('UrlChildGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlChildGuard]
    });
  });

  it('should ...', inject([UrlChildGuard], (guard: UrlChildGuard) => {
    expect(guard).toBeTruthy();
  }));
});
