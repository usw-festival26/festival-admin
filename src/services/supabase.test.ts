import { describe, it, expect } from 'vitest'
import { pathFromPublicUrl, uploadImage, UploadFolder } from './supabase'

describe('uploadImage validation', () => {
  it('SVG MIME 차단', async () => {
    const file = new File(['<svg/>'], 'a.svg', { type: 'image/svg+xml' })
    await expect(uploadImage(file, 'booths')).rejects.toThrow(/형식/)
  })

  it('5MB 초과 거부', async () => {
    const big = new Uint8Array(6 * 1024 * 1024)
    const file = new File([big], 'a.jpg', { type: 'image/jpeg' })
    await expect(uploadImage(file, 'booths')).rejects.toThrow(/5MB/)
  })

  it('허용되지 않은 폴더 거부', async () => {
    const file = new File(['x'], 'a.jpg', { type: 'image/jpeg' })
    await expect(uploadImage(file, 'evil' as unknown as UploadFolder)).rejects.toThrow(/폴더/)
  })

  it('이미지 MIME이라도 위장 확장자 거부 (.exe)', async () => {
    const file = new File(['x'], 'a.exe', { type: 'image/jpeg' })
    await expect(uploadImage(file, 'booths')).rejects.toThrow(/확장자/)
  })

  it('HTML MIME 차단', async () => {
    const file = new File(['<html/>'], 'a.html', { type: 'text/html' })
    await expect(uploadImage(file, 'booths')).rejects.toThrow(/형식/)
  })
})

describe('pathFromPublicUrl', () => {
  it('정상 URL → 경로 추출', () => {
    const url =
      'https://abc.supabase.co/storage/v1/object/public/images/booths/11111111-1111-1111-1111-111111111111.jpg'
    expect(pathFromPublicUrl(url)).toBe('booths/11111111-1111-1111-1111-111111111111.jpg')
  })

  it('알 수 없는 폴더 → null', () => {
    const url = 'https://abc.supabase.co/storage/v1/object/public/images/evil/aaaa.jpg'
    expect(pathFromPublicUrl(url)).toBeNull()
  })

  it('확장자 화이트리스트 외 → null', () => {
    const url = 'https://abc.supabase.co/storage/v1/object/public/images/booths/aaaa.exe'
    expect(pathFromPublicUrl(url)).toBeNull()
  })

  it('null/undefined → null', () => {
    expect(pathFromPublicUrl(null)).toBeNull()
    expect(pathFromPublicUrl(undefined)).toBeNull()
  })

  it('마커 없는 URL → null', () => {
    expect(pathFromPublicUrl('https://example.com/foo/bar.jpg')).toBeNull()
  })
})
