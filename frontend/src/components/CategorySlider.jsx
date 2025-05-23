import React, { useEffect, useState } from 'react';
import { Box, Chip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8080/categories');
        setCategories(await res.json());
      } catch (e) { console.error(e); }
      finally     { setLoading(false); }
    })();
  }, []);

  if (loading) return <Box sx={{ p:4, textAlign:'center' }}><CircularProgress/></Box>;

  return (
    <Box sx={{ display:'flex', overflowX:'auto', gap:2, p:2, bgcolor:'#1a1a1a' }}>
      {categories.map(cat => (
        <Chip
          key={cat.id}
          label={cat.name}
          clickable
          onClick={() => navigate(`/games?category=${encodeURIComponent(cat.name)}`)} // ⬅️
          color="primary"
          variant="outlined"
          sx={{ minWidth:100, minHeight:44, fontWeight:'bold', flexShrink:0 }}
        />
      ))}
    </Box>
  );
}
