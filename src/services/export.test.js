import { describe, it, expect } from 'vitest';
import { generateVisualCsv } from './export';

describe('generateVisualCsv', () => {
  it('should generate the correct visual CSV string', () => {
    const projectName = 'Test Project';
    const people = [
      { id: 'p1', name: 'Alice' },
      { id: 'p2', name: 'Bob' },
    ];
    const tasks = {
      data: [
        {
          id: 1,
          text: 'Task 1',
          start_date: '2025-09-15',
          end_date: '2025-09-22',
          assignments: [{ personId: 'p1', allocation: 100 }],
        },
        {
          id: 2,
          text: 'Task 2',
          start_date: '2025-09-22',
          end_date: '2025-09-29',
          assignments: [{ personId: 'p2', allocation: 50 }],
        },
      ],
    };

    const result = generateVisualCsv(projectName, people, tasks);

    const expectedCsv = [
      '"Task Name",Assignees,"Wk of 2025-09-15","Wk of 2025-09-22"',
      '"Task 1",Alice,Alice,""',
      '"Task 2",Bob,"",Bob',
    ].join('\r\n');

    expect(result).toBe(expectedCsv);
  });

  it('should return null if there are no tasks', () => {
    const result = generateVisualCsv('Test', [], { data: [] });
    expect(result).toBeNull();
  });
});
