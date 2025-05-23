import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Stack, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

export default function PlatformSelector() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch('http://localhost:8080/platforms');
        const data = await response.json();
        setPlatforms(data);
      } catch (err) {
        console.error('Error while downloading platforms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  return (
    <Box
      sx={{
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#111',
        paddingY: 4,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1400px', paddingX: 2 }}>
        <Paper elevation={6} sx={{ padding: 4, backgroundColor: '#111' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#fff', textAlign: 'center' }}>
            Choose your platform
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 20px',
                flexWrap: 'wrap',
              }}
            >
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/games?platform=${encodeURIComponent(platform.name)}`}
                  sx={{ flexGrow: 1, padding: '16px', minWidth: 120 }}
                >
                  {platform.name}
                </Button>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
