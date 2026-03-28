import React from 'react'
import Slide from './Slide'
import CategorySlider from './CategorySlider'
import ProductCardPage from './ProductCardPage'
import ShopPage from '@/app/shop/page'

function UserDashboard() {
  return (
    <div  className="min-h-screen w-full flex flex-col justify-center items-center bg-linear-to-br from-gray-700 via-black to-gray-900 overflow-x-hidden text-white">

        <Slide />
        <CategorySlider />
        <ProductCardPage />
        <ShopPage />
    </div>
  )
}

export default UserDashboard
