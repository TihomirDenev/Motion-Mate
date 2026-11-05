import { useState } from 'react';
import PhotoViewer from './PhotoViewer';

export default function Avatar({ user, size = 'md', zoomable = false }) {
  const [failedSource, setFailedSource] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const name = user?.firstName || user?.username || 'Motion Mate';
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || name;
  const initials =
    `${name[0] || 'M'}${user?.lastName?.[0] || name[1] || 'M'}`.toUpperCase();
  const hasPhoto = Boolean(user?.avatar) && failedSource !== user.avatar;
  const canZoom = zoomable && hasPhoto;
  const Root = canZoom ? 'button' : 'span';

  return (
    <>
      <Root
        type={canZoom ? 'button' : undefined}
        className={`user-avatar avatar-${size}${canZoom ? ' avatar-zoom' : ''}`}
        aria-label={canZoom ? `View ${fullName}'s photo` : undefined}
        onClick={canZoom ? () => setViewerOpen(true) : undefined}
        style={{
          '--avatar-hue':
            [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360,
        }}
      >
        {hasPhoto ? (
          <img
            src={user.avatar}
            alt={canZoom ? '' : `${name}'s avatar`}
            loading='lazy'
            onError={() => setFailedSource(user.avatar)}
          />
        ) : (
          <span aria-label={`${name}'s avatar`}>{initials}</span>
        )}
      </Root>
      {canZoom && (
        <PhotoViewer
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          src={user.avatar}
          caption={fullName}
        />
      )}
    </>
  );
}
