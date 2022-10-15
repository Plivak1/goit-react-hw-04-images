import { toast } from 'react-toastify';

export function toastInfo(errorMessage) {
  toast.info(errorMessage, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
