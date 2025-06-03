import React, { useEffect } from 'react';
import { Dialog, Box, Typography, Button } from '@mui/material';

interface DueDateModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (dueDate: string) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
  title?: string;
}

const DueDateModal: React.FC<DueDateModalProps> = ({
  open,
  onClose,
  onConfirm,
  dueDate,
  setDueDate,
  title = 'Select Due Date',
}) => {
  useEffect(() => {
    if (open && !dueDate) {
      const today = new Date().toISOString().split('T')[0];
      setDueDate(today);
    }
  }, [open, dueDate, setDueDate]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 3, minWidth: 300 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <input
          type="date"
          value={dueDate}
          min={todayStr}
          onChange={(e) => setDueDate(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            marginBottom: '16px',
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => onConfirm(dueDate)}
            disabled={!dueDate}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DueDateModal;
