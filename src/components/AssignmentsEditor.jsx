import React, { useState, useEffect } from 'react';

const AssignmentsEditor = ({ people, assignments, onAssignmentsChange }) => {
  const [currentAssignments, setCurrentAssignments] = useState(assignments || []);

  useEffect(() => {
    onAssignmentsChange(currentAssignments);
  }, [currentAssignments, onAssignmentsChange]);

  const handleAllocationChange = (personId, allocation) => {
    const newAllocation = parseInt(allocation, 10);
    if (isNaN(newAllocation)) return;

    const existing = currentAssignments.find(a => a.personId === personId);
    if (existing) {
      setCurrentAssignments(
        currentAssignments.map(a =>
          a.personId === personId ? { ...a, allocation: newAllocation } : a
        )
      );
    }
  };

  const handlePersonToggle = (personId, checked) => {
    if (checked) {
      setCurrentAssignments([...currentAssignments, { personId, allocation: 100 }]);
    } else {
      setCurrentAssignments(currentAssignments.filter(a => a.personId !== personId));
    }
  };

  return (
    <div className="assignments-editor">
      {people.map(person => {
        const assignment = currentAssignments.find(a => a.personId === person.id);
        const isAssigned = !!assignment;

        return (
          <div key={person.id} className="assignment-row">
            <label>
              <input
                type="checkbox"
                checked={isAssigned}
                onChange={(e) => handlePersonToggle(person.id, e.target.checked)}
              />
              {person.name}
            </label>
            {isAssigned && (
              <input
                type="number"
                value={assignment.allocation}
                onChange={(e) => handleAllocationChange(person.id, e.target.value)}
                min="0"
                max="100"
                step="10"
                style={{ width: '60px', marginLeft: '10px' }}
              />
            )}
            {isAssigned && <span>%</span>}
          </div>
        );
      })}
    </div>
  );
};

export default AssignmentsEditor;
