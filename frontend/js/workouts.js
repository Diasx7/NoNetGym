async function carregarHistorico() {
  const res = await chamarAPI('/exercises', 'GET')
  const lista = document.getElementById('lista-historico')

  if (!res.ok || res.dados.length === 0) {
    lista.innerHTML = '<div class="vazio">Nenhum treino no histórico ainda.</div>'
    return
  }

  // agrupa por data
  const porData = {}
  res.dados.forEach(e => {
    const data = (e.exercise_date || e.date)?.slice(0,10)
    if (!data) return
    if (!porData[data]) porData[data] = []
    porData[data].push(e)
  })

  // calcula volume por data
  lista.innerHTML = Object.entries(porData).map(([data, exs]) => {
    const volume = exs.reduce((acc, e) =>
      acc + ((e.sets||0) * (e.reps||0) * (parseFloat(e.weight)||0)), 0)
    return `
      <div class="hist-card">
        <div class="hist-data">${formatarData(data)}</div>
        <div class="hist-nome">${exs.length} exercício${exs.length > 1 ? 's' : ''}</div>
        <div class="hist-meta">
          ${volume > 0 ? (volume >= 1000 ? (volume/1000).toFixed(1) + 't' : volume + 'kg') : '—'}
        </div>
      </div>`
  }).join('')
}