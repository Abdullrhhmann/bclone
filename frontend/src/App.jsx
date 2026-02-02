import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MyProfilePage from './pages/MyProfilePage';
import CreateProjectPage from './pages/CreateProjectPage';
import './styles/App.css'
import { useAppState } from './context/Context';

function App() {
  const { currentPage } = useAppState();

  return (
    <div>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'myProfile' && <MyProfilePage />}
      {currentPage === 'createProject' && <CreateProjectPage />}
    </div>
  );
}

export default App
