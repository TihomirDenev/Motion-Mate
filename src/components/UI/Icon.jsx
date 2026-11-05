const paths = {
  home: (
    <>
      <path d='m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z' />
      <path d='M9 21v-8h6v8' />
    </>
  ),
  activity: (
    <>
      <path d='M3 12h4l3-8 4 16 3-8h4' />
    </>
  ),
  dumbbell: (
    <>
      <path d='m6.5 6.5 11 11M4 9l5-5M15 20l5-5M2 7l5-5M17 22l5-5M7 14l7-7M10 17l7-7' />
    </>
  ),
  target: (
    <>
      <circle
        cx='12'
        cy='12'
        r='9'
      />
      <circle
        cx='12'
        cy='12'
        r='5'
      />
      <circle
        cx='12'
        cy='12'
        r='1'
      />
    </>
  ),
  heart: (
    <path d='M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z' />
  ),
  users: (
    <>
      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8' />
      <circle
        cx='9'
        cy='7'
        r='4'
      />
    </>
  ),
  user: (
    <>
      <circle
        cx='12'
        cy='8'
        r='4'
      />
      <path d='M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2' />
    </>
  ),
  arrow: (
    <>
      <path d='M4 12h16m-6-6 6 6-6 6' />
    </>
  ),
  arrowUp: (
    <>
      <path d='M6 18 18 6M6 6h12v12' />
    </>
  ),
  back: <path d='M20 12H4m6-6-6 6 6 6' />,
  chevron: <path d='m9 5 7 7-7 7' />,
  down: <path d='m6 9 6 6 6-6' />,
  plus: <path d='M12 5v14M5 12h14' />,
  close: <path d='m6 6 12 12M6 18 18 6' />,
  check: <path d='m5 12 4 4L19 6' />,
  search: (
    <>
      <circle
        cx='10.5'
        cy='10.5'
        r='7.5'
      />
      <path d='m16 16 5 5' />
    </>
  ),
  bell: (
    <>
      <path d='M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4' />
    </>
  ),
  sun: (
    <>
      <circle
        cx='12'
        cy='12'
        r='4'
      />
      <path d='M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' />
    </>
  ),
  moon: <path d='M21 12.8A9 9 0 0 1 11.2 3 9 9 0 1 0 21 12.8Z' />,
  menu: <path d='M4 6h16M4 12h16M4 18h16' />,
  logout: (
    <>
      <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M10 12h11m-4-4 4 4-4 4' />
    </>
  ),
  settings: (
    <>
      <path d='m9 3-1 3-3 1v3l-2 2 2 2v3l3 1 1 3h6l1-3 3-1v-3l2-2-2-2V7l-3-1-1-3Z' />
      <circle
        cx='12'
        cy='12'
        r='3'
      />
    </>
  ),
  flame: (
    <path d='M12 3c1 5 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 4-7 0 3 2 3 2-4Z' />
  ),
  clock: (
    <>
      <circle
        cx='12'
        cy='12'
        r='9'
      />
      <path d='M12 7v5l3 2' />
    </>
  ),
  play: <path d='m8 4 12 8-12 8Z' />,
  stop: (
    <rect
      x='5'
      y='5'
      width='14'
      height='14'
      rx='3'
    />
  ),
  drop: <path d='M12 3S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12-7-12Z' />,
  scale: (
    <>
      <rect
        x='3'
        y='3'
        width='18'
        height='18'
        rx='5'
      />
      <path d='m7 8 5-2 5 2-2 4H9Z' />
    </>
  ),
  trophy: (
    <>
      <path d='M8 3h8v6a4 4 0 0 1-8 0ZM8 5H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4M12 13v5m-4 3v-3h8v3' />
    </>
  ),
  sparkles: (
    <>
      <path d='m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4' />
    </>
  ),
  calendar: (
    <>
      <rect
        x='3'
        y='5'
        width='18'
        height='16'
        rx='3'
      />
      <path d='M16 3v4M8 3v4M3 11h18M8 15h2m4 0h2m-8 3h2' />
    </>
  ),
  edit: (
    <>
      <path d='m16 3 5 5L9 20l-6 1 1-6ZM13 6l5 5' />
    </>
  ),
  trash: (
    <>
      <path d='M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7' />
    </>
  ),
  camera: (
    <>
      <path d='m8 5 2-2h4l2 2h4a2 2 0 0 1 2 2v12H2V7a2 2 0 0 1 2-2Z' />
      <circle
        cx='12'
        cy='12'
        r='4'
      />
    </>
  ),
  mail: (
    <>
      <rect
        x='3'
        y='5'
        width='18'
        height='14'
        rx='3'
      />
      <path d='m3 7 9 6 9-6' />
    </>
  ),
  shield: (
    <>
      <path d='m12 3 9 4v5c0 5-9 9-9 9s-9-4-9-9V7Z' />
      <path d='m8 12 3 3 5-6' />
    </>
  ),
  info: (
    <>
      <circle
        cx='12'
        cy='12'
        r='9'
      />
      <path d='M12 11v6m0-10v.01' />
    </>
  ),
  eye: (
    <>
      <path d='M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z' />
      <circle
        cx='12'
        cy='12'
        r='3'
      />
    </>
  ),
  eyeOff: (
    <>
      <path d='m3 3 18 18M10.6 5.1A12 12 0 0 1 12 5c6 0 10 7 10 7a18 18 0 0 1-3 3.7M6 6.3A23 23 0 0 0 2 12s4 7 10 7a12 12 0 0 0 5-1.2' />
    </>
  ),
  refresh: (
    <>
      <path d='M20 7v5h-5M4 17v-5h5' />
      <path d='M6.1 6a8 8 0 0 1 13.2 3M4.7 15A8 8 0 0 0 18 18' />
    </>
  ),
  leaf: (
    <>
      <path d='M20 3C10 2 3 7 3 13a8 8 0 0 0 8 8c6 0 10-7 9-18Z' />
      <path d='m4 20 11-11' />
    </>
  ),
};

export default function Icon({ name, size = 20, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon ${className}`}
      aria-hidden='true'
      {...props}
    >
      {paths[name] || paths.activity}
    </svg>
  );
}
