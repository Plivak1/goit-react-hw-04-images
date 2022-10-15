import { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bars } from 'react-loader-spinner';

import { toastInfo } from 'utils/toastInfo';
import { toastError } from 'utils/toastError';

import { fetchImages } from 'services';
import { Searchbar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { Button, ButtonWrap } from 'App.styled';

const galleryReducer = (state, action) => {
  switch (action.type) {
    case 'isLoading':
      return { ...state, isLoading: true };
    case 'imagesNotFound':
      return { ...state, isLoading: false, images: [] };
    case 'newImages':
      return { ...state, images: [...state.images, ...action.payload] };
    case 'lastPage':
      return { ...state, lastPage: true };
    case 'newRequest':
      return {
        ...state,
        images: [],
        page: 1,
        lastPage: false,
        query: action.payload,
      };
    case 'loadMoreImages':
      return { ...state, page: state.page + 1 };
    case 'stopLoading':
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const App = () => {
  const [state, dispatch] = useReducer(galleryReducer, {
    query: '',
    page: 1,
    lastPage: false,
    images: [],
    isLoading: false,
  });

  useEffect(() => {
    if (!state.query) {
      return;
    }
    dispatch({ type: 'isLoading' });

    setTimeout(async () => {
      try {
        const response = await fetchImages(state.query, state.page);
        const newImages = response.hits;

        if (newImages.length === 0) {
          dispatch({ type: 'imagesNotFound' });
          return toastInfo(`Нету картинок по запросу ${state.query}`);
        }

        dispatch({ type: 'newImages', payload: newImages });

        if (Math.ceil(response.total / 8) === state.page) {
          dispatch({ type: 'lastPage' });
          return toastInfo(`Картинок больше нет`);
        }
      } catch (error) {
        return toastError();
      } finally {
        dispatch({ type: 'stopLoading' });
      }
    }, 1000);
  }, [state.query, state.page]);

  const handleSubmit = e => {
    e.preventDefault();
    const {
      elements: { text },
    } = e.currentTarget;

    if (text.value.trim() === '') {
      return toastInfo('Строка пустая. Введите что-нибудь');
    }
    if (text.value.trim() === state.query) {
      return toastInfo('Такой же запрос :)');
    }
    dispatch({ type: 'newRequest', payload: text.value.trim() });
  };

  const handleButtonClick = e => {
    dispatch({ type: 'loadMoreImages' });
  };

  const { isLoading, images, lastPage } = state;

  return (
    <>
      <Searchbar handleSubmit={handleSubmit} isLoading={isLoading} />
      {images.length !== 0 && <ImageGallery images={images} />}
      <ButtonWrap>
        {isLoading ? (
          <Bars
            height="80"
            width="80"
            radius="9"
            color="#92b53f"
            ariaLabel="Bars"
          />
        ) : (
          <Button
            lastPage={lastPage}
            images={images.length === 0}
            onClick={handleButtonClick}
          >
            Load more
          </Button>
        )}
      </ButtonWrap>
      <ToastContainer />
    </>
  );
};

Searchbar.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
};

Button.propTypes = {
  lastPage: PropTypes.bool.isRequired,
  images: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
