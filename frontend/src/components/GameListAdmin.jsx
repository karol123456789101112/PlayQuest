import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function GameListAdmin() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch('http://localhost:8080/games');
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error('Error while downloading games:', err);
    }
  };

  const deleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      const res = await fetch(`http://localhost:8080/games/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setGames(games.filter((g) => g.id !== id));
      } else {
        alert('Could not delete the game.');
      }
    } catch (err) {
      console.error('Error while deleting the game:', err);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
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
              <ListItemText primary={game.title} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
