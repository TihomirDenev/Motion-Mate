import { useId, useState } from 'react';
import Icon from './Icon';
import { useTranslation } from '../../i18n/useTranslation';

export default function FormField({
  label,
  hint,
  type = 'text',
  className = '',
  children,
  ...props
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id}>
        {label}
        {props.required && (
          <span
            className='required-dot'
            aria-hidden='true'
          >
            {' '}
            *
          </span>
        )}
      </label>
      <div className={type === 'password' ? 'password-field' : ''}>
        {children ? (
          <select
            id={id}
            {...props}
          >
            {children}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={id}
            {...props}
          />
        ) : (
          <input
            id={id}
            type={type === 'password' && visible ? 'text' : type}
            {...props}
          />
        )}
        {type === 'password' && (
          <button
            type='button'
            className='icon-button'
            onClick={() => setVisible((value) => !value)}
            aria-label={t(
              visible ? 'common.hidePassword' : 'common.showPassword'
            )}
            aria-pressed={visible}
          >
            <Icon
              name={visible ? 'eyeOff' : 'eye'}
              size={18}
            />
          </button>
        )}
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}
