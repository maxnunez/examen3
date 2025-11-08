import { TestBed } from '@angular/core/testing';

import { RickmortyApi } from './rickmorty-api';

describe('RickmortyApi', () => {
  let service: RickmortyApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RickmortyApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
