import { TestBed } from '@angular/core/testing';

import { CodeService } from './code-service.service';

describe('CodeServiceService', () => {
  let service: CodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
