import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendeeList.css';

function AttendeeList({ event, onClose, onEventChange }) {
  const [attendees, setAttendees] = useState([]);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [attendeeIdToDelete, setAttendeeIdToDelete] = useState(null);

  useEffect(() => {
    if (event) {
      fetchAttendees(event.eventId);
    }
  }, [event]);

  const fetchAttendees = (eventId) => {
    axios.get(`http://localhost:8082/events/${eventId}`)
      .then((response) => {
        setAttendees(response.data.attendees);
      })
      .catch((error) => {
        console.error('Error fetching attendees:', error);
      });
  };

  const handleDeleteAttendee = (attendeeId) => {
    setAttendeeIdToDelete(attendeeId);
    setShowPasswordInput(true);
  };

  const handleConfirmDeleteAttendee = () => {
    if (!password) {
      alert('Please enter the password.');
      return;
    }

    axios
      .delete(
        `http://localhost:8082/events/${event.eventId}/${password}/attendee/${attendeeIdToDelete}`
      )
      .then(() => {
        fetchAttendees(event.eventId);
        setShowPasswordInput(false);
        setPassword('');
        onEventChange(); // Notify parent component about the change
      })
      .catch((error) => {
        console.error('Error deleting attendee:', error);
        alert('Error deleting attendee. Please check the password and try again.');
      });
  };

  return (
    <div className="attendee-list-container">
      <div className="attendee-header">
        <h2>Attendees for Event: {event.eventName}</h2>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="attendee-list">
        {attendees.map((attendee) => (
          <div key={attendee.attendeeId} className="attendee-card">
            <div className="attendee-info">
              <h3>{attendee.name}</h3>
              <p>{attendee.email}</p>
            </div>
            <div className="attendee-actions">
              <button
                className="delete-btn"
                onClick={() => handleDeleteAttendee(attendee.attendeeId)}
              >
                Delete
              </button>
              {showPasswordInput && attendeeIdToDelete === attendee.attendeeId && (
                <div className="password-input-container">
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="confirm-btn"
                    onClick={handleConfirmDeleteAttendee}
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendeeList;
