import React, { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function CategoryListAdmin() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
      console.error(t('failedToFetchCategories') + ':', err);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm(t('doYouWantToDeleteThisCategory'))) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8080/categories/delete/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'DELETE',
    });

    if (res.ok) {
      fetchCategories(currentPage);
    }
  };

  return (
      <Box sx={{ mt: 4, px: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('categoryList')}
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
                      {t('delete')}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/categories/edit/${cat.id}`)}
                    >
                      {t('edit')}
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
