import { SupabaseClient, createClient } from '@supabase/supabase-js'

const BUCKET = 'images'
const MAX_BYTES = 5 * 1024 * 1024

export type UploadFolder = 'booths' | 'lost-items' | 'menus'

export interface UploadedImage {
  publicUrl: string
  path: string
}

let cached: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (cached) return cached
  const url = import.meta.env.VITE_SUPABASE_URL ?? ''
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
  if (!url || !anonKey) {
    throw new Error(
      'Supabase 환경변수가 없습니다. .env에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 설정한 뒤 dev 서버를 재시작해주세요.',
    )
  }
  cached = createClient(url, anonKey)
  return cached
}

export async function uploadImage(file: File, folder: UploadFolder): Promise<UploadedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드할 수 있어요.')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('파일 크기는 5MB 이하여야 해요.')
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await getClient()
    .storage.from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw new Error(`업로드 실패: ${error.message}`)

  const { data } = getClient().storage.from(BUCKET).getPublicUrl(path)
  return { publicUrl: data.publicUrl, path }
}

export async function removeImage(path: string): Promise<void> {
  await getClient().storage.from(BUCKET).remove([path])
}

export function pathFromPublicUrl(publicUrl: string | null | undefined): string | null {
  if (!publicUrl) return null
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  const path = publicUrl.slice(idx + marker.length)
  return path || null
}
