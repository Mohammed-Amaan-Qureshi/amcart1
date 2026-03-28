'use client'
import { AppDispatch } from '@/redux/store'
import { setAllVendorsData } from '@/redux/vendorsSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function UseGetAllVendors() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=>{

    const fetchAllVendors = async ()=>{
        try {
            const result = await axios.get("/api/vendor/allVendor")
            dispatch(setAllVendorsData(result.data.vendors))
          } catch (error) {
            console.log(error)
            dispatch(setAllVendorsData([]))
        }

      }
        fetchAllVendors()

  },[])
}

export default UseGetAllVendors
