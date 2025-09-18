import React, { useState } from 'react';
import './PeopleManager.css';

const PeopleManager = ({ people, onPersonAdd, onPersonUpdate, onPersonDelete }) => {
  const [newPersonName, setNewPersonName] = useState('');
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [editingPersonName, setEditingPersonName] = useState('');

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      onPersonAdd({
        id: `p${Date.now()}`, // Simple unique ID generation
        name: newPersonName.trim(),
      });
      setNewPersonName('');
    }
  };

  const handleEditClick = (person) => {
    setEditingPersonId(person.id);
    setEditingPersonName(person.name);
  };

  const handleSaveClick = (id) => {
    onPersonUpdate(id, { id, name: editingPersonName });
    setEditingPersonId(null);
    setEditingPersonName('');
  };

  return (
    <div className="people-manager">
      <h2>People Manager</h2>
      <ul className="people-list">
        {people.map(person => (
          <li key={person.id}>
            {editingPersonId === person.id ? (
              <input
                type="text"
                value={editingPersonName}
                onChange={(e) => setEditingPersonName(e.target.value)}
              />
            ) : (
              <span>{person.name}</span>
            )}
            <div className="person-buttons">
              {editingPersonId === person.id ? (
                <button onClick={() => handleSaveClick(person.id)}>Save</button>
              ) : (
                <button onClick={() => handleEditClick(person)}>Edit</button>
              )}
              <button onClick={() => onPersonDelete(person.id)} className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddPerson} className="add-person-form">
        <input
          type="text"
          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}
          placeholder="New person's name"
        />
        <button type="submit">Add Person</button>
      </form>
    </div>
  );
};

export default PeopleManager;
