# Ganny Project TODO

This file tracks the development progress of the Ganny project.

## Plan

1.  [x] **Project Setup & Initialization.**
    -   [x] Initialize a new React application using Vite.
    -   [x] Install necessary dependencies: `dhtmlx-gantt` and `papaparse`.
    -   [x] Create a basic file structure for components, services, and data models.
    -   [x] Create this `todo.md` file.

2.  [x] **Core UI and Component Implementation.**
    -   [x] Integrate the `dhtmlx-gantt` component into the main application view.
    -   [x] Create a `Toolbar` component for actions (Add Task, Import, Export).
    -   [x] Create a `TaskEditor` component (form for task details).
    -   [x] Create a `PeopleManager` component to manage resources.

3.  [x] **State Management & Data Modeling.**
    -   [x] Implement state management for tasks, people, and settings.
    -   [x] Define data models matching the `project-definition.md` JSON structure.

4.  [x] **Gantt Chart Feature Implementation.**
    -   [x] Populate the Gantt chart with data from the application state.
    -   [x] Handle Gantt events (drag/resize) to update state.
    -   [x] Implement hierarchical tasks (subtasks).
    -   [x] Implement task dependencies.

5.  [x] **Data Import/Export Functionality.**
    -   [x] Implement JSON import/export.
    -   [x] Implement Data CSV import/export.
    -   [x] Implement Visual Timeline CSV export.

6.  [x] **Persistence and Final Touches.**
    -   [x] Implement Local Storage persistence.
    -   [x] Apply CSS for a clean, responsive UI.
    -   [x] Implement the visual warning for over-assigned resources.
    -   [x] Final review of all MVP features.
