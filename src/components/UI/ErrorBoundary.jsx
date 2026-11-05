import { Component } from 'react';
import Icon from './Icon';
import { translate } from '../../i18n/i18n';

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
          <p className='eyebrow'>{translate('errorBoundary.eyebrow')}</p>
          <h1>
            {translate('errorBoundary.titleLine1')}
            <br />
            {translate('errorBoundary.titleLine2')}
          </h1>
          <p>{translate('errorBoundary.description')}</p>
          <button
            className='btn btn-primary'
            onClick={() => window.location.reload()}
          >
            {translate('errorBoundary.refresh')}{' '}
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
