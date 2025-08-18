import { describe, it, expect, beforeEach } from 'vitest';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController(new AppService());
  });

  it('should return OK', () => {
    expect(appController.getHello()).toBe('OK');
  });
});
