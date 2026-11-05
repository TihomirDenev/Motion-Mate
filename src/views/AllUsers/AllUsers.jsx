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

export default function AllUsers() {
  usePageTitle('Motion Mate | Find your people');
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
        : (a.firstName || a.username).localeCompare(b.firstName || b.username)
    );
  const updateSearch = (value) => {
    setParams(value ? { search: value } : {}, { replace: true });
    setLimit(12);
  };
  return (
    <div className='community-page page-enter'>
      <PageHeader
        eyebrow='GOOD ENERGY. GREAT COMPANY.'
        title='Find your people.'
        description='A little encouragement can take you a long way. Find your Motion Mates.'
        actions={
          <Link
            className='btn btn-primary'
            to='/my-friends'
          >
            <Icon
              name='users'
              size={16}
            />
            My circle{' '}
            <span className='button-count'>
              {Object.keys(userData.friends || {}).length}
            </span>
          </Link>
        }
      />
      <section className='community-banner'>
        <div>
          <span className='pill pill-lavender'>BETTER, TOGETHER</span>
          <h2>
            Your kind of people.
            <br />
            Your kind of momentum.
          </h2>
          <p>
            Share exercises, cheer on each other’s goals, and keep showing up.
          </p>
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
              ? `${users.length} potential Motion Mates`
              : 'Good company starts here'}
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
            aria-label='Search people by name or username'
            placeholder='Search a name or username…'
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
          />
        </label>
        <label className='sort-control'>
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value='name'>Name, A–Z</option>
            <option value='newest'>Newest members</option>
          </select>
          <Icon
            name='down'
            size={14}
          />
        </label>
      </div>
      <div className='section-heading'>
        <h2>{search ? 'Your search results' : 'Meet the community'}</h2>
        <span className='result-count'>
          {filtered.length} {filtered.length === 1 ? 'person' : 'people'}
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
                Meet more mates{' '}
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
            title='Your people are out there'
            description='Try a different name or username to find them.'
          >
            <button
              className='btn btn-ghost'
              onClick={() => updateSearch('')}
            >
              Clear search
            </button>
          </EmptyState>
        </div>
      )}
    </div>
  );
}
