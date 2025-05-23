import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#000',
        },
        primary: {
            main: '#6495ED', // login button
        },
        secondary: {
            main: '#6a5acd', // register button
        },
        text: {
            primary: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif',
        h2: {
            fontWeight: 300,
            letterSpacing: '2px',
            fontSize: '3.5rem',
        },
        button: {
            fontSize: '1.125rem',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '14px 28px',
                    transition: 'transform 0.2s, box-shadow 0.3s',
                    '&:hover': {
                        boxShadow: '0 4px 10px rgba(255, 255, 255, 0.1)',
                    },
                },
            },
        },
    },
});

export default theme;
