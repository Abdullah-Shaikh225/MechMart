import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
    children: React.ReactNode;
    redirectTo?: string;
}

export const ProtectedRoute: React.FC<Props> = ({ children, redirectTo = '/register' }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};
