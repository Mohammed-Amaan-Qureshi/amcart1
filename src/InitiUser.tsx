'use client'
import React from 'react'
import UseGetCurrentUser from './hooks/UseGetCurrentUser'
import UseGetAllVendors from './hooks/UseGetAllVendors'
import UseGetAllProductsData from './hooks/UseGetAllProductsData'
import UseGetAllOrders from './hooks/UseGetAllOrders'

function InitiUser() {
  UseGetCurrentUser()
  UseGetAllVendors()
  UseGetAllProductsData()
  UseGetAllOrders()
  return null
}

export default InitiUser
