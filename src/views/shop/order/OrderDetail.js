import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'

const HOST = 'http://localhost:5000'

const OrderDetail = ({match}) => {

    const [order, setOrder] = useState({});
  

    useEffect(() => {
        axios.post(`${HOST}/api/order/${match.params.id}`)
        .then(res => {
            if (res.status == 200) {
                order = setOrder(res.data)
                console.log('prooooo:'+JSON.stringify(order))
            } else {
                console.log('errrrr loi load đàadadda')
            }
        }).catch(e => {
            console.log('loi load dataata:'+e.message)
        })
    }, [])
  

  return (
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <div className="d-inline-flex w-100">
              <h3 className="w-50 my-auto">{order.name}</h3>
              <span className="w-50 text-right text-muted">ID: {match.params.id}</span>
            </div>
          </CCardHeader>
          <CCardBody>
            <div className="d-inline-flex w-100">
              <span className="w-50 text-right font-weight-bold">Người tạo:</span>
              <span className="w-50 text-right">{order.staffName}</span>
            </div>
            <div className="d-inline-flex w-100">
              <span className="w-50 text-right font-weight-bold">Số điện thoại:</span>
              <span className="w-50 text-right">{order.staffName}</span>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default OrderDetail
