import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CDataTable, CBadge,
  CButton,
  CCardFooter,
  CCollapse,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFade,
  CForm,
  CFormGroup,
  CFormText,
  CValidFeedback,
  CInvalidFeedback,
  CTextarea,
  CInput,
  CInputFile,
  CInputCheckbox,
  CInputRadio,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CDropdown,
  CInputGroupText,
  CLabel,
  CSelect,
  CSwitch
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'

const HOST = 'http://localhost:5000'

const fields = [
  {key: 'image', label: '', _style: {width: '10%'}},
  {key: 'name', label: 'Tên', _style: {width: '50%'}},
  {key: 'option', label: 'Option', _style: {width: '35%'}},
  {key: 'quantity', label: 'SL', _style: {width: '5%'}},
]

const getStatusColor = (status) => {
  switch(status){
      case 'new' : return 'secondary'
      case 'done' : return 'success'
      case 'carry' : return 'light'
      default: return 'info'
  }
}

const OrderDetail = ({match}) => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.userData)
    const [order, setOrder] = useState({});
  

    useEffect(() => {
        axios.post(`${HOST}/api/order/${match.params.id}`)
        .then(res => {
            if (res.status == 200) {
                preProcess(res.data)
                order = setOrder(res.data)
                console.log('prooooo:'+JSON.stringify(order))
            } else {
                console.log('errrrr loi load đàadadda')
            }
        }).catch(e => {
            console.log('loi load dataata:'+e.message)
        })
    }, [])

    const preProcess = (od) => {
        if(od.listProduct){
          let total = 0
          od.listProduct.forEach(p => {
            total = total + p.price*p.quantity
          });
          od.totalAmount = total
        }
    }
  

  return (
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <div className="d-inline-flex w-100">
              <h3 className="w-50 my-auto">{order.name} - ID: {order.id}</h3> 
              <span className="w-50 text-right">
              <CBadge color={getStatusColor(order.status)}>
                    {order.status}
                </CBadge>
                </span>
            </div>
          </CCardHeader>
          <CCardBody className="pt-0">
            <div className="d-inline-flex w-100">
              <span className="small text-muted">Staff:</span>
              <span className="small text-muted ml-2">{order.staffName}</span>
              <span className="small text-muted ml-2">-</span>
              <span className="small text-muted ml-2">{order.staffPhone}</span>
            </div>
            <CDataTable
              items={order.listProduct}
              fields={fields}
              itemsPerPage={50}
              scopedSlots = {{
                  'image': (item) => (
                      <td className="border">
                          <img
                              width={50}
                              className="mx-auto rounded"
                              src={`${HOST}${item.image}`}
                              alt={item.image} />
                      </td>
                  ),
                  'name': (item) => (
                      <td>
                          <div className="text-uppercase">{item.name}</div>
                      </td>
                  ),
                  'option': (item) => (
                      <td>
                          <div className="text-muted">{item.option}</div>
                      </td>
                  ),
                  'quantity':
                  (item)=>(
                    <td>
                      <div className="text-muted">{item.quantity}</div>
                     </td>
                  )
                  
              }}
          />
            <div className="d-inline-flex px-3 w-100 mt-4 my-2">
              <div className="col-sm-4 px-0"><span className="text-uppercase">Ghi chú</span></div>
              <div className="col-sm-8 text-right px-0"><span className="font-weight-bold ">{order.note}</span></div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol sm="6">
        <CCard>
          <CCardHeader>
              <h3 className="w-50 my-auto">Thanh toán</h3> 
          </CCardHeader>
          <CCardBody className="pt-0">
          <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel>Thu ngan</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <p className="form-control-static">{user.name}</p>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Phu phí</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="text-input" name="text-input" placeholder="Additional fee" />
                    <CFormText>This is a help text</CFormText>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="email-input">Discount</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput type="text" id="email-input" name="email-input" placeholder="discount" autoComplete="email"/>
                    <CFormText className="help-block">Please enter discount</CFormText>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="password-input">Cash</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput type="text" id="password-input" name="password-input" placeholder="Cash" autoComplete="new-password" />
                    <CFormText className="help-block">Please enter</CFormText>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="password-input">Change</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput type="text" id="password-input" name="password-input" placeholder="change" autoComplete="new-password" />
                    <CFormText className="help-block">Please enter</CFormText>
                  </CCol>
                </CFormGroup>
              </CForm>
              <CCol col="12" className="text-right">
                <CButton color="primary">
                  Thanh toán
                </CButton>
              </CCol>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default OrderDetail
