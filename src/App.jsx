import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { auth, db } from './config/firebase-config';
import { Layout } from './hoc/Layout/Layout';
import { AppContext } from './context/AppContext';
import Authenticated from './hoc/Authenticated/Authenticated';
import LoadingState from './components/UI/LoadingState';
import InlineMessage from './components/UI/InlineMessage';

const Home = lazy(() => import('./views/Home/Home'));
const About = lazy(() => import('./views/About/About'));
const Login = lazy(() => import('./components/Login/Login'));
const Register = lazy(() => import('./views/Register/Register'));
const RegisterAdditionalInfo = lazy(
  () => import('./views/RegisterAdditionalInfo/RegisterAdditionalInfo')
);
const NotFound = lazy(() => import('./views/NotFound/NotFound'));
const ContactUs = lazy(() => import('./views/ContactUs/ContactUs'));
const WellnessHealthTools = lazy(
  () => import('./views/WellnessAndHealthTools/WellnessAndHealthTools')
);
const Goals = lazy(() => import('./views/Goals/Goals'));
const DetailedGoal = lazy(() => import('./components/Goals/DetailedGoal'));
const AllUsers = lazy(() => import('./views/AllUsers/AllUsers'));
const MyFriends = lazy(() => import('./views/MyFriends/MyFriends'));
const FullProfileView = lazy(
  () => import('./views/FullProfileView/FullProfileView')
);
const MyProfile = lazy(() => import('./views/MyProfile/MyProfile'));
const Exercises = lazy(() =>
  import('./views/Exercises/Exercises').then((module) => ({
    default: module.Exercises,
  }))
);
const Categories = lazy(() => import('./components/Categories/Categories'));
const AdminPanel = lazy(() => import('./views/AdminPanel/AdminPanel'));

const protectedRoutes = [
  { path: '/register-additional-info', element: <RegisterAdditionalInfo /> },
  { path: '/wellness-health-tools', element: <WellnessHealthTools /> },
  { path: '/goals', element: <Goals /> },
  { path: '/goals/:id', element: <DetailedGoal /> },
  { path: '/all-users', element: <AllUsers /> },
  { path: '/my-friends', element: <MyFriends /> },
  { path: '/users/:id', element: <FullProfileView /> },
  { path: '/my-profile', element: <MyProfile /> },
  { path: '/exercises/:category', element: <Exercises /> },
  { path: '/exercises', element: <Categories /> },
  { path: '/admin-panel', element: <AdminPanel /> },
];

const PageLoader = () => <LoadingState />;

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let unsubscribeProfile;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeProfile?.();
      setAuthError('');
      if (!user) {
        setAppState({ user: null, userData: null });
        setIsAuthReady(true);
        return;
      }
      unsubscribeProfile = onValue(
        query(ref(db, 'users'), orderByChild('uid'), equalTo(user.uid)),
        (snapshot) => {
          setAppState({
            user,
            userData: Object.values(snapshot.val() || {})[0] || null,
          });
          setIsAuthReady(true);
        },
        (error) => {
          setAuthError(error.message);
          setIsAuthReady(true);
        }
      );
    });
    return () => {
      unsubscribeAuth();
      unsubscribeProfile?.();
    };
  }, []);

  return (
    <AppContext.Provider value={{ ...appState, setAppState }}>
      <Layout>
        {authError ? (
          <InlineMessage>{authError}</InlineMessage>
        ) : isAuthReady ? (
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path='/'
                element={<Home />}
              />
              <Route
                path='/about'
                element={<About />}
              />
              <Route
                path='/login'
                element={<Login />}
              />
              <Route
                path='/register'
                element={<Register />}
              />
              <Route
                path='/contact-us'
                element={<ContactUs />}
              />
              {protectedRoutes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={<Authenticated>{element}</Authenticated>}
                />
              ))}
              <Route
                path='*'
                element={<NotFound />}
              />
            </Routes>
          </Suspense>
        ) : (
          <PageLoader />
        )}
      </Layout>
    </AppContext.Provider>
  );
}

export default App;
