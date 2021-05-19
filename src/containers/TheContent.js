import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'

// routes config
import routes from '../routes'
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)
const Colors = React.lazy(() => import('../views/theme/colors/Colors'));

const TheContent = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);

  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              // console.log('render route: '+JSON.stringify(route))
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade>
                      { !isLoggedIn ? <Redirect to="/" /> : <route.component {...props} />}
                    </CFade>
                  )} />
              )
            })}
            <Route path={'/theme/colors'}
              name={'Colors'}
              render={props => (<Colors {...props}/>)}
            />
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
