import React, { useState, useEffect } from 'react';
import Gantt from './components/Gantt';
import Toolbar from './components/Toolbar';
import TaskEditor from './components/TaskEditor';
import PeopleManager from './components/PeopleManager';
import { initialData } from './data/initial-data';
import Papa from 'papaparse';
import './App.css';

const App = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const loadState = () => {
    try {
      const serializedState = localStorage.getItem('ganny-project');
      if (serializedState === null) {
        return initialData;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.error("Could not load state", err);
      return initialData;
    }
  };

  const [projectName, setProjectName] = useState(() => loadState().projectName);
  const [people, setPeople] = useState(() => loadState().people);
  const [tasks, setTasks] = useState(() => loadState().tasks);

  useEffect(() => {
    if (!isDataLoaded) {
        const storedState = localStorage.getItem('ganny-project');
        if (storedState) {
            const loadedState = JSON.parse(storedState);
            setProjectName(loadedState.projectName);
            setPeople(loadedState.people);
            setTasks(loadedState.tasks);
        }
        setIsDataLoaded(true);
        return;
    }

    try {
      const stateToSave = {
        projectName,
        people,
        tasks,
      };
      const serializedState = JSON.stringify(stateToSave);
      localStorage.setItem('ganny-project', serializedState);
    } catch (err) {
      console.error("Could not save state", err);
    }
  }, [projectName, people, tasks, isDataLoaded]);

  useEffect(() => {
    const checkOverAllocations = () => {
      const newTasksData = JSON.parse(JSON.stringify(tasks.data));
      newTasksData.forEach(t => t.isOverAllocated = false);
      const overAllocatedTaskIds = new Set();

      people.forEach(person => {
        const personTasks = newTasksData.filter(task =>
          (task.assignments || []).some(a => a.personId === person.id)
        );

        if (personTasks.length < 2) return;

        const dates = personTasks.flatMap(t => [new Date(t.start_date), new Date(t.end_date)]);
        const minDate = new Date(Math.min.apply(null, dates));
        const maxDate = new Date(Math.max.apply(null, dates));

        for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
          let dailyAllocation = 0;
          const contributingTasks = [];

          personTasks.forEach(task => {
            const taskStart = new Date(task.start_date);
            const taskEnd = new Date(task.end_date);
            if (d >= taskStart && d < taskEnd) {
              const assignment = (task.assignments || []).find(a => a.personId === person.id);
              if (assignment) {
                dailyAllocation += assignment.allocation;
                contributingTasks.push(task.id);
              }
            }
          });

          if (dailyAllocation > 100) {
            contributingTasks.forEach(id => overAllocatedTaskIds.add(id));
          }
        }
      });

      if (overAllocatedTaskIds.size > 0) {
        newTasksData.forEach(task => {
          if (overAllocatedTaskIds.has(task.id)) {
            task.isOverAllocated = true;
          }
        });
        setTasks(prevTasks => ({ ...prevTasks, data: newTasksData }));
      }
    };

    checkOverAllocations();
  }, [tasks.data, people]);


  const handleTaskUpdate = (id, task) => {
    const newTasks = tasks.data.map(t => (t.id === id ? { ...t, ...task } : t));
    setTasks({ ...tasks, data: newTasks });
  };

  const handleLinkAdd = (id, link) => {
    const newLinks = [...tasks.links, link];
    setTasks({ ...tasks, links: newLinks });
  };

  const handleLinkDelete = (id) => {
    const newLinks = tasks.links.filter(l => l.id !== id);
    setTasks({ ...tasks, links: newLinks });
  };

  const handleTaskAdd = (id, task) => {
    const newTasks = [...tasks.data, task];
    setTasks({ ...tasks, data: newTasks });
  };

  const handleTaskDelete = (id) => {
    const newTasks = tasks.data.filter(t => t.id !== id);
    const newLinks = tasks.links.filter(l => l.source !== id && l.target !== id);
    setTasks({ data: newTasks, links: newLinks });
  };

  const handleJsonExport = () => {
    const data = {
      projectName,
      people,
      tasks,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${projectName.replace(/\s+/g, '_')}.json`;
    link.click();
  };

  const handleJsonImport = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.projectName && data.people && data.tasks) {
          setProjectName(data.projectName);
          setPeople(data.people);
          setTasks(data.tasks);
        } else {
          alert('Invalid JSON file format.');
        }
      } catch (error) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDataCsvExport = () => {
    const csvData = tasks.data.map(task => ({
      id: task.id,
      parentId: task.parent || '',
      taskName: task.text,
      startDate: task.start_date,
      endDate: task.end_date,
      progress: task.progress,
      dependencies: task.dependencies || '',
      effort: task.effort || '',
      assignments: (task.assignments || []).map(a => `${a.personId}:${a.allocation}`).join(';'),
      notes: task.notes || '',
      hyperlink: task.hyperlink || ''
    }));

    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${projectName.replace(/\s+/g, '_')}_data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDataCsvImport = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const newTasksData = results.data.map(row => ({
            id: row.id,
            text: row.taskName,
            start_date: row.startDate,
            end_date: row.endDate,
            parent: row.parentId || null,
            progress: parseFloat(row.progress) || 0,
            dependencies: row.dependencies || null,
            effort: parseInt(row.effort, 10) || 0,
            assignments: (row.assignments || '').split(';').filter(Boolean).map(a => {
              const [personId, allocation] = a.split(':');
              return { personId, allocation: parseInt(allocation, 10) };
            }),
            notes: row.notes || '',
            hyperlink: row.hyperlink || ''
          }));
          if (newTasksData.length > 0 && newTasksData[0].id) {
            setTasks({ data: newTasksData, links: [] });
          } else {
            alert('Invalid CSV file format.');
          }
        } catch (error) {
          alert('Error processing CSV file.');
        }
      },
      error: () => {
        alert('Error parsing CSV file.');
      }
    });
  };

  const handleVisualCsvExport = () => {
    if (tasks.data.length === 0) {
      alert("No tasks to export.");
      return;
    }

    const dates = tasks.data.flatMap(t => [new Date(t.start_date), new Date(t.end_date)]);
    const minDate = new Date(Math.min.apply(null, dates));
    const maxDate = new Date(Math.max.apply(null, dates));

    const headers = ["Task Name", "Assignees"];
    let currentWeek = new Date(minDate);
    while (currentWeek <= maxDate) {
      headers.push(`Wk of ${currentWeek.toISOString().slice(0, 10)}`);
      currentWeek.setDate(currentWeek.getDate() + 7);
    }

    const peopleMap = new Map(people.map(p => [p.id, p.name]));
    const rows = tasks.data.map(task => {
      const row = { "Task Name": task.text, "Assignees": "" };

      const assignees = (task.assignments || []).map(a => peopleMap.get(a.personId) || a.personId).join(', ');
      row["Assignees"] = assignees;

      const taskStart = new Date(task.start_date);
      const taskEnd = new Date(task.end_date);

      let weekStart = new Date(minDate);
      while (weekStart <= maxDate) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const colName = `Wk of ${weekStart.toISOString().slice(0, 10)}`;

        if (taskStart < weekEnd && taskEnd > weekStart) {
          row[colName] = assignees;
        } else {
          row[colName] = "";
        }
        weekStart.setDate(weekStart.getDate() + 7);
      }
      return row;
    });

    const csvString = Papa.unparse(rows, { header: true });
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${projectName.replace(/\s+/g, '_')}_visual.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="app-container">
      <h1 className="title">{projectName}</h1>
      <Toolbar onJsonExport={handleJsonExport} onJsonImport={handleJsonImport} onDataCsvExport={handleDataCsvExport} onDataCsvImport={handleDataCsvImport} onVisualCsvExport={handleVisualCsvExport} />
      <div className="gantt-container">
        <Gantt
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onLinkAdd={handleLinkAdd}
          onLinkDelete={handleLinkDelete}
          onTaskAdd={handleTaskAdd}
          onTaskDelete={handleTaskDelete}
        />
      </div>
      <div className="bottom-container">
        <PeopleManager />
        <TaskEditor />
      </div>
    </div>
  );
};

export default App;
