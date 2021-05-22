import React, { useEffect, useState, createRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody, CDataTable, CBadge, CPagination, CButton,
  CLabel, CFormGroup, CInputRadio
} from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import axios from 'axios'
//import { DocsLink } from 'src/reusable'

const HOST = 'http://localhost:5000'
const PER_PAGE = 10;

const fields = [
    {key:'id', _style:{width: '5%'}},
    {key:'image', _style: {width: '10%'}},
    {key:'name', _style: {width: '30%'}},
    {key:'price', _style: {width: '25%'}},
    {key:'status', _style: {width: '10%'}},
    {key:'action',
    label: 'Thao tác',
    _style:{width: '10%'},
    }]

const SanPham = () => {
    const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const _currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)

    const [listProduct, setListProduct] = useState([])
    const [page, setPage] = useState(_currentPage)
    const [totalPage, setTotalPage] = useState(1)
    const [catId, setCatId] = useState(-1)
    const [catList, setCatList] = useState([])


    useEffect(() => {
        _currentPage !== page && setPage(_currentPage)
      }, [_currentPage, page])

    useEffect(() => {
        getPageData(page, catId)
    }, [page, catId])

    useEffect(() => {
        axios.get(`${HOST}/api/category/list`)
        .then(res => {
            if (res.status === 200) {
                setCatList(res.data.categories)
            } else {
                console.log('load list category product fail')
            }
        })
        .catch(e => console.log(e.message))
    }, [])

    const pageChange = newPage => {
        _currentPage !== newPage && history.push(`/shop/product?page=${newPage}`)
        //if(_currentPage !== newPage) setPage(newPage)
    }


    const getPageData = (page, cat) => {
        axios.get(`${HOST}/api/product/list?page=${page}&size=${PER_PAGE}&cat=${cat}`)
        .then(res => {
            if(res.status == 200){
                console.log('product ok:'+JSON.stringify(res.data.items))
                processList(res.data.items)
                setListProduct(res.data.items)
                setTotalPage(res.data.totalPages)
            }else{
                console.log('product fail')
            }
        }).catch(err => {
            console.log('product fail:'+err.message)
        })
    }

    const processList = (list) => {
        list.map((item, index) => {
            item.optionString = getOption(item.options)
            item.price = getPrice(item.options)
        })
    }

    const getOption = (options) => {
        const n = options.length
        var name = ""
        for(let i = 0; i < n; i++){
            name = name + options[i].name
            if(i < n-1){
                name = name + ', '
            }
        }
        return name;
    }

    const getPrice = (options) => {
        var price = 0
        options.forEach(op => {
            console.log('get op: id:'+op.id)
            console.log('get op: price:'+op.price)
            if(op.id === 0){
                 return price = op.price
            }
        });
        return price
    }

    const handleAddProduct = () => {
        console.log('you click mememmeme')
    }

  return (
    <>
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        <CRow>
                            <CCol sm="3">
                                <h2>Đồ uống</h2>
                            </CCol>
                            <CCol sm="9" className="py-2 text-right">
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
                                
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={listProduct}
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
                                        <div className="small text-muted">Options: {item.optionString}</div>
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
                                            onClick={() => history.push(`/shop/product/${item.id}`)}
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
                            <CButton color="primary" onClick={handleAddProduct}>
                            Thêm sản phẩm
                            </CButton>
                        </CCol>
                    </CRow>
                </CCard>
            </CCol>
        </CRow>
    </>
  )
}

export default SanPham
