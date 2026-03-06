import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';

function Login() {
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const ModalContent = (
        <div>
            <h2>Здесь должна быть форма для входа, если зареган</h2>
            <p>Здесь будут поля для заполнения при входе</p>
            <button onClick={closeModal}>Закрыть форму</button>
        </div>
    );

    return (
        <div>
            <button onClick={openModal}>Войти</button>
            <Modal isOpen={modalOpen} onRequestClose={closeModal}>
                {ModalContent}
            </Modal>
        </div>
    );
}

export default Login;