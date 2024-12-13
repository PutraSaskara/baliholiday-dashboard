import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const cookieStore = cookies();
  const auth = cookieStore.get('auth');

  if (!auth || auth.value !== 'true') {
    redirect('/login');
  }

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'GET',
    });
    redirect('/login');
  };

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '50px',
    textAlign: 'center',
  },
  logout: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
