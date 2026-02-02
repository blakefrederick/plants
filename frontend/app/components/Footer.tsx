export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-sand">
      <div className="container">
        <div className="py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-stone-500 text-sm">
            © 2026
          </div>
          <div className="text-stone-400 text-sm">
            Built with Sanity
          </div>
        </div>
      </div>
    </footer>
  )
}
