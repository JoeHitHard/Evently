import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addattendeeform.css';

function AddAttendeeForm({ eventId, attendeeData, onClose, refreshAttendees }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (attendeeData) {
      setFormData({ name: attendeeData.name, email: attendeeData.email });
    }
  }, [attendeeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in both name and email.');
      return;
    }

    try {
      const url = attendeeData
        ? `http://localhost:8081/attendees/${attendeeData.attendeeId}`
        : `http://localhost:8081/attendees/${eventId}`;
      const method = attendeeData ? axios.put : axios.post;
      await method(url, formData);
      alert(`Attendee ${attendeeData ? 'updated' : 'added'} successfully.`);
      refreshAttendees(eventId);
      onClose();
    } catch (error) {
      console.error('Error during operation:', error);
      alert('Failed to complete the operation. Please try again.');
    }
  };

  return (
    <div className="add-attendee-form">
      <h3>{attendeeData ? 'Edit Attendee' : 'Add Attendee'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <div className="form-buttons">
          <button type="submit">{attendeeData ? 'Save Changes' : 'Add Attendee'}</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAttendeeForm;
