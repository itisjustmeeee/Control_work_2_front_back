import {useState} from "react";
import Modal from 'react-modal';
import { useAuth } from './context/AuthContext';
import api from "./api";

Modal.setAppElement('#root');

// функция регистрации
function Registration({ isOpen, onClose }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [first_name, set_first_name] = useState('');
    const [last_name, set_last_name] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const handleRegistr = async () => {
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/authentication/registration', {
                email,
                first_name,
                last_name,
                password,
            });

            const data = response.data;

            if (response.ok) {
                if (data.accessToken && data.refreshToken) {
                    login(data.accessToken, data.refreshToken, {
                        id: data.id || data.user?.id,
                        email: data.email || data.user?.email,
                        first_name: data.first_name || data.user?.first_name,
                        last_name: data.last_name || data.user?.last_name
                    });
                }
                onClose();
            } else {
                Error(data.error ||  `Ошибка регистрации (${response.status})`);
            }
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'Сетевая ошибка';
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
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
                    maxWidth: '420px',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                },
            }}
        >
                <h2 style={{margin: '0 0 1.5 rem 0', textAlign: 'Center'}}>Регистрация</h2>

                {error && <p style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{error}</p>}

                <form onSubmit={(e) => {e.preventDefault(); handleRegistr();}}>
                    <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', marginBottom: '0.4rem'}}>Почта</label>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}/>
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', marginBottom: '0.4rem'}}>Имя</label>
                        <input type="text" placeholder="Имя" value={first_name} onChange={(e) => set_first_name(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', marginBottom: '0.4rem'}}>Фамилия</label>
                        <input type="text" placeholder="Фамилия" value={last_name} onChange={(e) => set_last_name(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
                    </div>
                    <div style={{marginBottom: '1.5rem'}}>
                        <label style={{display: 'block', marginBottom: '0.4rem'}}>Пароль</label>
                        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
                        <button type="button" onClick={onClose} disabled={loading} style={{flex: 1, padding: '0.8rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer',}}>
                            Отмена
                        </button>
                        <button type="submit" disabled={loading} style={{flex: 1, padding: '0.8rem', background: loading ? '#6c757d' : '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer'}}>
                            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>
                    </div>
                </form>
        </Modal>
    );
}

export default Registration;