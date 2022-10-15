import { GalleryItem, GalleryImage } from './ImageGalleryItem.styled';
import PropTypes from 'prop-types';

export const ImageGalleryItem = ({ smallImgLink, tags, onClick }) => (
  <GalleryItem>
    <GalleryImage src={smallImgLink} alt={tags} onClick={onClick} />
  </GalleryItem>
);

GalleryImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
