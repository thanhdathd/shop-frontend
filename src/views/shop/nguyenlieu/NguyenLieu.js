import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CDataTable,
  CBadge, CPagination, CNav, CNavItem, CNavLink, CButton, CCollapse,
  CFormGroup, CLabel, CInput, CSelect,
  CToaster, CToast, CToastHeader, CToastBody,
  CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle
} from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const HOST = 'http://localhost:5000'
const perPage = 10; // item per page


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
  const [editingRow, setEditingRow] = useState({name: '-none-', quantity: 0, unit: 'unkonw'});
  const [toasts, setToasts] = useState([])
  const [editCount, setEditCount] = useState(0)
  const [modalShow, setModalShow] = useState(false)

  useEffect(() => {
    console.log(' Bat dau load nguyen lieu')
    loadDataPage(currentPage, catId)
  }, [currentPage, catId, editCount])

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

  const handleNameChange = (evt) => {
    const newEditdata = {...editingRow}
    newEditdata.name = evt.target.value
    setEditingRow(newEditdata)
  }

  const handleQuantityChange = (evt) => {
    const newEditdata = {...editingRow}
    newEditdata.quantity = evt.target.value
    setEditingRow(newEditdata)
  }

  const handleUnitChange = (evt) => {
    const newEditdata = {...editingRow}
    newEditdata.unit = evt.target.value
    setEditingRow(newEditdata)
  }

  const handleSelect = (evt) => {
    console.log('you select id:'+evt.target.value)
    const newEditdata = {...editingRow}
    newEditdata.catId = evt.target.value
    setEditingRow(newEditdata)
  }

  const deleteRow = (item, index) => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn xóa',
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            axios.post(`${HOST}/api/material/delete`, {
              id: item.id
            }).then(res => {
              if(res.status == 200){
                addToast('Thông báo', `Xóa dữ liệu thành công`)
                setEditCount(editCount+1)
                toggleEdit(index)
              }else{
                addToast('Thông báo', `Có lỗi xảy ra`, 'danger')
              }
            }).catch(err => {
              addToast('Thông báo', `Có lỗi xảy ra: ${err.message}`, 'danger')
            })
          }
        },
        {
          label: 'Không',
          onClick: () => console.log('Click No')
        }
      ]
    });
  }

  const saveEditedRow = (oldItem, idx) => {
    if (editingRow.name == ''){
      editingRow.name = oldItem.name
    }
    if(editingRow.quantity < 0){
      editingRow.quantity = oldItem.quantity
    }
    if(editingRow.unit == ''){
      editingRow.unit = oldItem.unit
    }
    axios.post(`${HOST}/api/material/update`, {
      id: oldItem.id,
      name: editingRow.name,
      quantity: editingRow.quantity,
      unit: editingRow.unit,
      catId: editingRow.catId
    })
    .then(res => {
      if(res.status == 200){
        // toast something
        addToast('Thông báo', `Cập nhật dữ liệu thành công`)
        console.log('cap nhat thanh cong')
        toggleEdit(idx)
        setEditCount(editCount + 1)
      }
    })
    .catch(err => console.log('cap nhat nguyen lieu ko thanh cong:'+err.message));
  }

  const addToast = (title, message, color = 'success') => {
    setToasts([
      ...toasts, 
      { position: 'bottom-right', autohide: 2000, closeButton: true, fade: true, title, message, color }
    ])
  }

  const toasters = (()=>{
    return toasts.reduce((toasters, toast) => {
      toasters[toast.position] = toasters[toast.position] || []
      toasters[toast.position].push(toast)
      return toasters
    }, {})
  })()

  const handleAddMaterial = (evt) => {
    setEditingRow({name: '', quantity: 0, unit: '', catId: 1})
    setModalShow(true)
  }

  const addMaterial = () => {
    setModalShow(false)
    console.log('object:'+JSON.stringify(editingRow))
    axios.post(`${HOST}/api/material/create`,{
      name: editingRow.name,
      quantity: editingRow.quantity,
      unit: editingRow.unit,
      catId: editingRow.catId
    }).then( res => {
      if(res.status == 200){
        addToast('Thông báo', 'Thêm dữ liệu thành công')
        setEditCount(editCount+1)
      }else{
        addToast('Thông báo', 'Thêm dữ liệu không thành công', 'danger')
      }
    }).catch(err => {
      console.log("err: "+err.message)
      addToast('Thông báo', err.message, 'danger')
    })
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
                            onClick={()=>{
                              editingRow.name = item.name
                              editingRow.quantity = item.quantity
                              editingRow.unit = item.unit
                              toggleEdit(index)
                            }}
                          >
                            {editIdx.includes(index) ? 'Xong' : 'Sửa'}
                          </CButton>
                        </td>
                        )
                    },
                    'details':
                      (item, index)=>{
                        return (
                        <CCollapse show={editIdx.includes(index)}>
                          <CCardBody>
                            <CFormGroup row className="my-0">
                              <CCol xs="5">
                                <CFormGroup>
                                  <CLabel htmlFor="city">Tên</CLabel>
                                  <CInput value={editingRow.name}
                                    onChange={handleNameChange} placeholder="Tên nguyên liệu" />
                                </CFormGroup>
                              </CCol>
                              <CCol xs="3">
                                <CFormGroup>
                                  <CLabel htmlFor="postal-code">Phân loại</CLabel>
                                    <CSelect name="selectSm" id="SelectLm" onChange={handleSelect}>
                                      {catList.map((cat, idx) => {
                                        return <option selected={cat.id == item.catId} value={cat.id}>{cat.name}</option>
                                      })}
                                    </CSelect>
                                </CFormGroup>
                              </CCol>
                              <CCol xs="2">
                                <CFormGroup>
                                  <CLabel htmlFor="postal-code">Số lượng</CLabel>
                                  <CInput value={editingRow.quantity} type="number" 
                                  onChange={handleQuantityChange} placeholder="số lượng" />
                                </CFormGroup>
                              </CCol>
                              <CCol xs="2">
                                <CFormGroup>
                                  <CLabel htmlFor="postal-code">Đơn vị</CLabel>
                                  <CInput value={editingRow.unit} 
                                  onChange={handleUnitChange} placeholder="nhập đơn vị" />
                                </CFormGroup>
                              </CCol>
                            </CFormGroup>
                            <CRow className="justify-content-end pr-3">
                              <CButton size="md" color="info" onClick={()=>{saveEditedRow(item, index)}}>
                                Lưu lại
                              </CButton>
                              <CButton size="md" onClick={() => {deleteRow(item, index)}} color="danger" className="ml-3">
                                Xóa
                              </CButton>
                            </CRow>
                          </CCardBody>
                        </CCollapse>
                      )
                    }  

              }}
            />
            <CRow>
              <CPagination
                  className="col-sm-6"
                  activePage={currentPage}
                  pages={totalPage}
                  onActivePageChange={(i) => setCurrentPage(i)}
              />
              <CCol col="6" className="text-right">
                <CButton color="primary" onClick={handleAddMaterial}>
                  Thêm nguyên liệu
                </CButton>
              </CCol>
            </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
      <CCol sm="12" lg="6">
              {Object.keys(toasters).map((toasterKey) => (
                <CToaster
                  position={toasterKey}
                  key={'toaster' + toasterKey}
                >
                  {
                    toasters[toasterKey].map((toast, key)=>{
                    return(
                      <CToast
                      className={`border border-${toast.color}`}
                        key={'toast' + key}
                        show={true}
                        autohide={toast.autohide}
                        fade={toast.fade}
                      >
                        <CToastHeader closeButton={toast.closeButton}>
                          {toast.title}
                        </CToastHeader>
                        <CToastBody >
                          {toast.message}
                        </CToastBody>
                      </CToast>
                    )
                  })
                  }
                </CToaster>
              ))}
            </CCol>
        <CModal 
          show={modalShow} 
          onClose={setModalShow}
        >
          <CModalHeader closeButton>
            <CModalTitle>Thêm nguyên liệu</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormGroup row className="my-0">
              <CCol xs="8">
                <CFormGroup>
                  <CLabel htmlFor="city">Tên</CLabel>
                  <CInput value={editingRow.name}
                    onChange={handleNameChange} placeholder="Tên nguyên liệu" />
                </CFormGroup>
              </CCol>
              <CCol xs="4">
                <CFormGroup>
                  <CLabel htmlFor="postal-code">Phân loại</CLabel>
                    <CSelect name="selectSm" id="SelectLm" onChange={handleSelect}>
                      {catList.map((cat, idx) => {
                        return <option selected={idx == 0} value={cat.id}>{cat.name}</option>
                      })}
                    </CSelect>
                </CFormGroup>
              </CCol>
                <CCol xs="8">
                  <CFormGroup>
                    <CLabel htmlFor="postal-code">Số lượng</CLabel>
                    <CInput type="number" value={editingRow.quantity}
                    onChange={handleQuantityChange} placeholder="số lượng" />
                  </CFormGroup>
                </CCol>
                <CCol xs="4">
                  <CFormGroup>
                    <CLabel htmlFor="postal-code">Đơn vị</CLabel>
                    <CInput value={editingRow.unit}
                    onChange={handleUnitChange} placeholder="nhập đơn vị" />
                  </CFormGroup>
                </CCol>
            </CFormGroup>
          </CModalBody>
          <CModalFooter>
            <CButton onClick={addMaterial} color="primary">Thêm nguyên liệu</CButton>{' '}
            <CButton 
              color="secondary" 
              onClick={() => setModalShow(false)}
            >Hủy bỏ</CButton>
          </CModalFooter>
        </CModal>
      </CRow>

    </>
  )
}

export default NguyenLieu
