import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import axios from 'axios';
import * as authActions from "../src/redux/actions/AuthAction"

function App() {

  const dispatch = useDispatch()

  useEffect(async () => {
    const token = Cookies.get('KB-Token')

    if (token) {
      const res = await axios.get('https://kanben-deploy.herokuapp.com/profile/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      })

      if (res) {
        const userData = res.data.data
        const isAdmin = (userData.admin_type === 'Admin') ? true : false

        const userInfo = {
          ...userData,
          token: token,
          isAdmin: isAdmin
        }

        dispatch(authActions.dispatchLogin(userInfo))
      }
    }
  }, [])

  return (
    <div>
      <Router>
        <div className="App">
          <Routes />
        </div>
      </Router>

      <div>
        <ToastContainer limit={1} />
      </div>
    </div>
  );
}

export default App;
