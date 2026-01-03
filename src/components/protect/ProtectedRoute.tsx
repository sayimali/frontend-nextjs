import { useAuth } from '../contexts/AuthContext';
import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [loading, user, router]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
