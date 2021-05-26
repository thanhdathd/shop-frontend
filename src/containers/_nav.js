import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Tổng quan',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Shop']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Nguyên Liệu',
    to: '/shop/nguyenlieu',
    icon: 'cil-drop',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Đồ uống',
    to: '/shop/product',
    icon: 'cil-pencil',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Order',
    to: '/shop/order',
    icon: 'cil-pencil',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Hóa đơn',
    to: '/shop/receipt',
    icon: 'cil-calculator',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Nhân viên']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý',
    route: '/base',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Menu 1',
        to: '/base/breadcrumbs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Menu 2',
        to: '/base/cards',
      }
    ],
  },
]

export default _nav
