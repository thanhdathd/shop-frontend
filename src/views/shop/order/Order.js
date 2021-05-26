import React, { useEffect, useState, createRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody, CDataTable, CBadge, CButton, CPagination
} from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import axios from 'axios'
import moment from 'moment';

//import { DocsLink } from 'src/reusable'

const HOST = 'http://localhost:5000'
const PER_PAGE = 10;


const fields = [
    {key: 'id', _style: {width: '5%'}},
    {key: 'image', _style: {width: '10%'}},
    {key: 'name', _style: {width: '30%'}},
    {key: 'option', _style: {width: '10%'}},
    {key: 'quantity', _style: {width: '10%'}},
    {key: 'price', label: 'Payment',  _style: {width: '10%'}},
    {key: 'status', _style: {width: '10%'}},
    {key: 'action', _style: {width: '15%'}},
]
const options = {
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric',
  hour12: false,
  timeZone: 'America/Los_Angeles'
};
const formater = new Intl.DateTimeFormat('en-US', options)


const Order = () => {
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const _currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)

const [listOrder, setListOrder] = useState([])
const [page, setPage] = useState(_currentPage)
const [filter, setFilter] = useState({})
const [orderBy, setOrderBy] = useState({key: 'date'})
const [totalPage, setTotalPage] = useState(1)


useEffect(() => {
    _currentPage !== page && setPage(_currentPage)
    var time = moment('2021-05-29T09:35:23.000Z').format('hh:mm DD/MM/yyyy')
    console.log('time:'+time)
  }, [_currentPage, page])

useEffect(() => {
    getPageData(page, filter, orderBy)
}, [page])

const getPageData = (page, filter, orderBy) => {
    axios.get(`${HOST}/api/order/list?page=${page}&size=${PER_PAGE}`)
    .then(res => {
        if(res.status == 200){
            console.log('tai orrder list thanh cong');
            preProcess(res.data.items)
            setListOrder(res.data.items)
            setTotalPage(res.data.totalPages)
        }else{
            console.log('tai order loi')
        }
    }).catch(e => console.log('err:'+e.message))
}

const preProcess = (listData) => {
  listData.forEach(d => {
    d.time = moment(d.createdAt).format('hh:mm DD/MM/yyyy');
    var price = 0
    d.listProduct.forEach(p => {
      price += p.price
    });
    d.price = price
  })
}

const pageChange = newPage => {
    _currentPage !== newPage && history.push(`/shop/order?page=${newPage}`)
    //if(_currentPage !== newPage) setPage(newPage)
}


//console.log(new Intl.DateTimeFormat('en-US', options).format(date));

  return (
    <>
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        <CRow>
                            <CCol sm="3">
                                <h2>Orders</h2>
                            </CCol>
                            {/* <CCol sm="9" className="py-2 text-right">
                                <CFormGroup variant="custom-radio" inline>
                                <CInputRadio custom checked id="inline-radio-1" name="inline-radios" value="-1" />
                                <CLabel variant="custom-checkbox" htmlFor="inline-radio1">Tất cả</CLabel>
                                </CFormGroup>
                                {catList.map((element, index) => {
                                    return (
                                        <CFormGroup variant="custom-radio" inline>
                                            <CInputRadio custom id={"inline-radio"+element.id} name="inline-radios" value={element.id} />
                                            <CLabel variant="custom-checkbox" htmlFor="inline-radio2">{element.name}</CLabel>
                                        </CFormGroup>
                                    )
                                })}
                                
                            </CCol> */}
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={listOrder}
                            fields={fields}
                            itemsPerPage={PER_PAGE}
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
                                        <div className="font-weight-bold">{item.name}</div>
                                        <div className="small text-muted">Staff: {item.staffName} | {item.time}</div>
                                    </td>
                                ),
                                'price': (item) => (
                                    <td>
                                        <div className="font-weight-bold text-muted">{item.price}</div>
                                    </td>
                                ),
                                'status':
                                (item)=>(
                                    <td>
                                    <CBadge color={'success'}>
                                        {'good'}
                                    </CBadge>
                                    </td>
                                ),
                                'action':
                                (item)=>(
                                    <td>
                                    <CButton
                                            color="success"
                                            variant="outline"
                                            shape="square"
                                            size="sm"
                                            onClick={() => history.push(`/shop/order/${item.id}`)}
                                        >
                                        Chi tiết
                                        </CButton> 
                                    </td>
                                )
                            }}
                        />
                    </CCardBody>
                    <CRow className="mx-3">
                        <CPagination
                            className="col-sm-6"
                            activePage={page}
                            pages={totalPage}
                            onActivePageChange={pageChange}
                        />
                        <CCol col="6" className="text-right">
                            {/* <CButton color="primary" onClick={handleAddProduct}>
                            Thêm sản phẩm
                            </CButton> */}
                        </CCol>
                    </CRow>
                </CCard>
            </CCol>
        </CRow>
 
    </>
  )
}

export default Order
