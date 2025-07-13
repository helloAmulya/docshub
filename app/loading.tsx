export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-8 rounded-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto"></div>
        <p className="text-white/70 mt-4 text-center">Loading...</p>
      </div>
    </div>
  )
}
