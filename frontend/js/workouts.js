async function carregarHistorico() {
  const res = await chamarAPI('/exercises', 'GET')
  const lista = document.getElementById('lista-historico')

  if (!res.ok || res.dados.length === 0) {
    lista.innerHTML = '<div class="vazio">Nenhum treino no histórico ainda.</div>'
    return
  }

  const porData = {}
  res.dados.forEach(e => {
    const data = (e.exercise_date || e.date)?.slice(0,10)
    if (!data) return
    if (!porData[data]) porData[data] = []
    porData[data].push(e)
  })

  lista.innerHTML = Object.entries(porData).map(([data, exs]) => {
    const volume = exs.reduce((acc, e) =>
      acc + ((e.sets||0) * (e.reps||0) * (parseFloat(e.weight)||0)), 0)
    const volStr = volume >= 1000 ? (volume/1000).toFixed(1) + 't' : volume + 'kg'

    return `
      <div class="hist-card">
        <div class="hist-topo">
          <div class="hist-data">${formatarData(data)}</div>
          <div class="hist-volume">${volume > 0 ? volStr : '—'}</div>
        </div>
        <div class="hist-exs">
          ${exs.map(e => `
            <div class="hist-ex">
              <div class="hist-ex-dot"></div>
              <div class="hist-ex-nome">${e.name}</div>
              <div class="hist-ex-meta">${e.sets}x${e.reps} · ${parseFloat(e.weight).toFixed(0)}kg</div>
            </div>
          `).join('')}
        </div>
      </div>`
  }).join('')
}