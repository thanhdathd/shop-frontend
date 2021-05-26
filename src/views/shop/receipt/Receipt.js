import React, { useEffect, useState, createRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody, CDataTable, CBadge, CButton, CPagination, CListGroup,
  CFormGroup, CInputRadio, CLabel, CSelect
} from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import axios from 'axios'
import moment from 'moment';

//import { DocsLink } from 'src/reusable'

const HOST = 'http://localhost:5000'
const PER_PAGE = 10;


const fields = [
    {key: 'id', _style: {width: '5%'}},
    {key: 'name', _style: {width: '20%'}},
    {key: 'content', label: 'Content', _style: {width: '25%'}},
    {key: 'price', label: 'Payment',  _style: {width: '15%'}},
    {key: 'status', _style: {width: '10%'}},
    {key: 'action', _style: {width: '15%'}},
]


const Receipt = () => {
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const _currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)

const [listReceipt, setListReceipt] = useState([])
const [page, setPage] = useState(_currentPage)
const [filter, setFilter] = useState('all')
const [orderBy, setOrderBy] = useState('DESC')
const [totalPage, setTotalPage] = useState(1)


useEffect(() => {
    _currentPage !== page && setPage(_currentPage)
  }, [_currentPage, page])

useEffect(() => {
    getPageData(page, filter, orderBy)
}, [page, filter, orderBy])

const getPageData = (page, filter, orderBy) => {
    console.log('--> getPage: page'+page+', fil:'+filter+", by:"+orderBy)
    axios.get(`${HOST}/api/receipt/list?page=${page}&size=${PER_PAGE}&filter=${filter}&order=${orderBy}`)
    .then(res => {
        if(res.status == 200){
            console.log('tai list thanh cong');
            preProcess(res.data.items)
            console.log('---->'+JSON.stringify(res.data.items[0]))
            setListReceipt(res.data.items)
            setTotalPage(res.data.totalPages)
        }else{
            console.log('tai hoa don loi')
        }
    }).catch(e => console.log('err:'+e.message))
}

const preProcess = (listData) => {
  listData.forEach(d => {
    d.time = moment(d.createdAt).format('hh:mm DD/MM/yyyy');
    var price = 0
   var content = ''
   var count = 0;
    var len = d.listProduct.length
    d.listProduct.forEach(p => {
      price += p.price;
      content = content + p.name + ' x'+p.quantity;
     if(count < len-1) content = content + ", ";
     count = count + 1;
    });
    d.price = price
    if(content.length > 60){
        d.content = content.slice(0, 60)+"..."
    }else{
        d.content = content
    }
  })
}

const getStatusColor = (status) => {
    switch(status){
        case 'new' : return 'secondary'
        case 'done' : return 'success'
        case 'carry' : return 'light'
        default: return 'info'
    }
}

const pageChange = newPage => {
    if(newPage == 0) newPage = 1
    _currentPage !== newPage && history.push(`/shop/order?page=${newPage}`)
    //if(_currentPage !== newPage) setPage(newPage)
}

const handleFilterChange = (evt) => {
    filter !== evt.target.value && setFilter(evt.target.value)
}

const handleSelect = (evt) => {
    setOrderBy(evt.target.value)
}

//console.log(new Intl.DateTimeFormat('en-US', options).format(date));

  return (
    <>
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        <CRow>
                            <CCol sm="4">
                                <h2>Hóa đơn</h2>
                            </CCol>
                            <CCol sm="2" className="text-right my-auto">
                                <CLabel htmlFor="selectSm">Sắp xếp</CLabel>
                            </CCol>
                            <CCol sm="2"  className="py-2">
                                <CSelect custom  name="selectSm" id="SelectLm" onChange={handleSelect}>
                                    <option selected value="DESC">Mới nhất</option>
                                    <option value="ASC">Cũ nhất</option>
                                </CSelect>
                            </CCol>
                            <CCol sm="2" className="text-right my-auto">
                                <CLabel htmlFor="selectSm">Lọc theo</CLabel>
                            </CCol>
                            <CCol sm="2"  className="py-2">
                                <CSelect custom name="selectSm" id="SelectLm" onChange={handleFilterChange}>
                                    <option selected value="today">Hôm nay</option>
                                    <option value="yesterday">Hôm qua</option>
                                    <option value="this_week">Tuần này</option>
                                    <option value="last_week">Tuần trước</option>
                                    <option value="this_month">Tháng này</option>
                                    <option value="last_month">Tháng trước</option>
                                    <option value="all_time">Tất cả</option>
                                </CSelect>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={listReceipt}
                            fields={fields}
                            itemsPerPage={PER_PAGE}
                            scopedSlots = {{
                                'id': (item) => (
                                    <td className='small'>
                                        {item.id}
                                    </td>
                                ),
                                'name': (item) => (
                                    <td style={{padding: 5}}>
                                        <div className="font-weight-bold">{item.name}</div>
                                        <div className="small text-muted">Staff: {item.staffName}</div>
                                        <div className="small text-muted">{item.time}</div>
                                    </td>
                                ),
                                'content': (item) => (
                                    <td>
                                        <p className="small text-muted">
                                            {item.content}
                                        </p>
                                    </td>
                                ),
                                'price': (item) => (
                                    <td>
                                        <div className="font-weight-bold text-muted">{Number(item.total).toLocaleString()} đ</div>
                                    </td>
                                ),
                                'status':
                                (item)=>(
                                    <td>
                                    <CBadge color={getStatusColor(item.status)}>
                                        {item.status}
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

export default Receipt
