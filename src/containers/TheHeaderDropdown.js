import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';


const TheHeaderDropdown = () => {
  const dispath = useDispatch();
  const user = useSelector(state => state.userData);


  const signOutClick = (evt) => {
    console.log('data user from redux:'+JSON.stringify(user))
    Cookies.remove("user");
    Cookies.remove("isLoggedIn");
    dispath({type: 'LOGIN', userData: null, isLoggedIn: false});
  }

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={'avatars/6.jpg'}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={signOutClick}>
          <CIcon name="cil-user" className="mfe-2" />
          Đăng xuất
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
