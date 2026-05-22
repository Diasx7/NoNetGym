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

  lista.innerHTML = Object.entries(porData).map(([data, exs], idx) => {
    const volume = exs.reduce((acc, e) =>
      acc + ((e.sets||0) * (e.reps||0) * (parseFloat(e.weight)||0)), 0)
    const volStr = volume >= 1000 ? (volume/1000).toFixed(1) + 't' : volume + 'kg'
    const grupos = [...new Set(exs.map(e => e.grupo_muscular || e.group).filter(Boolean))]

    return `
      <div class="hist-card" style="animation-delay:${idx * 0.05}s">
        <div class="hist-topo" onclick="toggleHistorico(this)">
          <div class="hist-esq">
            <div class="hist-data-box">
              <div class="hist-dia">${new Date(data + 'T00:00:00').getDate()}</div>
              <div class="hist-mes">${new Date(data + 'T00:00:00').toLocaleDateString('pt-BR',{month:'short'})}</div>
            </div>
            <div>
              <div class="hist-titulo">${exs.length} exercício${exs.length > 1 ? 's' : ''}</div>
              <div class="hist-sub">${grupos.length > 0 ? grupos.slice(0,3).join(' · ') : formatarData(data)}</div>
            </div>
          </div>
          <div class="hist-dir">
            <div class="hist-vol">${volume > 0 ? volStr : '—'}</div>
            <i class="ti ti-chevron-down hist-chevron"></i>
          </div>
        </div>
        <div class="hist-body">
          <div class="hist-exs">
            ${exs.map(e => `
              <div class="hist-ex">
                <div class="hist-ex-dot"></div>
                <div class="hist-ex-nome">${e.name}</div>
                <div class="hist-ex-meta">${e.sets}x${e.reps} · ${parseFloat(e.weight).toFixed(0)}kg</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`
  }).join('')
}

function toggleHistorico(el) {
  el.closest('.hist-card').classList.toggle('aberto')
}

async function registrarTreino() {
  const nome = document.getElementById('nome-treino').value.trim()
  if (!nome) { mostrarToast('Selecione uma ficha'); return }
  mostrarToast('Treino "' + nome + '" registrado!')
}