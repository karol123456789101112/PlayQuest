import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PlatformListAdmin() {
  const [platforms, setPlatforms] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlatforms();
  }, [currentPage]);

  const fetchPlatforms = async () => {
    try {
      const res = await fetch(`http://localhost:8080/platforms?page=${currentPage}&size=${pageSize}`);
      const data = await res.json();

      setPlatforms(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching platforms:', err);
    }
  };

  const deletePlatform = async (id) => {
    if (!window.confirm('Do you want to delete this platform?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8080/platforms/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        fetchPlatforms(); // reload current page
      } else {
        alert('Error deleting platform.');
      }
    } catch (err) {
      console.error('Error while deleting:', err);
    }
  };

  return (
    <Box sx={{ mt: 4, px: 3 }}>
      <Typography variant="h5" gutterBottom>
        Platform list
      </Typography>

      <List>
        {platforms.map((plat) => (
          <React.Fragment key={plat.id}>
            <ListItem
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deletePlatform(plat.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/platforms/edit/${plat.id}`)}
                  >
                    Edit
                  </Button>
                </Box>
              }
            >
              <ListItemText primary={plat.name} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <Box display="flex" justifyContent="flex-start" mt={3} gap={2}>
        <Button
          variant="contained"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <Typography variant="body1" sx={{ alignSelf: 'center' }}>
          Page {currentPage + 1} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
