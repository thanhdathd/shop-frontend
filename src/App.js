import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './scss/style.scss';
import Cookies from 'js-cookie'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)


//containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));


class App extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.getCookie()
  }
  
  getCookie(){
    const savedLogin = Cookies.get("user");
    if(savedLogin){
      this.props.dispatch({type: "LOGIN", userData: JSON.parse(savedLogin), isLoggedIn: true});
    }else{
      console.log('getCookie doesnt end up well')
    }
  }

  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/login">
                {this.props.isLoggedIn ? <Redirect to="/dashboard" /> : <Login {...this.props}/>}
              </Route>
              {/* <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />*/}
              {/* <Route path="/dashboard" name="Home" render={props => <TheLayout {...props}/>} /> */}
              <Route path="/dashboard">
              {!this.props.isLoggedIn ? <Redirect to="/login" /> : <TheLayout {...this.props}/>}
              </Route>
              <Route exact path="/">
                {this.props.isLoggedIn ? <Redirect to="/dashboard" /> : <Login {...this.props}/>}
              </Route> 
              {/* {this.props.isLoggedIn ? 
               <Route exact path="/" name="Home" render={props => <TheLayout {...props}/>}/>
               :
               <Route exact path="/" name="Login Page" render={props => <Login {...props}/>}/>
              } */}
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

function mapStateToProps(state) {
  return { isLoggedIn: state.isLoggedIn, userData: state.userData};
}

export default connect(mapStateToProps)(App);
