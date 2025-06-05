import React, { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CategoryListAdmin() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const fetchCategories = async (page) => {
    try {
      const res = await fetch(`http://localhost:8080/categories?page=${page}&size=10`);
      const data = await res.json();
      setCategories(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Do you want to delete this category?')) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8080/categories/delete/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'DELETE',
    });

    if (res.ok) {
      // refetch current page after deletion
      fetchCategories(currentPage);
    }
  };

  return (
      <Box sx={{ mt: 4, px: 3 }}>
        <Typography variant="h5" gutterBottom>
          Category list
        </Typography>

        <List>
          {categories.map((cat) => (
            <React.Fragment key={cat.id}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteCategory(cat.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
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
