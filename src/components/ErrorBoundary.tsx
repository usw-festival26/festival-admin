import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children
    return (
      <div role="alert" className="error-boundary">
        <h1>문제가 발생했습니다.</h1>
        <p>일시적인 오류로 화면을 표시할 수 없습니다. 새로고침 후 다시 시도해주세요.</p>
        <button type="button" className="btn-black" onClick={this.handleReload}>
          새로고침
        </button>
      </div>
    )
  }
}
