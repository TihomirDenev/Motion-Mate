import { useContext, useDeferredValue, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { useDatabaseValue } from '../../hooks/useDatabaseValue';
import { usePageTitle } from '../../hooks/usePageTitle';
import SingleUserView from '../../components/SingleUser/SingleUserView';
import PageHeader from '../../components/UI/PageHeader';
import Icon from '../../components/UI/Icon';
import Avatar from '../../components/UI/Avatar';
import EmptyState from '../../components/UI/EmptyState';
import LoadingState from '../../components/UI/LoadingState';
import InlineMessage from '../../components/UI/InlineMessage';
import { useTranslation } from '../../i18n/useTranslation';

export default function AllUsers() {
  const { t, locale, formatNumber } = useTranslation();
  usePageTitle(`Motion Mate | ${t('overview.communityTitle')}`);
  const { userData } = useContext(AppContext);
  const { data, loading, error } = useDatabaseValue('users');
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState('name');
  const [limit, setLimit] = useState(12);
  const search = params.get('search') || '';
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const users = Object.values(data || {}).filter(
    (user) => user.username !== userData.username
  );
  const filtered = users
    .filter((user) =>
      `${user.username} ${user.firstName || ''} ${user.lastName || ''}`
        .toLowerCase()
        .includes(deferredSearch)
    )
    .sort((a, b) =>
      sort === 'newest'
        ? Number(b.createdOn) - Number(a.createdOn)
        : (a.firstName || a.username).localeCompare(
            b.firstName || b.username,
            locale
          )
    );
  const updateSearch = (value) => {
    setParams(value ? { search: value } : {}, { replace: true });
    setLimit(12);
  };
  return (
    <div className='community-page page-enter'>
      <PageHeader
        eyebrow={t('community.eyebrow')}
        title={t('community.title')}
        description={t('community.description')}
        actions={
          <Link
            className='btn btn-primary'
            to='/my-friends'
          >
            <Icon
              name='users'
              size={16}
            />
            {t('community.myCircle')}{' '}
            <span className='button-count'>
              {Object.keys(userData.friends || {}).length}
            </span>
          </Link>
        }
      />
      <section className='community-banner'>
        <div>
          <span className='pill pill-lavender'>
            {t('community.bannerPill')}
          </span>
          <h2>
            {t('community.bannerLine1')}
            <br />
            {t('community.bannerLine2')}
          </h2>
          <p>{t('community.bannerText')}</p>
        </div>
        <div className='community-banner-avatars'>
          {users.slice(0, 3).map((user) => (
            <Avatar
              user={user}
              size='lg'
              key={user.username}
            />
          ))}
          <span className='community-plus'>
            <Icon
              name='plus'
              size={24}
            />
          </span>
          <small>
            {users.length
              ? t('community.potential', {
                  count: users.length,
                  formatted: formatNumber(users.length),
                })
              : t('community.goodCompany')}
          </small>
        </div>
      </section>
      <div className='toolbar section-space'>
        <label className='search-field'>
          <Icon
            name='search'
            size={18}
          />
          <input
            type='search'
            aria-label={t('community.searchLabel')}
            placeholder={t('community.searchPlaceholder')}
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
          />
        </label>
        <label className='sort-control'>
          {t('community.sortBy')}
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value='name'>{t('community.sortName')}</option>
            <option value='newest'>{t('community.sortNewest')}</option>
          </select>
          <Icon
            name='down'
            size={14}
          />
        </label>
      </div>
      <div className='section-heading'>
        <h2>{t(search ? 'community.results' : 'community.meet')}</h2>
        <span className='result-count'>
          {t('community.people', { count: filtered.length })}
        </span>
      </div>
      <InlineMessage>{error}</InlineMessage>
      {loading ? (
        <LoadingState cards={6} />
      ) : filtered.length ? (
        <>
          <div
            className='people-grid'
            aria-busy={deferredSearch !== search.trim().toLowerCase()}
          >
            {filtered.slice(0, limit).map((user) => (
              <SingleUserView
                user={user}
                key={user.username}
              />
            ))}
          </div>
          {filtered.length > limit && (
            <div className='load-more'>
              <button
                className='btn btn-ghost'
                onClick={() => setLimit((value) => value + 12)}
              >
                {t('community.more')}{' '}
                <Icon
                  name='down'
                  size={16}
                />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className='surface'>
          <EmptyState
            icon='search'
            title={t('community.emptyTitle')}
            description={t('community.emptyDescription')}
          >
            <button
              className='btn btn-ghost'
              onClick={() => updateSearch('')}
            >
              {t('common.clearSearch')}
            </button>
          </EmptyState>
        </div>
      )}
    </div>
  );
}
