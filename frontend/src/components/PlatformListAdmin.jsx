import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PlatformListAdmin() {
  const [platforms, setPlatforms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/platforms')
      .then(res => res.json())
      .then(data => setPlatforms(data));
  }, []);

  const deletePlatform = async (id) => {
    if (!window.confirm('Do you want to delete this category?')) return;

    const res = await fetch(`http://localhost:8080/platforms/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setPlatforms(platforms.filter((cat) => cat.id !== id));
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Platforms</Typography>
      <List>
        {platforms.map((cat) => (
          <React.Fragment key={cat.id}>
            <ListItem
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" onClick={() => deletePlatform(cat.id)}>
                    Delete
                  </Button>
                  <Button variant="outlined"
                    onClick={() => navigate(`/platforms/edit/${cat.id}`)}
                   >
                    Edit
                   </Button>
                </Box>
              }
            >
              <ListItemText primary={cat.name} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
