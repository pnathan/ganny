import React, { useRef, useEffect } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

const Gantt = ({
  tasks,
  onTaskUpdate,
  onLinkAdd,
  onLinkDelete,
  onTaskAdd,
  onTaskDelete,
}) => {
  const ganttContainer = useRef(null);

  useEffect(() => {
    if (ganttContainer.current) {
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
      ];

      return () => {
        events.forEach(eventId => gantt.detachEvent(eventId));
      };
    }
  }, [onTaskUpdate, onLinkAdd, onLinkDelete, onTaskAdd, onTaskDelete]);

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
