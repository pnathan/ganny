import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import AssignmentsEditor from './AssignmentsEditor';

const Gantt = ({
  tasks,
  people,
  onTaskUpdate,
  onLinkAdd,
  onLinkDelete,
  onTaskAdd,
  onTaskDelete,
}) => {
  const ganttContainer = useRef(null);
  const assignmentsEditorRoot = useRef(null);

  useEffect(() => {
    if (ganttContainer.current) {
      // --- Custom Assignments Editor ---
      let assignmentsState = [];
      gantt.form_blocks['assignments_editor'] = {
        render: function (sns) {
          return '<div id="assignments-editor-container" style="height: 100%; width: 100%;"></div>';
        },
        set_value: function (value, id, task) {
          const container = document.getElementById('assignments-editor-container');
          if (container) {
            if (!assignmentsEditorRoot.current) {
                assignmentsEditorRoot.current = createRoot(container);
            }
            assignmentsState = task.assignments || [];
            assignmentsEditorRoot.current.render(
              <AssignmentsEditor
                people={people}
                assignments={assignmentsState}
                onAssignmentsChange={(newAssignments) => {
                  assignmentsState = newAssignments;
                }}
              />
            );
          }
        },
        get_value: function (id, task) {
          return assignmentsState;
        },
        focus: function (id) {}
      };

      gantt.config.date_format = "%Y-%m-%d";

      gantt.config.lightbox.sections = [
        { name: "description", height: 70, type: "textarea", map_to: "text", focus: true },
        { name: "assignments", height: 200, type: "assignments_editor", map_to: "assignments" },
        { name: "time", type: "duration", map_to: "auto" },
        { name: "progress", type: "select", map_to: "progress", options: [
            { key: 0, label: '0%' }, { key: 0.1, label: '10%' }, { key: 0.2, label: '20%' },
            { key: 0.3, label: '30%' }, { key: 0.4, label: '40%' }, { key: 0.5, label: '50%' },
            { key: 0.6, label: '60%' }, { key: 0.7, label: '70%' }, { key: 0.8, label: '80%' },
            { key: 0.9, label: '90%' }, { key: 1, label: '100%' }
        ]},
        { name: "effort", type: "text", map_to: "effort" },
        { name: "notes", type: "textarea", map_to: "notes" },
        { name: "hyperlink", type: "text", map_to: "hyperlink" }
      ];

      gantt.init(ganttContainer.current);

      gantt.templates.task_class = (start, end, task) => {
        if (task.isOverAllocated) {
          return 'overallocated-task';
        }
        return '';
      };

      const events = [
        gantt.attachEvent('onAfterTaskUpdate', (id, task) => onTaskUpdate(id, task)),
        gantt.attachEvent('onAfterLinkAdd', (id, link) => onLinkAdd(id, link)),
        gantt.attachEvent('onAfterLinkDelete', (id) => onLinkDelete(id)),
        gantt.attachEvent('onAfterTaskAdd', (id, task) => onTaskAdd(id, task)),
        gantt.attachEvent('onAfterTaskDelete', (id) => onTaskDelete(id)),
        gantt.attachEvent('onBeforeTaskChanged', (id, mode, task) => {
          console.log('Understanding the error as in the console.log: start_date type is', typeof task.start_date, 'value is', task.start_date);
          const duration = gantt.calculateDuration(task.start_date, task.end_date);
          if (duration < 0.1) {
            task.end_date = gantt.calculateEndDate(task.start_date, 0.1);
          }
          return true;
        }),
        gantt.attachEvent('onLinkDblClick', (id) => {
          if (confirm('Are you sure you want to delete this dependency?')) {
            gantt.deleteLink(id);
          }
          return false; // To prevent the default action
        }),
        gantt.attachEvent('onBeforeLightbox', (id) => {
          const task = gantt.getTask(id);
          if (task.$new) {
            task.start_date = new Date();
          }
          return true;
        }),
        gantt.attachEvent('onAfterLightbox', () => {
            if (assignmentsEditorRoot.current) {
                assignmentsEditorRoot.current.unmount();
                assignmentsEditorRoot.current = null;
            }
        })
      ];

      return () => {
        events.forEach(eventId => gantt.detachEvent(eventId));
        if (assignmentsEditorRoot.current) {
            assignmentsEditorRoot.current.unmount();
            assignmentsEditorRoot.current = null;
        }
      };
    }
  }, [people, onTaskUpdate, onLinkAdd, onLinkDelete, onTaskAdd, onTaskDelete]);

  useEffect(() => {
    if (ganttContainer.current && tasks) {
      gantt.clearAll();
      gantt.parse(tasks);
    }
  }, [tasks]);

  return (
    <div
      ref={ganttContainer}
      style={{ width: '100%', height: '100%' }}
    ></div>
  );
};

export default Gantt;
