import React, { useState } from 'react';
import axios from 'axios';
import './eventtable.css';
import AddAttendeeForm from './AddAttendeeForm'; // Import AddAttendeeForm component

function EventTable({ events, onShowAttendees, setEvents, handleToggleEditForm }) {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [activeEventId, setActiveEventId] = useState(null);
  const [showAddAttendeeForm, setShowAddAttendeeForm] = useState(false); // State to control Add Attendee form visibility

  const handleDeleteClick = (eventId) => {
    setShowPasswordInput(true);
    setActiveEventId(eventId);
  };

  const handleDeleteEvent = () => {
    if (!password) {
      alert('Please enter the password.');
      return;
    }

    axios
      .delete(`http://localhost:8082/events/${activeEventId}/${password}`)
      .then(() => {
        // Refresh the event list after deletion
        axios
          .get('http://localhost:8082/events')
          .then((response) => setEvents(response.data))
          .catch((error) => console.error('Error fetching events:', error));

        setShowPasswordInput(false);
        setPassword('');
      })
      .catch((error) => {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please check the password and try again.');
      });
  };

  const handleAddAttendeeClick = (eventId) => {
    setActiveEventId(eventId);
    setShowAddAttendeeForm(true); // Show Add Attendee form for the selected event
  };

  const handleCloseAddAttendeeForm = () => {
    setShowAddAttendeeForm(false); // Hide the form
    setActiveEventId(null); // Reset active event
  };

  const refreshEvents = () => {
    axios
      .get('http://localhost:8082/events')
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error fetching events:', error));
  };

  return (
    <div className="event-cards">
      {events.map((event) => (
        <div key={event.eventId} className="event-card">
          <h3>{event.eventName}</h3>
          <p><strong>Address:</strong> {event.eventAddress}</p>
          <p><strong>Time:</strong> {new Date(event.eventTime * 1000).toLocaleString()}</p>
          <p><strong>Owner:</strong> {event.ownerName}</p>
          <div className="event-actions">
            <button onClick={() => onShowAttendees(event)}>View Attendees</button>
            <button onClick={() => handleToggleEditForm(event)}>Edit</button>
            <button onClick={() => handleDeleteClick(event.eventId)}>Delete</button>
            <button onClick={() => handleAddAttendeeClick(event.eventId)}>Add Attendee</button>
          </div>
          {showPasswordInput && activeEventId === event.eventId && (
            <div className="password-input-container">
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleDeleteEvent}>Confirm Delete</button>
            </div>
          )}
          {/* Show Add Attendee form for this event */}
          {showAddAttendeeForm && activeEventId === event.eventId && (
            <AddAttendeeForm
              eventId={event.eventId}
              onClose={handleCloseAddAttendeeForm}
              onAttendeeAdded={refreshEvents}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default EventTable;
