/**
 * DueDateModal Component
 * ----------------------
 * A simple React component that opens a custom modal dialog when the user clicks "Set Due Date".
 * The user can select a date using a native HTML `<input type="date" />`.
 * On submission, the selected date is displayed via an alert.
 * Includes basic validation and allows closing the modal by clicking outside or using the close button.
 */

import React, { useState } from 'react';

const DueDateModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dueDate, setDueDate] = useState('');

  // Handle submit button click
  const handleSubmit = () => {
    if (dueDate) {
      // If a date is selected, show it and close the modal
      alert(`Due date set to: ${dueDate}`);
      setIsOpen(false);
    } else {
      // If no date selected, show warning
      alert('Please select a date.');
    }
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button onClick={() => setIsOpen(true)}>Set Due Date</button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          {/* Modal content */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
            
            {/* Modal title */}
            <h3>Select Due Date</h3>
            
            {/* Date input field */}
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <br /><br />

            {/* Submit button */}
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DueDateModal;
