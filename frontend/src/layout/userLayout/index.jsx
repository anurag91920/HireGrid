import Navbar from '@/Componennts/Navbar'
import React from 'react'

const UserLayout = ({children}) => {
  return (
    <div>
      <Navbar/>
       {children}
    </div>
  )
}

export default UserLayout