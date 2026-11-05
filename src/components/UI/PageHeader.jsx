import { Link } from 'react-router';
import Icon from './Icon';

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  back,
}) {
  return (
    <header className='page-heading'>
      <div>
        {back && (
          <Link
            className='back-link'
            to={back.to}
          >
            <Icon
              name='back'
              size={16}
            />
            {back.label}
          </Link>
        )}
        {eyebrow && <p className='eyebrow'>{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className='page-description'>{description}</p>}
      </div>
      {actions && <div className='page-actions'>{actions}</div>}
    </header>
  );
}
