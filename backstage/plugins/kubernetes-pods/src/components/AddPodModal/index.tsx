import React, { useState } from 'react';
import { Dialog, TextField, Button, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import axios from 'axios';

interface AddPodModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddPodModal: React.FC<AddPodModalProps> = ({ open, onClose }) => {
  const [podName, setPodName] = useState('');
  const [podImage, setPodImage] = useState('');

  const handleSubmit = async () => {
    try {
      const apiUrl = 'https://80AB2B34741CE110292A2383A0C8F899.yl4.us-east-1.eks.amazonaws.com/api/v1/namespaces/default/pods';

      const podSpec = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: {
          name: podName,
        },
        spec: {
          containers: [
            {
              name: podName,
              image: podImage,
            },
          ],
        },
      };

      const token = 'kubernetes-token';

      await axios.post(apiUrl, podSpec, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Pod created successfully!');
      onClose();
    } catch (error) {
      // Handle any errors during the pod creation
      console.error('Error creating pod:', error);
      alert('Failed to create pod.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Pod</DialogTitle>
      <DialogContent>
        <TextField
          label="Pod Name"
          value={podName}
          onChange={(e) => setPodName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Container Image"
          value={podImage}
          onChange={(e) => setPodImage(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Create Pod
        </Button>
      </DialogActions>
    </Dialog>
  );
};
