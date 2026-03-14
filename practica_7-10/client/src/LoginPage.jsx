import React, { useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from './context/AuthContext';
import api from './api';

Modal.setAppElement('#root');

// функция входа
function Login({ isOpen, onClose }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/authentication/login', {
                email,
                password,
            });

            const data = response.data;

            login(data.accessToken, data.refreshToken, {
                id: data.id || data.user?.id,
                email: data.email || data.user?.email,
                first_name: data.first_name || data.user?.first_name,
                last_name: data.last_name || data.user?.last_name
            });

            onClose();
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'Ошибка входа';
            setError(errorMsg);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.65)', 
                    zIndex: 1000,
                }, 
                content: {
                    top: '50%', 
                    left: '50%', 
                    right: 'auto', 
                    bottom: 'auto', 
                    marginRight: '-50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: '90%', 
                    maxWidth: '400px', 
                    padding: '2rem', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                },
            }}
        >
                <h2 style={{margin: '0 0 1.5rem 0', textAlign: 'center'}}>Вход в аккаунт</h2>

                {error && (
                    <p style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{error}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.2rem'}}>
                        <label style={{display: 'block', marginBottom: '0.4rem', fontWeight: 500}}>
                            Email
                        </label>
                        <input 
                            type="email"
                            placeholder='Введите email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <div style={{marginBottom: '1.5rem'}}>
                        <label style={{display: 'block', marginBottom: '0.4rem', fontWeight: 500}}>
                            Пароль
                        </label>
                        <input 
                            type='password'
                            placeholder='введите пароль'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                        <button type='button' onClick={onClose} disabled={loading} style={{flex: 1, padding: '0.8rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer',}}>
                            Отмена
                        </button>
                        <button type='submit' disabled={loading} style={{flex: 1, padding: '0.8rem', background: loading ? '#6c757d' : '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer',}}>
                            {loading ? 'Вход...' : 'Войти'}
                        </button>
                    </div>
                </form>
        </Modal>
    );
}

export default Login;