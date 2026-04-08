export default function SearchBox({ value, onChange, placeholder = '검색어를 입력해주세요' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-xs px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
    />
  )
}
