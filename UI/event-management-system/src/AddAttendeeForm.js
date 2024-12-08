import React, { useState } from 'react';
import axios from 'axios';
import './addattendeeform.css';

function AddAttendeeForm({ eventId, onClose, onAttendeeAdded }) {
  const [attendeeData, setAttendeeData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendeeData({ ...attendeeData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!attendeeData.name || !attendeeData.email) {
      alert('Please provide both name and email.');
      return;
    }

    axios
      .post(`http://localhost:8082/events/${eventId}/attendees`, attendeeData)
      .then(() => {
        alert('Attendee added successfully!');
        onClose(); // Close the form
        onAttendeeAdded(); // Refresh the event list
      })
      .catch((error) => {
        console.error('Error adding attendee:', error);
        alert('Failed to add attendee. Please try again.');
      });
  };

  return (
    <div className="add-attendee-form">
      <h4>Add Attendee</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Attendee Name"
          value={attendeeData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Attendee Email"
          value={attendeeData.email}
          onChange={handleChange}
        />
        <div className="form-actions">
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAttendeeForm;
