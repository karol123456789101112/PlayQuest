import React, { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function GameListAdmin() {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, [currentPage]);

  const fetchGames = async () => {
    try {
      const res = await fetch(`http://localhost:8080/games?page=${currentPage}&size=${pageSize}`);
      const data = await res.json();
      setGames(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Error while downloading games:', err);
    }
  };

  const deleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/games/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        fetchGames();
      } else {
        alert('Could not delete the game.');
      }
    } catch (err) {
      console.error('Error while deleting the game:', err);
    }
  };

  return (
    <Box sx={{ mt: 4, px: 3 }}>
      <Typography variant="h5" gutterBottom>
        Game list
      </Typography>

      <List>
        {games.map((game) => (
          <React.Fragment key={game.id}>
            <ListItem
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" onClick={() => deleteGame(game.id)}>
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/games/edit/${game.id}`)}
                  >
                    Edit
                  </Button>
                </Box>
              }
            >
              <ListItemText
                primary={game.title}
                secondary={game.stockQuantity === 0 ? 'Archived (Stock = 0)' : null}
              />
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
