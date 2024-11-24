import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Summary from './components/Summary';
import Reports from './components/Reports';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import useToken from './components/useToken';
import PageNotFound from './components/PageNotFound';
import './App.css';

function App() {
  const { token, removeToken, setToken } = useToken();

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
      </div>
    </BrowserRouter>
  );
}

export default App;