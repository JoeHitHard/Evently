import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './eventlist.css';
import CreateEventForm from './CreateEventForm';
import AttendeeList from './AttendeeList';

function EventList() {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get('http://localhost:8082/events')
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error fetching events:', error));
  };

  const handleToggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateEvent = (eventData) => {
    eventData.eventTime = new Date(eventData.eventTime).getTime() / 1000;
    axios
      .post('http://localhost:8082/events', eventData)
      .then(() => {
        fetchEvents();
        setShowCreateForm(false);
      })
      .catch((error) => console.error('Error creating event:', error));
  };

  const handleToggleEditForm = (event) => {
    setShowEditForm(true);
    event.eventTime = new Date(event.eventTime * 1000).toISOString().slice(0, 16);
    setActiveEvent(event);
  };

  const handleEditEvent = (eventData) => {
    eventData.eventTime = new Date(eventData.eventTime).getTime() / 1000;
    axios
      .put(`http://localhost:8082/events/${activeEvent.eventId}`, eventData)
      .then(() => {
        fetchEvents();
        setShowEditForm(false);
      })
      .catch((error) => console.error('Error editing event:', error));
  };

  const handleDeleteEvent = async (eventId) => {
    const password = prompt('Please enter the password to delete this event:');
    if (!password) {
      alert('Deletion canceled.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const url = `http://localhost:8082/events/${eventId}/${password}`;
        await axios.delete(url);
        alert('Event deleted successfully.');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please check the password and try again.');
      }
    }
  };

  const handleShowAttendees = (event) => {
    setSelectedEvent(event);
    setShowAttendees(true);
  };

  const handleCloseAttendees = () => {
    setShowAttendees(false);
  };

  return (
    <div className="eventlist-container">
      <h1>Evently</h1>
      <button className="create-event-btn" onClick={handleToggleCreateForm}>
        {showCreateForm ? 'Close Form' : 'Create Event'}
      </button>

      {showCreateForm && (
        <CreateEventForm onCreateEvent={handleCreateEvent} onClose={handleToggleCreateForm} />
      )}

      <div className="event-cards">
        {events.map((event) => (
          <div key={event.eventId} className="event-card">
            <h3>{event.eventName}</h3>
            <p><strong>Address:</strong> {event.eventAddress}</p>
            <p><strong>Time:</strong> {new Date(event.eventTime * 1000).toLocaleString()}</p>
            <p><strong>Owner:</strong> {event.ownerName}</p>
            <div className="event-actions">
              <button onClick={() => handleShowAttendees(event)}>View Attendees</button>
              <button onClick={() => handleToggleEditForm(event)}>Edit</button>
              <button onClick={() => handleDeleteEvent(event.eventId)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showEditForm && (
        <CreateEventForm
          eventData={activeEvent}
          onCreateEvent={handleEditEvent}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {showAttendees && (
        <AttendeeList
          event={selectedEvent}
          onClose={handleCloseAttendees}
          onEventChange={fetchEvents}
        />
      )}
    </div>
  );
}

export default EventList;
