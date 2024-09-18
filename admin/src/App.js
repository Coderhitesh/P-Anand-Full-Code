import './App.css';
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard';
// import Home from './Components/Home/Home';
import Home from './components/Home/Home'
// import { ToastContainer } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import Login from './components/Auth/Login';

function App() {
  const role = sessionStorage.getItem('role')
  if (!role) {
    return (
      <>
        <BrowserRouter>
          <Login />
          <Toaster />
        </BrowserRouter>
      </>
    )
  }
  return (
    <>
      <BrowserRouter>
        <Home />
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
