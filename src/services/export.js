import Papa from 'papaparse';

export const generateVisualCsv = (projectName, people, tasks) => {
  if (!tasks.data || tasks.data.length === 0) {
    return null;
  }

  // 1. Find project date range
  const dates = tasks.data.flatMap(t => [new Date(t.start_date), new Date(t.end_date)]);
  const minDate = new Date(Math.min.apply(null, dates));
  const maxDate = new Date(Math.max.apply(null, dates));

  // 2. Generate weekly headers
  const headers = ["Task Name", "Assignees"];
  let currentWeek = new Date(minDate);
  while (currentWeek < maxDate) {
    headers.push(`Wk of ${currentWeek.toISOString().slice(0, 10)}`);
    currentWeek.setDate(currentWeek.getDate() + 7);
  }

  // 3. Generate rows
  const peopleMap = new Map(people.map(p => [p.id, p.name]));
  const rows = tasks.data.map(task => {
    const row = { "Task Name": task.text, "Assignees": "" };

    const assignees = (task.assignments || []).map(a => peopleMap.get(a.personId) || a.personId).join(', ');
    row["Assignees"] = assignees;

    const taskStart = new Date(task.start_date);
    const taskEnd = new Date(task.end_date);

    let weekStart = new Date(minDate);
    while (weekStart < maxDate) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const colName = `Wk of ${weekStart.toISOString().slice(0, 10)}`;

      // Check for overlap
      if (taskStart < weekEnd && taskEnd > weekStart) {
        row[colName] = assignees;
      } else {
        row[colName] = "";
      }
      weekStart.setDate(weekStart.getDate() + 7);
    }
    return row;
  });

  return Papa.unparse(rows, { header: true });
};
