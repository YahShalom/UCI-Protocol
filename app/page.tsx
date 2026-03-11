'use client'

import { useState } from 'react'
import { Zap, Code, Terminal, Shield } from 'lucide-react'

export default function Home() {
  const [capabilityId, setCapabilityId] = useState('uci:local:math.add')
  const [parameters, setParameters] = useState('{\n  "a": 1,\n  "b": 2\n}')
  const [policy, setPolicy] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/uci/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capability_id: capabilityId,
          parameters: JSON.parse(parameters),
          policy: policy ? JSON.parse(policy) : undefined,
        }),
      })

      if (!res.ok) {
        const errorText = await res.text();
        let errorJson = {};
        try {
          errorJson = JSON.parse(errorText);
        } catch(e) {}
        throw new Error(errorJson.message || errorText);
      }

      setResult(await res.json())
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">UCI Intent Executor</h1>
          <p className="mt-4 text-lg text-gray-400">A modern interface to the Universal Capability Interface.</p>
        </header>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="capabilityId" className="flex items-center text-lg font-semibold text-gray-300 mb-2">
                  <Zap size={20} className="mr-2 text-cyan-400" /> Capability ID
                </label>
                <input
                  id="capabilityId"
                  type="text"
                  value={capabilityId}
                  onChange={(e) => setCapabilityId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="policy" className="flex items-center text-lg font-semibold text-gray-300 mb-2">
                  <Shield size={20} className="mr-2 text-purple-400" /> Policy (JSON, optional)
                </label>
                <input
                  id="policy"
                  type="text"
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder='e.g., { "constraints": { ... } }'
                />
              </div>
            </div>

            <div>
              <label htmlFor="parameters" className="flex items-center text-lg font-semibold text-gray-300 mb-2">
                <Code size={20} className="mr-2 text-green-400" /> Parameters (JSON)
              </label>
              <textarea
                id="parameters"
                rows={6}
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 font-bold text-lg text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Execute Intent
            </button>
          </form>
        </div>

        {(result || error) && (
          <div className="mt-12">
            <h2 className="flex items-center text-2xl font-bold text-gray-300 mb-4">
              <Terminal size={24} className="mr-3 text-gray-400" /> Execution Result
            </h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 font-mono text-sm">
              {result && (
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Success</h3>
                  <pre className="whitespace-pre-wrap text-gray-300">{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
              {error && (
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
                  <pre className="whitespace-pre-wrap text-red-300">{error}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
