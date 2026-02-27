import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
    children: React.ReactNode;
}

export const AdminRoute: React.FC<Props> = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h1>403 — Access Denied</h1>
                <p style={{ marginTop: '16px', color: '#666' }}>
                    Only administrators can access this page.
                </p>
            </div>
        );
    }

    return <>{children}</>;
};
