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

const UserListAdmin = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

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
      console.error("Error while downloading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers(prev => prev.filter(user => user.id !== id));
      } else {
        alert("Could not delete the user");
      }
    } catch (err) {
      console.error("Error while deleting user:", err);
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
      console.error("Error while changing user role:", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        List of Users
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
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Last Name</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
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
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        color={user.role === 'ADMIN' ? 'warning' : 'primary'}
                        onClick={() => toggleAdmin(user.id)}
                      >
                        {user.role === 'ADMIN' ? 'Revoke Admin' : 'Make Admin'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No users found.</TableCell>
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
              Previous
            </Button>
            <Typography variant="body1" sx={{ alignSelf: 'center' }}>
              Page {currentPage + 1} of {totalPages}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserListAdmin;
