const CONQUISTAS = [
  { id: 1, nome: 'Primeiro treino', desc: 'Registrou o primeiro exercício', icone: 'ti-trophy', req: (exs) => exs.length >= 1 },
  { id: 2, nome: '10 treinos', desc: 'Completou 10 dias de treino', icone: 'ti-award', req: (exs) => diasUnicos(exs) >= 10 },
  { id: 3, nome: '30 treinos', desc: 'Completou 30 dias de treino', icone: 'ti-medal', req: (exs) => diasUnicos(exs) >= 30 },
  { id: 4, nome: 'Sequência de 7 dias', desc: 'Treinou 7 dias seguidos', icone: 'ti-flame', req: (exs) => melhorSequencia(exs) >= 7 },
  { id: 5, nome: 'Levantou 1 tonelada', desc: 'Volume total acumulado de 1000kg', icone: 'ti-barbell', req: (exs) => volumeTotal(exs) >= 1000 },
  { id: 6, nome: 'Levantou 10 toneladas', desc: 'Volume total acumulado de 10000kg', icone: 'ti-barbell', req: (exs) => volumeTotal(exs) >= 10000 },
  { id: 7, nome: 'Variedade', desc: 'Registrou 5 exercícios diferentes', icone: 'ti-list', req: (exs) => new Set(exs.map(e => e.name)).size >= 5 },
  { id: 8, nome: 'Dedicado', desc: 'Registrou 10 exercícios diferentes', icone: 'ti-list-check', req: (exs) => new Set(exs.map(e => e.name)).size >= 10 }
]

function diasUnicos(exs) {
  return new Set(exs.map(e => (e.exercise_date || e.date)?.slice(0,10)).filter(Boolean)).size
}

function volumeTotal(exs) {
  return exs.reduce((acc, e) => acc + ((e.sets||0) * (e.reps||0) * (parseFloat(e.weight)||0)), 0)
}

function melhorSequencia(exs) {
  const datas = [...new Set(exs.map(e => (e.exercise_date || e.date)?.slice(0,10)).filter(Boolean))].sort()
  let max = 0
  let atual = 1
  for (let i = 1; i < datas.length; i++) {
    const d1 = new Date(datas[i-1])
    const d2 = new Date(datas[i])
    const diff = Math.round((d2-d1) / 86400000)
    if (diff === 1) { atual++; max = Math.max(max, atual) }
    else atual = 1
  }
  return Math.max(max, atual)
}

async function carregarProgresso() {
  const res = await chamarAPI('/exercises', 'GET')
  const exs = res.ok ? res.dados : []

  renderizarGraficoVolume(exs)
  renderizarPRs(exs)
  renderizarConquistas(exs)
}

function renderizarGraficoVolume(exs) {
  // volume por dia nos ultimos 14 dias
  const ultimos14 = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    ultimos14.push(d.toISOString().slice(0,10))
  }

  const volumePorDia = ultimos14.map(data => {
    const exsDia = exs.filter(e => (e.exercise_date || e.date)?.slice(0,10) === data)
    return exsDia.reduce((acc, e) => acc + ((e.sets||0)*(e.reps||0)*(parseFloat(e.weight)||0)), 0)
  })

  const ctx = document.getElementById('grafico-volume').getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ultimos14.map(d => {
        const dt = new Date(d + 'T00:00:00')
        return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      }),
      datasets: [{
        label: 'Volume (kg)',
        data: volumePorDia,
        backgroundColor: 'rgba(200,255,0,0.7)',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#555', font: { size: 10 } }, grid: { color: '#1a1a1a' } },
        y: { ticks: { color: '#555', font: { size: 10 } }, grid: { color: '#1a1a1a' } }
      }
    }
  })
}

function renderizarPRs(exs) {
  const prs = calcularPRs(exs)
  const lista = document.getElementById('lista-prs')

  if (prs.length === 0) {
    lista.innerHTML = '<div class="vazio">Nenhum PR ainda.</div>'
    return
  }

  lista.innerHTML = prs.sort((a,b) => b.carga - a.carga).map(pr => `
    <div class="pr-card">
      <i class="ti ti-trophy pr-icon"></i>
      <div class="pr-nome">${pr.nome}</div>
      <div>
        <div class="pr-carga">${pr.carga}kg</div>
        <div class="pr-data">${formatarData(pr.data?.slice(0,10))}</div>
      </div>
    </div>
  `).join('')
}

function renderizarConquistas(exs) {
  const lista = document.getElementById('lista-conquistas')
  lista.innerHTML = CONQUISTAS.map(c => {
    const desbloqueada = c.req(exs)
    return `
      <div class="conquista-card ${desbloqueada ? 'desbloqueada' : ''}">
        <i class="ti ${c.icone} conquista-icon"></i>
        <div>
          <div class="conquista-nome">${c.nome}</div>
          <div class="conquista-desc">${c.desc}</div>
        </div>
        ${desbloqueada ? '<i class="ti ti-check" style="color:#4ade80;margin-left:auto"></i>' : ''}
      </div>`
  }).join('')
}