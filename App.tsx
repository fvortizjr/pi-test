import { useEffect, useMemo, useState } from 'react'

type Repo = {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  fork: boolean
}

const username = 'fvortizjr'
const languageColors: Record<string, string> = { TypeScript: '#3178c6', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c', Python: '#3572a5' }

function Icon({ children }: { children: React.ReactNode }) { return <span className="inline-flex size-4 items-center justify-center">{children}</span> }

function App() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
      .then((response) => { if (!response.ok) throw new Error('Could not load repositories.'); return response.json() as Promise<Repo[]> })
      .then(setRepos)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleRepos = useMemo(() => repos.filter((repo) => !repo.fork && `${repo.name} ${repo.description ?? ''}`.toLowerCase().includes(query.toLowerCase())), [repos, query])
  const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-10">
        <nav className="flex items-center justify-between border-b border-white/10 pb-6">
          <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" className="mono text-sm text-[#c8f169]">~/ {username}</a>
          <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
            GitHub <Icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 17 17 7M8 7h9v9" /></svg></Icon>
          </a>
        </nav>

        <header className="relative py-20 sm:py-28">
          <div className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-[#c8f169]/10 blur-3xl" />
          <p className="mono mb-5 text-xs uppercase tracking-[.22em] text-[#c8f169]">01 / selected work</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.055em] text-white sm:text-7xl">Things I’ve<br /><span className="text-zinc-500">been building.</span></h1>
          <p className="mt-7 max-w-md text-base leading-7 text-zinc-400">A living index of experiments, tools, and open-source projects by {username}.</p>
        </header>

        <section aria-label="Repository list">
          <div className="mb-6 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
            <div className="flex gap-7 text-sm"><span><strong className="text-white">{loading ? '—' : visibleRepos.length}</strong> <span className="text-zinc-500">repositories</span></span><span><strong className="text-white">{loading ? '—' : stars}</strong> <span className="text-zinc-500">stars</span></span></div>
            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2 text-sm text-zinc-400 focus-within:border-[#c8f169]/50"><Icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg></Icon><span className="sr-only">Search repositories</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" className="w-36 bg-transparent outline-none placeholder:text-zinc-600" /></label>
          </div>

          {loading && <div className="py-16 text-center text-sm text-zinc-500">Fetching repositories...</div>}
          {error && <div className="border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-300">{error} <button onClick={() => window.location.reload()} className="ml-2 underline">Try again</button></div>}
          {!loading && !error && visibleRepos.length === 0 && <div className="py-16 text-center text-sm text-zinc-500">No repositories match “{query}”.</div>}
          <div className="grid gap-3 md:grid-cols-2">
            {visibleRepos.map((repo, index) => <article key={repo.id} className="group flex min-h-48 flex-col justify-between border border-white/10 bg-white/[.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#c8f169]/50 hover:bg-[#c8f169]/[.04] sm:p-6">
              <div><div className="mb-8 flex items-start justify-between"><span className="mono text-xs text-zinc-600">0{index + 1}</span><a href={repo.html_url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.name} on GitHub`} className="text-zinc-600 transition group-hover:text-[#c8f169]"><Icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 17 17 7M8 7h9v9" /></svg></Icon></a></div><h2 className="text-xl font-medium tracking-tight text-white">{repo.name}</h2><p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-zinc-500">{repo.description || 'No description yet.'}</p></div>
              <div className="mt-7 flex items-center gap-4 text-xs text-zinc-600"><span className="flex items-center gap-1.5">{repo.language && <i className="size-2 rounded-full" style={{ backgroundColor: languageColors[repo.language] ?? '#888' }} />} {repo.language || 'Code'}</span><span className="flex items-center gap-1"><Icon><svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 17.3-6.2 3.7 1.8-7-5.5-4.6 7.2-.5L12 2.3l2.7 6.6 7.2.5-5.5 4.6 1.8 7z" /></svg></Icon>{repo.stargazers_count}</span><span>{new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span></div>
            </article>)}
          </div>
        </section>
        <footer className="mt-20 border-t border-white/10 py-6 text-xs text-zinc-600"><span className="mono">© {new Date().getFullYear()} / built in public</span></footer>
      </div>
    </main>
  )
}

export default App
