import {useState} from "react";
import Modal from 'react-modal';

Modal.setAppElement('#root');

// функция регистрации
function Registration({ register, isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [error, Error] = useState(null);
    
    const storeToken = (token) => {
        try {
            localStorage.setItem('authToken', token);
        }
        catch (e) {
            Error('Ошибка сохранеия токена' + e.message);
        }
    };

    const handleRegistr = async () => {
        Error(null);
        try {
            const responce = await fetch('http://localhost:5000/authentication/registration', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    password,
                }),
            });

            if (responce.ok) {
                const data = await responce.json();
                if (data.token) {
                    storeToken(data.token);
                }
                if (register) register(data);
                onClose();
            }
            else {
                let errorData;
                try {
                    errorData = await responce.json();
                }
                catch {
                    errorData = {error: `Сервер вернул статус ${responce.status}`};
                }
                Error(errorData.error || `Ошибка регистрации (${responce.status})`);
            }
        }
        catch (e) {
            Error('Сетевая ошибка: ' + e.message);
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
                    <input type="text" placeholder="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
                </div>
                <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.4rem'}}>Фамилия</label>
                    <input type="text" placeholder="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
                </div>
                <div style={{marginBottom: '1.5rem'}}>
                    <label style={{display: 'block', marginBottom: '0.4rem'}}>Пароль</label>
                    <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
                    <button type="button" onClick={onClose} style={{flex: 1, padding: '0.8rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer',}}>
                        Отмена
                    </button>
                    <button type="submit" style={{flex: 1, padding: '0.8rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>
                        Зарегистрироваться
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default Registration;