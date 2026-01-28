export default function Footer() {
  return (
    <footer className="bg-green-50/30 relative border-t border-green-100">
      {/* Line drawing botanical pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
          <path d="M50 150 Q 80 120 110 150 T 170 150" stroke="currentColor" strokeWidth="1" className="text-green-400"/>
          <path d="M200 160 Q 230 130 260 160 T 320 160" stroke="currentColor" strokeWidth="1" className="text-green-400"/>
          <circle cx="85" cy="135" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-green-300"/>
          <circle cx="245" cy="145" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-green-300"/>
          <path d="M85 135 L85 125 M85 135 L90 130 M85 135 L80 130" stroke="currentColor" strokeWidth="0.5" className="text-green-300"/>
          <path d="M245 145 L245 135 M245 145 L250 140 M245 145 L240 140" stroke="currentColor" strokeWidth="0.5" className="text-green-300"/>
        </svg>
      </div>
      
      <div className="container relative">
        <div className="flex flex-col items-center py-12 lg:flex-row">
          <div className="mb-6 text-center lg:mb-0 lg:w-1/2 lg:pr-8 lg:text-left">
            <h3 className="text-2xl font-light leading-relaxed tracking-wide text-green-700 lg:text-xl">
              Plants & Trees
            </h3>
            <div className="mt-2 flex items-center justify-center lg:justify-start">
              <div className="w-12 h-px bg-green-300"></div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 items-center justify-center lg:w-1/2 lg:flex-row lg:pl-8">
            <div className="text-center lg:text-left">
              <p className="text-green-600 text-sm font-light">
                Built using Sanity.io
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
