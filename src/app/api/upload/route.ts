import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const taskId = formData.get('task_id') as string

  if (!file || !taskId) {
    return NextResponse.json({ error: 'Missing file or task_id' }, { status: 400 })
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 50MB.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const path = `${taskId}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(path, file, { upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from('attachments').getPublicUrl(path)

  const { data, error } = await supabase
    .from('attachments')
    .insert({
      task_id: taskId,
      uploaded_by: user.id,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: path,
      url: publicUrl,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
