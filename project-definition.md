Product Definition Document: Simple Gantt Chart Tool
Version: 1.0

Date: September 15, 2025

Status: Ready for Development

1. Executive Summary 📝
This document outlines the requirements for a simple, client-side Gantt chart tool. The application will run entirely within the user's web browser, requiring no installation, backend server, or user registration. Its primary purpose is to provide a fast, private, and intuitive solution for individuals and small teams to create, manage, and visualize project timelines.

Key features include hierarchical tasks (subtasks), resource assignment, effort tracking, and robust import/export functionality, including a standard data CSV and a unique visual timeline CSV designed for users who use Excel as a Gantt chart renderer.

2. Target Audience
Project managers in small teams who find enterprise tools overly complex.

Students, freelancers, and individuals managing personal projects.

Anyone needing a quick, temporary tool to visualize a project plan without creating an account.

3. Core Features & Functionality 🚀
3.1 Project & Resource Management
Project Container: The application manages a single project at a time.

People (Resources): Users can define a project-level list of people by name/ID. This list is then used for task assignments.

3.2 Task Management
Hierarchical Tasks: Tasks can be nested under parent tasks to create a work breakdown structure. The UI should visually represent this hierarchy (e.g., indentation).

Task Attributes: Each task, whether a parent or a subtask, will have the following properties:

Task Name: A brief description.

Dates & Duration: Start Date, End Date, and a calculated Duration field. All should be interactive.

Progress: A percentage (0-100%) indicating completion.

Dependencies: Can link to multiple preceding tasks by their IDs.

Assignments (Optional): Assign one or more people from the project's resource list. Each assignment includes:

Fractional Allocation: Assign a person for a fraction of their time (e.g., 50%).

Over-assignment: The tool will permit a person's total allocation to exceed 100% across concurrent tasks, but should provide a visual warning.

Effort (Optional): The estimated work required in hours (e.g., 40h).

Notes (Optional): A multi-line text field for additional details. The UI must support full CRUD (Create, Read, Update, Delete) for notes.

Hyperlink (Optional): A URL that is clickable in the UI and opens in a new tab.

3.3 Gantt Chart Visualization & Interaction
Timeline View: The primary interface will be a Gantt chart displaying tasks as bars against a calendar timeline (days/weeks/months). Parent tasks should visually span the full duration of their subtasks.

Drag-and-Drop: Users can adjust task timing and duration by dragging and resizing bars directly on the timeline.

Dependency Connectors: Visual arrows will link dependent tasks, automatically adjusting subsequent tasks when a predecessor's date changes.

3.4 Data Import & Export
Primary Format (JSON):

Export to JSON: Saves the entire project state (tasks, people, etc.) to a .json file. This is the primary method for saving work.

Import from JSON: Loads a project from a .json file, fully restoring the application state.

Data Portability (Data CSV):

Export to Data CSV: Exports all task data into a standard tabular .csv file where each row is a task. This is for data analysis or migration.

Import from Data CSV: Populates a new project from a .csv file with the specified format.

Visual Reporting (Visual Timeline CSV):

Export-Only: Creates a special .csv file designed to be a human-readable Gantt chart within spreadsheet software like Excel.

Format: Tasks are rows, and columns represent time intervals (weeks). Cells are populated to show which tasks are active and who is assigned during that week.

4. User Interface & User Experience (UI/UX) Goals ✨
Simplicity & Clarity: The UI must be minimal, uncluttered, and intuitive. Avoid hidden menus or complex workflows.

Zero Friction: No login, signup, or onboarding is required. Users can start building a project immediately.

Local Persistence: The application will use the browser's Local Storage to automatically save the current project state, preventing data loss on page refresh.

Responsiveness: The layout should be functional and readable on standard desktop and tablet screen sizes.

5. Technical Requirements ⚙️
5.1 Architecture & Tech Stack
Architecture: 100% client-side Single Page Application (SPA).

JavaScript Framework: React, Vue, or Svelte.

Gantt Chart Library: Utilize a robust open-source library (e.g., Frappe Gantt, DHTMLX) to accelerate development and ensure a reliable interactive timeline.

Browser APIs: Use the FileReader API for imports and Local Storage for state persistence. File downloads will be triggered programmatically.

5.2 Data Models
1. JSON Structure (Primary Model):

JSON

{
  "projectName": "New Website Launch",
  "people": [
    { "id": "p1", "name": "Alex" },
    { "id": "p2", "name": "Brenda" }
  ],
  "tasks": [
    {
      "id": 1, "parentId": null, "taskName": "Phase 1: Discovery", "startDate": "2025-09-22", "endDate": "2025-10-03", "progress": 50,
      "dependencies": null, "effort": 80, "assignments": [{ "personId": "p1", "allocation": 100 }],
      "notes": "Kick-off meeting notes are attached.", "hyperlink": "https://example.com/notes/kickoff"
    },
    {
      "id": 2, "parentId": 1, "taskName": "Stakeholder Interviews", "startDate": "2025-09-22", "endDate": "2025-09-26", "progress": 100,
      "dependencies": null, "effort": 40, "assignments": [{ "personId": "p1", "allocation": 50 }],
      "notes": "", "hyperlink": ""
    },
    {
      "id": 3, "parentId": null, "taskName": "Phase 2: Design", "startDate": "2025-10-06", "endDate": "2025-10-17", "progress": 0,
      "dependencies": [1], "effort": 80, "assignments": [{ "personId": "p2", "allocation": 100 }],
      "notes": "Waiting on final brand guidelines.", "hyperlink": ""
    }
  ]
}
2. Data CSV Structure:

Rule: Fields containing commas, line breaks, or double quotes must be enclosed in double quotes (").

Code snippet

id,parentId,taskName,startDate,endDate,progress,dependencies,effort,assignments,notes,hyperlink
1,,Phase 1: Discovery,2025-09-22,2025-10-03,50,,80,"p1:100","Kick-off meeting notes are attached.","https://example.com/notes/kickoff"
2,1,Stakeholder Interviews,2025-09-22,2025-09-26,100,,40,"p1:50",,
3,,Phase 2: Design,2025-10-06,2025-10-17,0,"1",80,"p2:100","Waiting on final brand guidelines.",
3. Visual Timeline CSV Structure (Export-Only):

Rule: This format provides a weekly grid view of the project timeline.

Code snippet

Task Name,Assignees,"Wk of 2025-09-22","Wk of 2025-09-29","Wk of 2025-10-06","Wk of 2025-10-13"
"Phase 1: Discovery",Alex,Alex,Alex,,
"- Stakeholder Interviews",Alex,Alex,,,,
"Phase 2: Design",Brenda,,,Brenda,Brenda
6. MVP & Future Enhancements 🗺️
6.1 Minimum Viable Product (MVP)
The first release must include all features detailed in sections 3, 4, and 5. The focus is on a stable, functional client-side tool that delivers on the core promise of simple Gantt chart creation and robust data import/export.

6.2 Potential Future Enhancements
Critical Path Highlighting: Automatically identify and display the project's critical path.

Resource View: A separate view to show each person's total allocation over time to easily spot over-assignments.

Export to PDF/PNG: Allow users to export a visual snapshot of the Gantt chart.

PWA Conversion: Convert the application into a Progressive Web App for better offline capabilities.

Version 2.0 (Backend): Introduce a backend service to enable user accounts, cloud project storage, and real-time collaboration.
