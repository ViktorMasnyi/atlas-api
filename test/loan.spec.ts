import { describe, it, expect } from 'vitest';
import { Engine } from 'json-rules-engine';

describe('Rule evaluation', () => {
  it('eligible when score >= 700 and ratio > 1.5', async () => {
    const rules = [
      {
        conditions: {
          all: [
            {
              fact: 'creditScore',
              operator: 'greaterThanInclusive',
              value: 700,
            },
            { fact: 'monthlyIncomeRatio', operator: 'greaterThan', value: 1.5 },
          ],
        },
        event: {
          type: 'eligible',
          params: { eligible: true, reason: 'Passed all checks' },
        },
      },
    ];
    const engine = new Engine(rules);
    const facts = { creditScore: 720, monthlyIncomeRatio: 2 };
    const { events } = await engine.run(facts);
    const ev = events[0];
    expect(ev.params.eligible).toBe(true);
  });

  it('should decline when crime rate >= 0.8', async () => {
    const rules = [
      {
        conditions: {
          all: [
            {
              fact: 'creditScore',
              operator: 'greaterThanInclusive',
              value: 700,
            },
            { fact: 'monthlyIncomeRatio', operator: 'greaterThan', value: 1.5 },
            {
              fact: 'crimeRate',
              operator: 'greaterThanInclusive',
              value: 0.8,
            },
          ],
        },
        event: {
          type: 'eligible',
          params: { eligible: false, reason: 'High crime rate area' },
        },
      },
    ];
    const engine = new Engine(rules);
    const facts = {
      creditScore: 720,
      monthlyIncomeRatio: 2,
      crimeRate: 0.85,
      crimeRateThreshold: 0.8,
      crimeRateWeight: 0.2,
    };
    const { events } = await engine.run(facts);
    const ev = events[0];
    expect(ev.params.eligible).toBe(false);
    expect(ev.params.reason).toBe('High crime rate area');
  });

  it('should approve when crime rate < 0.8', async () => {
    const rules = [
      {
        conditions: {
          all: [
            {
              fact: 'creditScore',
              operator: 'greaterThanInclusive',
              value: 700,
            },
            { fact: 'monthlyIncomeRatio', operator: 'greaterThan', value: 1.5 },
            {
              fact: 'crimeRate',
              operator: 'lessThan',
              value: 0.8,
            },
          ],
        },
        event: {
          type: 'eligible',
          params: {
            eligible: true,
            reason: 'Passed all checks including crime rate',
          },
        },
      },
    ];
    const engine = new Engine(rules);
    const facts = {
      creditScore: 720,
      monthlyIncomeRatio: 2,
      crimeRate: 0.3,
      crimeRateThreshold: 0.8,
      crimeRateWeight: 0.2,
    };
    const { events } = await engine.run(facts);
    const ev = events[0];
    expect(ev.params.eligible).toBe(true);
    expect(ev.params.reason).toBe('Passed all checks including crime rate');
  });

  it('should use crime rate threshold from facts', async () => {
    const rules = [
      {
        conditions: {
          all: [
            {
              fact: 'creditScore',
              operator: 'greaterThanInclusive',
              value: 700,
            },
            { fact: 'monthlyIncomeRatio', operator: 'greaterThan', value: 1.5 },
            {
              fact: 'crimeRate',
              operator: 'greaterThanInclusive',
              value: 0.8,
            },
          ],
        },
        event: {
          type: 'eligible',
          params: { eligible: false, reason: 'High crime rate area' },
        },
      },
    ];
    const engine = new Engine(rules);
    const facts = {
      creditScore: 720,
      monthlyIncomeRatio: 2,
      crimeRate: 0.85,
      crimeRateThreshold: 0.8,
      crimeRateWeight: 0.2,
    };
    const { events } = await engine.run(facts);
    const ev = events[0];
    expect(ev.params.eligible).toBe(false);
  });
});
