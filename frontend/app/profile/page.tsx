"use client"

import { useRouter } from 'next/navigation'
import React from 'react'

const ProfilePage = () => {
    const route = useRouter()
    return route.push('/profile/@me')
}

export default ProfilePage