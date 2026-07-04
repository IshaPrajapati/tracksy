'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitContactMessage(formData: { name: string; email: string; company: string; message: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contact_messages')
    .insert([
      {
        name: formData.name,
        email: formData.email,
        company: formData.company || null,
        message: formData.message,
      }
    ])

  if (error) {
    console.error('Error inserting contact message:', error)
    return { success: false, error: 'Failed to send message. Please try again.' }
  }

  return { success: true }
}
