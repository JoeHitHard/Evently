import React, { useState, useEffect } from 'react';
import './createeventform.css';

function CreateEventForm({ eventData, onCreateEvent, onClose }) {
  const [formData, setFormData] = useState({
    eventName: '',
    eventAddress: '',
    eventTime: '',
    ownerName: '',
    ownerEmail: '',
    password: '',
  });

  useEffect(() => {
    if (eventData) {
      setFormData({
        eventName: eventData.eventName,
        eventAddress: eventData.eventAddress,
        eventTime: eventData.eventTime,
        ownerName: eventData.ownerName,
        ownerEmail: eventData.ownerEmail,
        password: '', // Clear password when editing
      });
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateEvent(formData);
  };

  return (
    <div className="form-container">
      <h2>{eventData ? 'Edit Event' : 'Create Event'}</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
            required
          />
        </div>
        <div className="form-group">
          <label>Event Address</label>
          <input
            type="text"
            name="eventAddress"
            value={formData.eventAddress}
            onChange={handleChange}
            placeholder="Enter event address"
            required
          />
        </div>
        <div className="form-group">
          <label>Event Time</label>
          <input
            type="datetime-local"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="Enter owner name"
            required
          />
        </div>
        <div className="form-group">
          <label>Owner Email</label>
          <input
            type="email"
            name="ownerEmail"
            value={formData.ownerEmail}
            onChange={handleChange}
            placeholder="Enter owner email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required={!eventData} // Password is required only for new events
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {eventData ? 'Save Changes' : 'Create Event'}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEventForm;
