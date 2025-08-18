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
});
