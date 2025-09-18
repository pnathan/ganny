export const initialData = {
  projectName: "New Website Launch",
  people: [
    { id: "p1", name: "Alex" },
    { id: "p2", name: "Brenda" }
  ],
  tasks: {
    data: [
      {
        id: 1,
        text: "Phase 1: Discovery",
        start_date: "2025-09-22",
        end_date: "2025-10-04",
        progress: 0.5,
        open: true,
        type: 'project',
        effort: 80,
        assignments: [{ personId: "p1", allocation: 100 }],
        notes: "Kick-off meeting notes are attached.",
        hyperlink: "https://example.com/notes/kickoff"
      },
      {
        id: 2,
        text: "Stakeholder Interviews",
        start_date: "2025-09-22",
        end_date: "2025-09-27",
        parent: 1,
        progress: 1,
        effort: 40,
        assignments: [{ personId: "p1", allocation: 50 }],
        notes: "",
        hyperlink: ""
      },
      {
        id: 3,
        text: "Phase 2: Design",
        start_date: "2025-10-06",
        end_date: "2025-10-18",
        progress: 0,
        open: true,
        type: 'project',
        dependencies: '1',
        effort: 80,
        assignments: [{ personId: "p2", allocation: 100 }],
        notes: "Waiting on final brand guidelines.",
        hyperlink: ""
      }
    ],
    links: [
        { id: 1, source: 1, target: 3, type: '0' }
    ]
  }
};
