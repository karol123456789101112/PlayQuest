import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Stack, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function PlatformSelector() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch('http://localhost:8080/platforms/all');
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
            {t('choosePlatform')}
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
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mt: 3,
              }}
            >
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/games?platform=${encodeURIComponent(platform.name)}`}
                  sx={{
                    minWidth: 140,
                    padding: '14px 20px',
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}
                >
                  {t(`platforms.${platform.name}`, { defaultValue: platform.name })}
                </Button>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
