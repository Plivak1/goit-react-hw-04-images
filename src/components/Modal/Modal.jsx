import { Overlay, ImageModal, LargeImage } from './Modal.styled';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

export const Modal = ({ closeModal, largeImg }) => {
  useEffect(() => {
    const onClickEsc = e => {
      if (e.code !== 'Escape') {
        return;
      }
      closeModal();
    };
    window.addEventListener('keydown', onClickEsc);
    return () => {
      window.removeEventListener('keydown', onClickEsc);
    };
  }, [closeModal]);

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return createPortal(
    <Overlay onClick={handleOverlayClick}>
      <ImageModal>
        <LargeImage src={largeImg} />
      </ImageModal>
    </Overlay>,
    document.querySelector('#image-modal')
  );
};

Overlay.propTypes = {
  onClick: PropTypes.func.isRequired,
};

LargeImage.propTypes = {
  src: PropTypes.string.isRequired,
};
