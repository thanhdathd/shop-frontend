import React, { useEffect, useState, createRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody, CDataTable, CBadge, CPagination, CButton,
  CLabel, CFormGroup, CInputRadio, CListGroup
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
    const queryCat = useLocation().search.match(/cat=([0-9]+)/, '')
    const _currentCat = Number(queryCat && queryCat[1] ? queryCat[1] : -1)

    const [listProduct, setListProduct] = useState([])
    const [page, setPage] = useState(_currentPage)
    const [totalPage, setTotalPage] = useState(1)
    const [catId, setCatId] = useState(_currentCat)
    const [catList, setCatList] = useState([])


    useEffect(() => {
        _currentPage !== page && setPage(_currentPage)
      }, [_currentPage, page])

    useEffect(() => {
        _currentCat !== catId && setCatId(_currentCat)
    }, [_currentCat, catId])

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
        if(newPage == 0) newPage = 1
        _currentPage !== newPage && history.push(`/shop/product?page=${newPage}&cat=${catId}`)
        //if(_currentPage !== newPage) setPage(newPage)
    }


    const getPageData = (page, cat) => {
        axios.get(`${HOST}/api/product/list?page=${page}&size=${PER_PAGE}&cat=${cat}`)
        .then(res => {
            if(res.status == 200){
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
            if(op.id === 0){
                 return price = op.price
            }
        });
        return price
    }

    const handleAddProduct = () => {
        //console.log('you click mememmeme')
        
    }

    const handleFilterChange = (evt) => {
        console.log('you select:'+evt.target.value)
        setCatId(evt.target.value)
        history.push(`/shop/product?page=${page}&cat=${evt.target.value}`)
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
                                <CInputRadio custom onChange={handleFilterChange}
                                    checked={catId == -1} id="inline-radio-1"
                                    name="inline-radios" value="-1" />
                                <CLabel variant="custom-checkbox" htmlFor="inline-radio-1">Tất cả</CLabel>
                                </CFormGroup>
                                {catList.map((element, index) => {
                                    return (
                                        <CFormGroup variant="custom-radio" inline>
                                            <CInputRadio custom onChange={handleFilterChange}
                                                checked={catId == element.id} id={"inline-radio"+element.id} name="inline-radios" value={element.id} />
                                            <CLabel variant="custom-checkbox" htmlFor={"inline-radio"+element.id}>{element.name}</CLabel>
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
