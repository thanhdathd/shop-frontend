import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'

const HOST = 'http://localhost:5000'

const ProductDetail = ({match}) => {
    const [product, setProduct] = useState({});
  

    useEffect(() => {
        axios.post(`${HOST}/api/product/${match.params.id}`)
        .then(res => {
            if (res.status == 200) {
                product = setProduct(res.data)
                console.log('prooooo:'+JSON.stringify(product))
            } else {
                console.log('errrrr loi load chi tiet sp')
            }
        }).catch(e => {
            console.log('loi load chi tiet sp:'+e.message)
        })
    }, [])
  

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            Product id: {match.params.id}
          </CCardHeader>
          <CCardBody>
              <pre>
                  {JSON.stringify(product)}
              </pre>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductDetail
