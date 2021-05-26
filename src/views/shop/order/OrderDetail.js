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
      <CCol>
        <CCard>
          <CCardHeader>
            Order id: {match.params.id}
          </CCardHeader>
          <CCardBody>
              <pre>
                  {JSON.stringify(order)}
              </pre>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default OrderDetail
