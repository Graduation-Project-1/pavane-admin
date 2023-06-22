import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.scss'

export default function Sidebar() {
  return <>
    <div className="sidebar">
      <ul>
        <li><NavLink to="/admins" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Admins</div></NavLink></li>
        <li><NavLink to="/brands" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Brands</div></NavLink></li>
        <li><NavLink to="/items" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Items</div></NavLink></li>
        <li><NavLink to="/collections" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Collections</div></NavLink></li>
        <li><NavLink to="/sale" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Sale</div></NavLink></li>
        <li><NavLink to="/categories" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Categories</div></NavLink></li>
        <li><NavLink to="/advertisements" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Advertisements</div></NavLink></li>
        <li><NavLink to="/customers" className={(navData) => navData.isActive ? 'active' : 'not-active'}><div>Customers</div></NavLink></li>
      </ul>
    </div>
  </>
}
