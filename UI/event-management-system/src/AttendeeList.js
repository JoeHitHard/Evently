import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendeeList.css';
import AddAttendeeForm from './AddAttendeeForm';

function AttendeeList({ event, onClose }) {
  const [attendees, setAttendees] = useState([]);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchAttendees = (eventId) => {
    axios
      .get(`http://localhost:8082/events/${eventId}`)
      .then((response) => setAttendees(response.data.attendees))
      .catch((error) => console.error('Error fetching attendees:', error));
  };

  useEffect(() => {
    if (event) {
      fetchAttendees(event.eventId);
    }
  }, [event]);

  const handleDelete = async (attendeeId) => {
    const password = prompt('Please enter the password to delete this attendee:');
    if (!password) {
      alert('Deletion canceled.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this attendee?')) {
      try {
        const url = `http://localhost:8082/events/${event.eventId}/${password}/attendee/${attendeeId}`;
        await axios.delete(url);
        alert('Attendee deleted successfully.');
        fetchAttendees(event.eventId);
      } catch (error) {
        console.error('Error deleting attendee:', error);
        alert('Failed to delete attendee. Please check the password and try again.');
      }
    }
  };

  const openForm = (attendee = null) => {
    setSelectedAttendee(attendee);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedAttendee(null);
    setIsFormOpen(false);
    fetchAttendees(event.eventId);
  };

  return (
    <div className="attendee-list">
      <div className="header">
        <h2>Attendees for {event.eventName}</h2>
        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
      <button onClick={() => openForm()} className="add-btn">
        Add Attendee
      </button>
      <div className="list">
        {attendees.length ? (
          attendees.map((attendee) => (
            <div key={attendee.attendeeId} className="attendee-card">
              <div className="info">
                <h3>{attendee.name}</h3>
                <p>{attendee.email}</p>
              </div>
              <div className="actions">
                <button onClick={() => openForm(attendee)}>Edit</button>
                <button onClick={() => handleDelete(attendee.attendeeId)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No attendees found.</p>
        )}
      </div>
      {isFormOpen && (
        <AddAttendeeForm
          eventId={event.eventId}
          attendeeData={selectedAttendee}
          onClose={closeForm}
          refreshAttendees={fetchAttendees}
        />
      )}
    </div>
  );
}

export default AttendeeList;
