import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CInvalidFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
const HOST = 'http://localhost:5000'



class Login extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            email: 'hahah@gmail.com',
            pass: '12345678',
            passwordInvalid: false,
            emailInvalid: false,
            errorMessage: '',
        }
    }

    handlePassChange = (event) => {
        this.setState({pass: event.target.value});
    }

    handleEmailChange = (event) => {
        this.setState({email: event.target.value});
    }

    doLogin = () => {
        console.log(`u submit this: email:${this.state.email} - ${this.state.pass}`)
        const url =`${HOST}/api/login`
        axios.post(url, {
            email: this.state.email,
            password: this.state.pass
        })
        .then(res => {
            if(res.status == 200){
                console.log("Dang nhap thanh cong")
                var user = res.data
                console.log(JSON.stringify(user));
                this.setState({passwordInvalid: false, emailInvalid: false});
            }else{
                console.log('message:'+JSON.stringify(res))
                if(res.statusText.startsWith('M')){
                    this.setState({passwordInvalid: true, errorMessage: res.statusText});
                }else{
                    this.setState({emailInvalid: true, errorMessage: res.statusText});
                }
            }
        })
        .catch(err => {
            console.log('co loi xay ra!'+JSON.stringify(err))
            this.setState({emailInvalid: true, errorMessage: err.message});

            // if(err.data.message.startsWith('M')){
            //     this.setState({passwordInvalid: true, errorMessage: err.data.message});
            // }else{
            //     this.setState({emailInvalid: true, errorMessage: err.data.message});
            // }
        })
    }


    render() {
        return (
            <div className="c-app c-default-layout flex-row align-items-center">
              <CContainer>
                <CRow className="justify-content-center">
                  <CCol md="4">
                    <CCardGroup>
                      <CCard className="p-4">
                        <CCardBody>
                          <CForm>
                            <h1>Đăng nhập</h1>
                            <p className="text-muted">Mời đăng nhập để tiếp tục</p>
                            <CInputGroup className="mb-3">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                  <CIcon name="cil-user" />
                                </CInputGroupText>
                              </CInputGroupPrepend>
                              <CInput type="email" id='nf-email'
                                name='nf-email' placeholder="Email"
                                value={this.state.email}
                                invalid={this.state.emailInvalid}
                                onChange={this.handleEmailChange}
                                autoComplete="email" />
                                <CInvalidFeedback>{this.state.errorMessage}</CInvalidFeedback>
                            </CInputGroup>
                            <CInputGroup className="mb-4">
                              <CInputGroupPrepend>
                                <CInputGroupText>
                                  <CIcon name="cil-lock-locked" />
                                </CInputGroupText>
                              </CInputGroupPrepend>
                              <CInput type="password" id='nf-password' name='nf-password'
                              value={this.state.pass}
                              onChange={this.handlePassChange}
                              invalid={this.state.passwordInvalid}
                              placeholder="Password" autoComplete="current-password" />
                              <CInvalidFeedback>{this.state.errorMessage}</CInvalidFeedback>
                            </CInputGroup>
                            <CRow className="justify-content-center">
                              <CCol sm="0" className="justify-content-center">
                                <CButton color="primary"  className="px-5" onClick={() => this.doLogin()}>Login</CButton>
                              </CCol>
                            </CRow>
                          </CForm>
                        </CCardBody>
                      </CCard>
                      {/* <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                        <CCardBody className="text-center">
                          <div>
                            <h2>Sign up</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                              labore et dolore magna aliqua.</p>
                            <Link to="/register">
                              <CButton color="primary" className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                            </Link>
                          </div>
                        </CCardBody>
                      </CCard> */}
                    </CCardGroup>
                  </CCol>
                </CRow>
              </CContainer>
            </div>
          )
    }
}

export default Login
