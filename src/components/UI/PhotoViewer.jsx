import { useEffect, useRef } from 'react';
import Icon from './Icon';

export default function PhotoViewer({ open, onClose, src, caption }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className='photo-viewer'
      aria-label={`${caption}'s photo`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && (
        <figure>
          <img
            src={src}
            alt={`${caption}'s profile photo`}
          />
          <figcaption>{caption}</figcaption>
        </figure>
      )}
      <button
        type='button'
        className='icon-button photo-viewer-close'
        aria-label='Close photo'
        onClick={onClose}
      >
        <Icon name='close' />
      </button>
    </dialog>
  );
}
