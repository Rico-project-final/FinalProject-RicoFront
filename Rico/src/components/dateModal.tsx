import React, { useState } from 'react';

const DueDateModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (dueDate) {
      alert(`Due date set to: ${dueDate}`);
      setIsOpen(false);
    } else {
      alert('Please select a date.');
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Set Due Date</button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
            <h3>Select Due Date</h3>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <br /><br />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DueDateModal;
