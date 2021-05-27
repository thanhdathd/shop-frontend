import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import moment from 'moment'

const HOST = 'http://localhost:5000'

const ReceiptDetail = ({match}) => {

    const [receipt, setReceipt] = useState({});
  

    useEffect(() => {
        axios.post(`${HOST}/api/receipt/${match.params.id}`)
        .then(res => {
            if (res.status == 200) {
                //preProcess(res.data)
                setReceipt(res.data[0])
                console.log('prooooo:'+JSON.stringify(receipt))
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
              <h3 className="w-50 my-auto">{receipt.name}</h3>
              <span className="w-50 text-right text-muted">ID: {match.params.id}</span>
            </div>
          </CCardHeader>
          <CCardBody className="pt-0">
            <div className="d-inline-flex w-100">
              <div className="col-sm-6 pt-0">
                <span className="small text-muted">Staff:</span>
                <span className="small text-muted ml-2">{receipt.staffName}</span>
                <span className="small text-muted ml-2">-</span>
                <span className="small text-muted ml-2">{receipt.staffPhone}</span>
              </div>
              <div className="col-sm-6 text-right pt-0">
                  <span className="small text-muted">
                    {moment(receipt.createdAt).format('hh:mm DD/MM/yyyy')}
                  </span>
              </div>
            </div>
            <div className="d-inline-flex px-3 w-100 mt-4 mb-2"> 
              <div className="col-sm-4 border-bottom px-0"><span className="font-weight-bold text-uppercase">Tên sản phẩm</span></div>
              <div className="col-sm-4 border-bottom  text-right px-0">
                <span className="font-weight-bold text-uppercase mr-4">SL</span>
                <span className="font-weight-bold text-uppercase">Đơn giá</span>
                </div>
              <div className="col-sm-4 border-bottom text-right px-0"><span className="font-weight-bold text-uppercase ">thành tiền</span></div>
            </div>
            {receipt.listProduct && receipt.listProduct.map((p => {
              return (
                <div className="d-inline-flex px-3 w-100 py-1">
                    <div className="col-sm-5 border-bottom px-0">
                      <span className="text-uppercase">{p.name}</span>
                    </div>
                    <div className="col-sm-1 border-bottom px-0">
                    x {p.quantity}
                    </div>
                    <div className="col-sm-2 border-bottom px-0 text-right">
                      <span className="">{Number(p.price).toLocaleString()}</span>
                    </div>
                    <div className="col-sm-4 border-bottom px-0 text-right">
                      <span className="text-uppercase">{Number(p.price*p.quantity).toLocaleString()}</span>
                    </div>
                </div>
              )
            }))}
            <div className="d-inline-flex px-3 w-100 mt-4 my-2">
              <div className="col-sm-4 px-0"><span className="font-weight-bold text-uppercase">tổng cộng</span></div>
              <div className="col-sm-4 text-center px-0"><span className="font-weight-bold">VND</span></div>
              <div className="col-sm-4 text-right px-0"><span className="font-weight-bold ">{Number(receipt.totalAmount).toLocaleString()}</span></div>
            </div>
            <div className="d-inline-flex px-3 w-100 my-1">
              <div className="col-sm-4 px-0"><span className=" text-uppercase">Phụ phí</span></div>
              <div className="col-sm-4 text-center px-0"><span className=""></span></div>
              <div className="col-sm-4 text-right px-0"><span className="">{Number(receipt.additionalFee).toLocaleString()}</span></div>
            </div>
            <div className="d-inline-flex px-3 w-100 my-1">
              <div className="col-sm-4 px-0"><span className=" text-uppercase">Discount</span></div>
              <div className="col-sm-4 text-center px-0"><span className=""></span></div>
              <div className="col-sm-4 text-right px-0"><span className="">{Number(receipt.discount).toLocaleString()}</span></div>
            </div>
            <div className="d-inline-flex px-3 w-100 mt-3 border-top">
              <div className="col-sm-4 px-0"><span className="font-weight-bold text-uppercase ">Thanh toán</span></div>
              <div className="col-sm-4 text-center px-0"><span className="font-weight-bold">VND</span></div>
              <div className="col-sm-4 text-right px-0"><span className="font-weight-bold ">{Number(receipt.total).toLocaleString()}</span></div>
            </div>
            <div className="d-inline-flex px-3 w-100 my-2">
              <div className="col-sm-4 px-0"><span className=" text-uppercase">cash</span></div>
              <div className="col-sm-4 text-center px-0"><span className=""></span></div>
              <div className="col-sm-4 text-right px-0"><span className="">{Number(receipt.cash).toLocaleString()}</span></div>
            </div>
            <div className="d-inline-flex px-3 w-100 my-1">
              <div className="col-sm-4 px-0"><span className=" text-uppercase">change</span></div>
              <div className="col-sm-4 text-center px-0"><span className=""></span></div>
              <div className="col-sm-4 text-right px-0"><span className="">{Number(receipt.change).toLocaleString()}</span></div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ReceiptDetail
