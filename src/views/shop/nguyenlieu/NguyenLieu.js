import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CDataTable,
  CBadge, CPagination, CNav, CNavItem, CNavLink, CButton, CCollapse
} from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import axios from 'axios'

const HOST = 'http://localhost:5000'
const perPage = 10; // item per page


const ThemeView = () => {
  const [color, setColor] = useState('rgb(255, 255, 255)')
  const ref = createRef()

  useEffect(() => {
    const el = ref.current.parentNode.firstChild
    const varColor = window.getComputedStyle(el).getPropertyValue('background-color')
    setColor(varColor)
  }, [ref])

  return (
    <table className="table w-100" ref={ref}>
      <tbody>
      <tr>
        <td className="text-muted">HEX:</td>
        <td className="font-weight-bold">{ rgbToHex(color) }</td>
      </tr>
      <tr>
        <td className="text-muted">RGB:</td>
        <td className="font-weight-bold">{ color }</td>
      </tr>
      </tbody>
    </table>
  )
}

const ThemeColor = ({className, children}) => {
  const classes = classNames(className, 'theme-color w-75 rounded mb-3')
  return (
    <CCol xl="2" md="4" sm="6" xs="12" className="mb-4">
      <div className={classes} style={{paddingTop: '75%'}}></div>
      {children}
      <ThemeView/>
    </CCol>
  )
}

const fields = [{key: 'id', _style: {width: '5%'}}, 'name',
 {key: 'quantity', _style: { width: '10%'}},
 {key: 'unit', _style: {width: '10%'}}, 
{key: 'status', _style:{width: '5%'}},
{
  key: 'row_action',
  label: 'Action',
  _style: { width: '1%' },
  sorter: false,
  filter: false
}];

const NguyenLieu = () => {
  const [materialList, setMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [catList, setCatList] = useState([]);
  const [activeCat, setActiveCat] = useState(-1)
  const [catId, setCatId] = useState(-1)
  const [editIdx, setEditIdx] = useState([])

  useEffect(() => {
    console.log(' Bat dau load nguyen lieu')
    loadDataPage(currentPage, catId)
  }, [currentPage, catId])

  const loadDataPage = (page, catId) => {
    axios.get(`${HOST}/api/material/list?page=${page}&size=${perPage}&cat=${catId}`)
    .then(res => {
      if(res.status == 200){
        console.log('tai data nguyen lieu thanh cong')
        console.log(JSON.stringify(res.data))
        setMaterials(res.data.items)
        setTotalPage(res.data.totalPages)
      }else{
        console.log('load nguyen lieu ko thanh cong')
      }
    })
    .catch(err => console.log('fail to load material'))
  }

  useEffect(() => {
    loadCat()
  }, [])

  const loadCat = () => {
    axios.get(`${HOST}/api/materialcat/list`)
    .then(res => {
      if(res.status == 200){
        console.log(JSON.stringify(res.data.materialCat))
        setCatList(res.data.materialCat)
      }else{
        console.log('Load material category list err')
      }
    })
    .catch(err => console.log('Load material category list err: '+err))
  }

  const navClick = (idx, catId) => {
    setActiveCat(idx)
    setCatId(catId)
  }

  const toggleEdit = (index) => {
    const position = editIdx.indexOf(index)
    let newEditIdx = editIdx.slice()
    if (position !== -1) {
      newEditIdx.splice(position, 1)
    } else {
      newEditIdx = [...editIdx, index]
    }
    setEditIdx(newEditIdx)
  }

  const getBadge = (status)=>{
    if(status > 5) return 'success'
    else if (status > 2) return 'warning'
    else return 'danger'

    // switch (status) {
    //   case 'Active': return 'success'
    //   case 'Inactive': return 'secondary'
    //   case 'Pending': return 'warning'
    //   case 'Banned': return 'danger'
    //   default: return 'primary'
    // }
  }

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <CRow >
                <CCol sm="12" lg="4">
                  <h2>Nguyên Liệu</h2>
                </CCol>
                <CCol sm="12" lg="8" >
                  <CNav variant="pills" className='border border-bg-gray-300 justify-content-end' style={{width: '100%', justifyContent: 'right'}}>
                      <CNavItem>
                        <CNavLink onClick={() => navClick(-1, -1)} active={activeCat === -1}>Tất cả</CNavLink>
                      </CNavItem>
                    {catList.map((cat, idx )=> {
                       return (
                       <CNavItem style={{marginLeft: 10}}>
                        <CNavLink active={idx === activeCat} onClick={() => navClick(idx, cat.id)}>{cat.name}</CNavLink>
                      </CNavItem>
                      )
                    })}
                  </CNav>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={materialList}
              fields={fields}
              itemsPerPage={perPage}
              sorter
              scopedSlots = {{
                'status':
                  (item)=>(
                    <td>
                      <CBadge color={getBadge(item.quantity)}>
                        {item.quantity > 5 ? 'good': 'bad'}
                      </CBadge>
                    </td>
                  ),
                  'row_action':
                    (item, index)=>{
                      return (
                        <td className="py-2">
                          <CButton
                            color="primary"
                            variant="outline"
                            shape="square"
                            size="sm"
                            onClick={()=>{toggleEdit(index)}}
                          >
                            {editIdx.includes(index) ? 'Lưu' : 'Sửa'}
                          </CButton>
                        </td>
                        )
                    },
                    'details':
                      (item, index)=>{
                        return (
                        <CCollapse show={editIdx.includes(index)}>
                          <CCardBody>
                            <h4>
                              {item.name}
                            </h4>
                            <p className="text-muted">User since: {item.updatedAt}</p>
                            <CButton size="sm" color="info">
                              User Settings
                            </CButton>
                            <CButton size="sm" color="danger" className="ml-1">
                              Delete
                            </CButton>
                          </CCardBody>
                        </CCollapse>
                      )
                    }  

              }}
            />
            <CPagination
                activePage={currentPage}
                pages={totalPage}
                onActivePageChange={(i) => setCurrentPage(i)}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CCard>
        <CCardHeader>
          Theme colors
        </CCardHeader>
        <CCardBody>
          <CRow>
            <ThemeColor className="bg-primary">
              <h6>Brand Primary Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-secondary">
              <h6>Brand Secondary Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-success">
              <h6>Brand Success Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-danger">
              <h6>Brand Danger Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-warning">
              <h6>Brand Warning Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-info">
              <h6>Brand Info Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-light">
              <h6>Brand Light Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-dark">
              <h6>Brand Dark Color</h6>
            </ThemeColor>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>
          Grays
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <ThemeColor className="bg-gray-100">
              <h6>Gray 100 Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-gray-200">
              <h6>Gray 200 Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-gray-300">
              <h6>Gray 300 Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-gray-400">
              <h6>Gray 400 Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-gray-500">
              <h6>Gray 500 Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-gray-600">
              <h6>Gray 600 Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-gray-700">
              <h6>Gray 700 Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-gray-800">
              <h6>Gray 800 Color</h6>
            </ThemeColor>
            <ThemeColor className="bg-gray-900">
              <h6>Gray 900 Color</h6>
            </ThemeColor>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default NguyenLieu
