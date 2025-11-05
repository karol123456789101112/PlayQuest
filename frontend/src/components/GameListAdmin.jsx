import React, { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function GameListAdmin() {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const { t, i18n } = useTranslation();

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
      console.error(t('errorWhileDownloadingGames'), err);
    }
  };

  const deleteGame = async (id) => {
    if (!window.confirm(t('areYouSureYouWantToDeleteThatGame'))) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/games/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        fetchGames();
      } else {
        alert(t('couldNotDeleteTheGame'));
      }
    } catch (err) {
      console.error(t('ErrorWhileDeletingTheGame'), err);
    }
  };

  return (
    <Box sx={{ mt: 4, px: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('gameList')}
      </Typography>

      <List>
        {games.map((game) => (
          <React.Fragment key={game.id}>
            <ListItem
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" onClick={() => deleteGame(game.id)}>
                    {t('delete')}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/games/edit/${game.id}`)}
                  >
                    {t('edit')}
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
          {t('previousPage')}
        </Button>
        <Typography variant="body1" sx={{ alignSelf: 'center' }}>
          {t('page', { currentPage: currentPage + 1, totalPages: totalPages })}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage >= totalPages - 1}
        >
          {t('nextPage')}
        </Button>
      </Box>
    </Box>
  );
}
