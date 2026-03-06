import React, {useEffect, useState} from "react";
import Modal from 'react-modal';

function Registration() {
    const [ModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const modalContent = (
        <div>
            <h2>Набросок формы регистрации</h2>
            <p>Здесь должны быть поля для заполнения (наеюсь)</p>
            <button onClick={closeModal}>Закрыть форму</button>
        </div>
    );

    return (
        <div>
            <button onClick={openModal}>Зарегистрироваться</button>
            <Modal isOpen = {ModalOpen} onRequestClose={closeModal}>
                {modalContent}
            </Modal>
        </div>
    );
}

export default Registration;