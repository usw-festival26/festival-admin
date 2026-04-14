import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-text">
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
