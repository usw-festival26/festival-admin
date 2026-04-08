const VARIANTS = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  black: 'bg-gray-900 text-white hover:bg-gray-800',
  edit: 'text-green-500 hover:text-green-700 bg-transparent',
  delete: 'text-red-500 hover:text-red-700 bg-transparent',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`rounded-lg font-medium transition-colors cursor-pointer ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
