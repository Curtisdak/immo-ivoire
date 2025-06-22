"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import React from 'react'


const AdminPage =  () => {

  const {data:Session} =  useSession() 
  const router = useRouter()

 

  const currentUser = Session?.user

  if(currentUser?.role.includes("USER")){
    return router.push("/pages/error")
  }
  return (
    <div>
      <h1>{currentUser?.email}</h1>
      
    </div>
  )
}

export default AdminPage
