import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import styles from './styles/ProductCard.module.scss';
import UserCard from './UserDetail';
import api from './api';
import {useAuth, user, users} from './context/AuthContext';

function UsersList() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    const handleToggleBlock = async (targetUser) => {
        try {
            const res = await api.patch(`/users/${targetUser.id}/block`);

            setUsers(prev =>
                prev.map(u =>
                    u.id === targetUser.id
                        ? { ...u, blocked: res.data.blocked }
                        : u
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div 
                style={{
                    marginBottom: '1.5rem', 
                    display: 'flex', 
                    justifyContent: 'flex-start', 
                    gap: '1rem', 
                    alignItems: 'center'
                }}
            >

                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{padding: '0.6rem 0.05rem'}}>
                        <Link 
                            to='/' 
                            style={{
                                padding: '0.6rem 2rem',
                                background: '#6c757d',
                                color: 'white',
                                borderRadius: '6px',
                                textDecoration: 'none',
                            }}
                        >
                            На Главную
                        </Link>
                    </div>
                    <div>
                        {users.map(u => (
                            <UserCard
                                key={u.id}
                                user={u}
                                currentUser={currentUser}
                                onToggleBlock={handleToggleBlock}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsersList;