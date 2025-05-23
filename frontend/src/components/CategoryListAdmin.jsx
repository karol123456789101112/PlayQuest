import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CategoryListAdmin() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const deleteCategory = async (id) => {
    if (!window.confirm('Usunąć kategorię?')) return;

    const res = await fetch(`http://localhost:8080/categories/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Categories</Typography>
      <List>
        {categories.map((cat) => (
          <React.Fragment key={cat.id}>
            <ListItem
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" onClick={() => deleteCategory(cat.id)}>
                    Delete
                  </Button>
                  <Button variant="outlined"
                   onClick={() => navigate(`/categories/edit/${cat.id}`)}
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
