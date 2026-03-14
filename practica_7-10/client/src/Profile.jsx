import React from 'react';
import { useAuth } from './context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div style={{maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: '#f8f9fa', borderRadius: '12px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h1 style={{margin: 0}}>Профиль пользователя</h1>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
                <strong>Id: </strong> {user.id}
            </div>
            <div style={{marginBottom: '1.5rem'}}>
                <strong>email: </strong> {user.email}
            </div>
            <div style={{marginBottom: '1.5rem'}}>
                <strong>Имя: </strong> {user.first_name || '-'}
            </div>
            <div style={{marginBottom: '1.5rem'}}>
                <strong>Фамилия: </strong> {user.last_name || '-'}
            </div>

            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                <button
                    onClick={logout}
                    style={{
                        padding: '0.8rem 1.6rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        flex: 1,
                        maxWidth: '200px'
                    }}
                >
                    Выйти из аккаунта
                </button>
                <Link
                    to='/'
                    style={{
                        padding: '0.6rem 1.2rem',
                        background: '#6c757d',
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                    }}
                >
                    На Главную
                </Link>
            </div>
        </div>
    );
}

export default Profile;