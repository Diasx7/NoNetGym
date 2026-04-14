let graficoCarga = null

async function adicionarExercicio() {
  const nome = document.getElementById('ex-nome').value.trim()
  const series = document.getElementById('ex-series').value
  const reps = document.getElementById('ex-reps').value
  const carga = document.getElementById('ex-carga').value

  if (!nome || !series || !reps) {
    mostrarToast('Preencha nome, séries e reps!')
    return
  }

  const res = await chamarAPI('/exercises', 'POST', {
    name: nome,
    sets: series,
    reps: reps,
    load: carga || 0,
    date: hoje()
  })

  if (res.ok) {
    mostrarToast('Exercício adicionado! 💪')
    // limpa os campos
    document.getElementById('ex-nome').value = ''
    document.getElementById('ex-series').value = ''
    document.getElementById('ex-reps').value = ''
    document.getElementById('ex-carga').value = ''
    renderizarExercicios()
    atualizarDashboard()
  } else {
    mostrarToast(res.dados.error || 'Erro ao salvar')
  }
}

async function deletarExercicio(id) {
  const res = await chamarAPI('/exercises/' + id, 'DELETE')
  if (res.ok) {
    mostrarToast('Removido!')
    renderizarExercicios()
    atualizarDashboard()
  }
}

async function renderizarExercicios() {
  const dataHoje = hoje()
  document.getElementById('data-hoje-ex').textContent = new Date().toLocaleDateString('pt-BR')

  const res = await chamarAPI('/exercises')
  if (!res.ok) return

  // filtra so os de hoje
  const deHoje = res.dados.filter(e => e.date && e.date.slice(0, 10) === dataHoje)
  const lista = document.getElementById('lista-exercicios-hoje')

  if (!deHoje.length) {
    lista.innerHTML = `
      <div class="estado-vazio">
        <div class="icone-vazio">🏋️</div>
        <div>Adicione seu primeiro exercício hoje!</div>
      </div>`
    return
  }

  lista.innerHTML = deHoje.map(ex => `
    <div class="item-exercicio">
      <div>
        <div class="ex-nome">${ex.name}</div>
        <div class="ex-detalhe">${ex.sets}x${ex.reps} · ${ex.load}kg</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        <div class="badge-carga">${ex.load}kg</div>
        <button class="btn-apagar" onclick="deletarExercicio(${ex.id})">✕</button>
      </div>
    </div>
  `).join('')
}

async function atualizarGrafico() {
  const filtro = (document.getElementById('filtro-grafico')?.value || '').toLowerCase()
  const res = await chamarAPI('/exercises')
  if (!res.ok) return

  const dados = res.dados

  // agrupa por nome do exercicio
  const agrupado = {}
  dados.forEach(ex => {
    if (filtro && !ex.name.toLowerCase().includes(filtro)) return
    if (!agrupado[ex.name]) agrupado[ex.name] = { datas: [], cargas: [] }
    agrupado[ex.name].datas.push(ex.date ? ex.date.slice(5, 10) : '')
    agrupado[ex.name].cargas.push(ex.load)
  })

  const ctx = document.getElementById('grafico-exercicios')
  if (!ctx) return
  if (graficoCarga) graficoCarga.destroy()

  const cores = ['#e8ff00', '#ff4d00', '#00e676', '#00b0ff', '#ff80ab']
  const datasets = Object.entries(agrupado).map(([nome, info], i) => ({
    label: nome,
    data: info.cargas,
    borderColor: cores[i % cores.length],
    backgroundColor: cores[i % cores.length] + '22',
    tension: 0.4,
    fill: true,
    pointRadius: 4,
    borderWidth: 2
  }))

  // pega todas as datas sem repetir
  const todasDatas = [...new Set(dados.map(e => e.date ? e.date.slice(5, 10) : ''))].sort()

  graficoCarga = new Chart(ctx, {
    type: 'line',
    data: { labels: todasDatas, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#888', font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: '#555' }, grid: { color: '#222' } },
        y: { ticks: { color: '#555' }, grid: { color: '#222' } }
      }
    }
  })
}