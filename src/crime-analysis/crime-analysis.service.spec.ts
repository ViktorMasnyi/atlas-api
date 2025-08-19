import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CrimeAnalysisService } from './crime-analysis.service';
import { CrimeData } from '../entities/crime-data.entity';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('CrimeAnalysisService', () => {
  let service: CrimeAnalysisService;

  const mockCrimeDataRepository = {
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };

  const mockConfigService = {
    get: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrimeAnalysisService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(CrimeData),
          useValue: mockCrimeDataRepository,
        },
      ],
    }).compile();

    service = module.get<CrimeAnalysisService>(CrimeAnalysisService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseCrimeScore', () => {
    it('should parse valid crime score from response', () => {
      const response = 'The crime score for this area is 0.75';
      const score = (service as any).parseCrimeScore(response);
      expect(score).toBe(0.75);
    });

    it('should parse integer score', () => {
      const response = 'Crime score: 1';
      const score = (service as any).parseCrimeScore(response);
      expect(score).toBe(1);
    });

    it('should throw error for invalid score', () => {
      const response = 'No score found';
      expect(() => (service as any).parseCrimeScore(response)).toThrow(
        'Could not parse crime score from agent response',
      );
    });

    it('should throw error for score out of range', () => {
      const response = 'Score: 1.5';
      expect(() => (service as any).parseCrimeScore(response)).toThrow(
        'Invalid crime score: 1.5. Must be between 0 and 1.',
      );
    });
  });

  describe('storeCrimeData', () => {
    it('should create new crime data record', async () => {
      const zipCode = '94109';
      const crimeScore = 0.75;
      const rawData = { test: 'data' };

      mockCrimeDataRepository.findOne.mockResolvedValue(null);
      mockCrimeDataRepository.create.mockReturnValue({
        zipCode,
        crimeScore,
        rawData,
        lastUpdated: new Date(),
      });
      mockCrimeDataRepository.save.mockResolvedValue({ id: 'test-id' });

      await (service as any).storeCrimeData(zipCode, crimeScore, rawData);

      expect(mockCrimeDataRepository.findOne).toHaveBeenCalledWith({
        where: { zipCode },
      });
      expect(mockCrimeDataRepository.create).toHaveBeenCalledWith({
        zipCode,
        crimeScore,
        rawData,
        lastUpdated: expect.any(Date),
      });
      expect(mockCrimeDataRepository.save).toHaveBeenCalled();
    });

    it('should update existing crime data record', async () => {
      const zipCode = '94109';
      const crimeScore = 0.75;
      const rawData = { test: 'data' };
      const existingData = {
        id: 'existing-id',
        zipCode,
        crimeScore: 0.5,
        rawData: { old: 'data' },
        lastUpdated: new Date('2023-01-01'),
      };

      mockCrimeDataRepository.findOne.mockResolvedValue(existingData);
      mockCrimeDataRepository.save.mockResolvedValue(existingData);

      await (service as any).storeCrimeData(zipCode, crimeScore, rawData);

      expect(mockCrimeDataRepository.findOne).toHaveBeenCalledWith({
        where: { zipCode },
      });
      expect(mockCrimeDataRepository.save).toHaveBeenCalledWith({
        ...existingData,
        crimeScore,
        rawData,
        lastUpdated: expect.any(Date),
      });
    });

    it('should handle storage errors gracefully', async () => {
      const zipCode = '94109';
      const crimeScore = 0.75;
      const rawData = { test: 'data' };

      mockCrimeDataRepository.findOne.mockRejectedValue(new Error('DB Error'));

      // Should not throw error
      await expect(
        (service as any).storeCrimeData(zipCode, crimeScore, rawData),
      ).resolves.not.toThrow();
    });
  });

  describe('getCachedCrimeData', () => {
    it('should return cached crime data', async () => {
      const zipCode = '94109';
      const cachedData = {
        id: 'test-id',
        zipCode,
        crimeScore: 0.75,
        rawData: { test: 'data' },
        lastUpdated: new Date(),
      };

      mockCrimeDataRepository.findOne.mockResolvedValue(cachedData);

      const result = await service.getCachedCrimeData(zipCode);

      expect(result).toEqual(cachedData);
      expect(mockCrimeDataRepository.findOne).toHaveBeenCalledWith({
        where: { zipCode },
      });
    });

    it('should return null when no cached data exists', async () => {
      const zipCode = '94109';

      mockCrimeDataRepository.findOne.mockResolvedValue(null);

      const result = await service.getCachedCrimeData(zipCode);

      expect(result).toBeNull();
    });
  });
});
