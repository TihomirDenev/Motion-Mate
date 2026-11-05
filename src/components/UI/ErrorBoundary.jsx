import { Component } from 'react';
import Icon from './Icon';

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error('Motion Mate could not display this screen:', error);
  }
  render() {
    if (this.state.failed)
      return (
        <main className='not-found'>
          <span className='empty-icon'>
            <Icon
              name='refresh'
              size={30}
            />
          </span>
          <p className='eyebrow'>LET’S TRY THAT AGAIN</p>
          <h1>
            A little pause
            <br />
            in the momentum.
          </h1>
          <p>This screen couldn’t load. Refresh to get back on track.</p>
          <button
            className='btn btn-primary'
            onClick={() => window.location.reload()}
          >
            Refresh the app{' '}
            <Icon
              name='refresh'
              size={16}
            />
          </button>
        </main>
      );
    return this.props.children;
  }
}
