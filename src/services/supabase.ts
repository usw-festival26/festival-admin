import { SupabaseClient, createClient } from '@supabase/supabase-js'

const BUCKET = 'images'
const MAX_BYTES = 5 * 1024 * 1024

export type UploadFolder = 'booths' | 'lost-items' | 'menus'

const ALLOWED_FOLDERS: ReadonlySet<UploadFolder> = new Set(['booths', 'lost-items', 'menus'])
const ALLOWED_MIME: ReadonlySet<string> = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])
const ALLOWED_EXT: ReadonlySet<string> = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif'])
const PATH_PATTERN = /^(booths|lost-items|menus)\/[a-f0-9-]+\.(jpg|jpeg|png|webp|gif)$/i

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
  if (!ALLOWED_FOLDERS.has(folder)) {
    throw new Error('허용되지 않은 업로드 폴더입니다.')
  }
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error('지원하지 않는 이미지 형식입니다. (JPG, PNG, WEBP, GIF만 가능)')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('파일 크기는 5MB 이하여야 해요.')
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error('지원하지 않는 확장자입니다. (.jpg, .jpeg, .png, .webp, .gif만 가능)')
  }

  // 클라이언트 검증은 우회 가능합니다. 동일 제한이 Supabase Storage 정책(RLS)/백엔드에서도
  // 강제되어야 하며, 가능하면 서버에서 매직바이트 검증을 추가해야 합니다.
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
  if (!path || !PATH_PATTERN.test(path)) return null
  return path
}
