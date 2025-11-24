import { Alert, Snackbar } from '@mui/material';
import { createContext, useCallback, useContext, useState } from 'react'

const NotificationContext = createContext()

export const useNotification = () => useContext(NotificationContext)

export default function NotificationProvider({ children }) {
    const [snack, setSnack] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const showSnack = useCallback((message, severity = "info") => {
        setSnack({ open: true, message, severity });
    }, []);

    const handleClose = () => {
        setSnack((prev) => ({ ...prev, open: false }));
    };

    return (
        <NotificationContext value={{ showSnack }}>
            {children}
            <Snackbar
                open={snack.open}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: 'center' }}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={snack.severity} variant='filled'>
                    {snack.message}
                </Alert>
            </Snackbar>
        </NotificationContext>
    )
}
