import { useEffect, useId, useRef } from 'react';
import Icon from './Icon';

export default function Modal({ open, onClose, title, description, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();
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
      className='app-dialog'
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className='dialog-content'>
        <div className='dialog-handle' />
        <div className='dialog-heading'>
          <div>
            <p className='eyebrow'>MAKE YOUR NEXT MOVE</p>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            type='button'
            className='icon-button'
            aria-label='Close dialog'
            onClick={onClose}
          >
            <Icon name='close' />
          </button>
        </div>
        {description && <p className='dialog-description'>{description}</p>}
        {open && children}
      </div>
    </dialog>
  );
}
