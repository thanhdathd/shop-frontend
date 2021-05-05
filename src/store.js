import { createStore } from 'redux'

const initialState = {
  sidebarShow: 'responsive',
  loading: true,
  isLoggedIn: false,
  userData: null,
}

const reducer = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return {...state, ...rest }
    case 'LOGIN':
      return {...state, userData: rest.userData, isLoggedIn: true}
    default:
      return state
  }
}

const store = createStore(reducer)
export default store