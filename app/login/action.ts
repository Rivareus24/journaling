'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const token = (formData.get('token') as string)?.trim()
  const secret = process.env.DIARY_TOKEN

  if (!secret || token !== secret) {
    redirect('/login?error=1')
  }

  cookies().set('diary_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  redirect('/')
}
