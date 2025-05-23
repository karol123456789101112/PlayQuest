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
  CircularProgress,
} from '@mui/material';

const UserListAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error while downloading users:", error);
    }finally {
       setLoading(false);
       }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch(`http://localhost:8080/users/${id}`, {
        method: 'DELETE',
      });

      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error while deleting the user:", error);
    }
  };

  const toggleAdmin = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${id}/role`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();

      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === updatedUser.id ? updatedUser : user))
      );
    } catch (error) {
      console.error("Error while changing the role of the user:", error);
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Last name</strong></TableCell>
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
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        color={user.role == "ADMIN" ? "warning" : "primary"}
                        onClick={() => toggleAdmin(user.id)}
                        sx={{ mr: 1 }}
                      >
                        {user.role == "ADMIN" ? "Revoke admin" : "make admin"}
                      </Button>

                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No users
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  };

export default UserListAdmin;
