import Link from 'next/link'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold">UCI</h1>
        <p className="text-xl text-gray-500">Governance & Evidence Profile for the Agentic Stack</p>
      </div>
      <div className="mt-12 flex flex-col space-y-4">
        <Link href="/capabilities" className="text-lg text-blue-500 hover:underline">
          /capabilities
        </Link>
        <Link href="/runs" className="text-lg text-blue-500 hover:underline">
          /runs
        </Link>
        <Link href="/mcp" className="text-lg text-blue-500 hover:underline">
          /mcp
        </Link>
        <Link href="/api/uci/execute" className="text-lg text-blue-500 hover:underline">
          /api/uci/execute
        </Link>
        <Link href="/api/mcp" className="text-lg text-blue-500 hover:underline">
          /api/mcp
        </Link>
        <Link href="/.well-known/uci" className="text-lg text-blue-500 hover:underline">
          /.well-known/uci
        </Link>
      </div>
    </main>
  )
}
