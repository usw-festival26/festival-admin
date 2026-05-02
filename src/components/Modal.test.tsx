import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

describe('Modal', () => {
  it('isOpen=false면 렌더하지 않는다', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="x">
        <span>content</span>
      </Modal>,
    )
    expect(screen.queryByText('content')).toBeNull()
  })

  it('aria 속성이 부여된다', () => {
    render(
      <Modal isOpen onClose={() => {}} title="제목">
        <input data-testid="i" />
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(labelledBy).not.toBeNull()
    if (labelledBy) {
      const heading = document.getElementById(labelledBy)
      expect(heading?.textContent).toBe('제목')
    }
  })

  it('Escape 키로 onClose 호출', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="t">
        <input />
      </Modal>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('닫기 버튼에 aria-label 이 있다', () => {
    render(
      <Modal isOpen onClose={() => {}} title="t">
        <span />
      </Modal>,
    )
    expect(screen.getByLabelText('닫기')).not.toBeNull()
  })
})
