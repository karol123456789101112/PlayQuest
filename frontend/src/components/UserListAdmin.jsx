import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';

const UserListAdmin = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/users?page=${currentPage}&size=${pageSize}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error(t('errorWhileDownloadingUsers') + ': ', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm(t('areYouSureYouWantToDeleteThisUser'))) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers(prev => prev.filter(user => user.id !== id));
      } else {
        alert(t('couldNotDeleteTheUser'));
      }
    } catch (err) {
      console.error(t('errorWhileDeletingUser') + ': ', err);
    }
  };

  const toggleAdmin = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      }
    } catch (err) {
      console.error(t('errorWhileChangingUserRole') + ':', err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {t('listOfUsers')}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>{t('firstName')}</strong></TableCell>
                  <TableCell><strong>{t('lastName')}</strong></TableCell>
                  <TableCell><strong>{t('actions')}</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => deleteUser(user.id)}
                        sx={{ mr: 1 }}
                      >
                        {t('delete')}
                      </Button>
                      <Button
                        variant="outlined"
                        color={user.role === 'ADMIN' ? 'warning' : 'primary'}
                        onClick={() => toggleAdmin(user.id)}
                      >
                        {user.role === 'ADMIN' ? t('revokeAdmin') : t('makeAdmin')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">{t('noUsersFound')}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="flex-start" mt={3} gap={2}>
            <Button
              variant="contained"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              {t('previousPage')}
            </Button>
            <Typography variant="body1" sx={{ alignSelf: 'center' }}>
              {t('page', { currentPage: currentPage + 1, totalPages: totalPages })}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
            >
              {t('nextPage')}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserListAdmin;
