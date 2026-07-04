export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070b0a] flex selection:bg-[#5ed29c] selection:text-[#070b0a]">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#070b0a] flex-col items-center justify-center p-12">
        {/* Decorative glows */}
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#5ed29c]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#00ffff]/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-[#5ed29c]/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#070b0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-widest uppercase">Tracksy</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight uppercase font-[family-name:var(--font-inter)] tracking-tight">
            Manage projects with{' '}
            <span className="text-[#5ed29c]">
              clarity.
            </span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 font-[family-name:var(--font-inter)]">
            Everything you need for campaign tracking, approvals, and performance — in one intelligent workspace.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 bg-[#070b0a] lg:bg-transparent">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#070b0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-widest uppercase">Tracksy</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
