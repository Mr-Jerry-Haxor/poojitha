import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Summary from './components/Summary';
import Reports from './components/Reports';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import useToken from './components/useToken';
import PageNotFound from './components/PageNotFound';
import setupAxiosInterceptors from './axiosInterceptor';
import './App.css';

function App() {
  const { token, removeToken, setToken } = useToken();

  const logout = () => {
    removeToken();
    window.location.href = '/login';
  };

  setupAxiosInterceptors(logout);

  return (
    <BrowserRouter>
      <div className="App">
        {token && <Navbar token={removeToken} />}
        <Switch>
          <Route path="/login">
            {!token ? <Login setToken={setToken} /> : <Redirect to="/dashboard" />}
          </Route>
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/summary" component={Summary} />
          <PrivateRoute path="/reports" component={Reports} />
          <Route exact path="/">
            {token ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
          </Route>
          <Route path="*">
            <PageNotFound />
          </Route>
        </Switch>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;