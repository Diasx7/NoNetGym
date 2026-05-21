let graficoPeso = null
let graficoMedidas = null

async function salvarMedidas() {
  const dados = {
    weight:  document.getElementById('m-peso').value    || null,
    waist:   document.getElementById('m-cintura').value || null,
    abdomen: document.getElementById('m-abdomen').value || null,
    chest:   document.getElementById('m-peito').value   || null,
    arm:     document.getElementById('m-braco').value   || null,
    leg:     document.getElementById('m-perna').value   || null,
    date: hoje()
  }

  // verifica se preencheu pelo menos um campo
  const temAlgo = Object.values(dados).some(v => v !== null && v !== '' && v !== hoje())
  if (!temAlgo) {
    mostrarToast('Preencha pelo menos uma medida!')
    return
  }

  const res = await chamarAPI('/measures', 'POST', dados)

  if (res.ok) {
    mostrarToast('Medidas salvas! ­ƒôÅ')
    // limpa os campos
    ;['m-peso','m-cintura','m-abdomen','m-peito','m-braco','m-perna'].forEach(id => {
      document.getElementById(id).value = ''
    })
    renderizarGraficoPeso()
    renderizarUltimoRegistro()
    atualizarDashboard()
  } else {
    mostrarToast(res.dados.error || 'Erro ao salvar medidas')
  }
}

async function renderizarGraficoPeso() {
  const res = await chamarAPI('/measures')
  if (!res.ok) return

  const medidas = res.dados.reverse() // mais antigas primeiro
  const labels = medidas.map(m => m.date ? m.date.slice(5, 10) : '')
  const pesos = medidas.map(m => m.weight)

  const ctx = document.getElementById('grafico-peso')
  if (!ctx) return
  if (graficoPeso) graficoPeso.destroy()

  graficoPeso = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Peso (kg)',
        data: pesos,
        borderColor: '#e8ff00',
        backgroundColor: '#e8ff0022',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#555' }, grid: { color: '#222' } },
        y: { ticks: { color: '#555' }, grid: { color: '#222' } }
      }
    }
  })
}

async function renderizarUltimoRegistro() {
  const res = await chamarAPI('/measures')
  if (!res.ok) return

  const el = document.getElementById('ultimo-registro')

  if (!res.dados.length) {
    el.textContent = 'Nenhuma medida ainda.'
    return
  }

  const ultimo = res.dados[0] // ja vem ordenado por data desc

  const campos = {
    weight: 'Peso', waist: 'Cintura', abdomen: 'Abd├┤men',
    chest: 'Peito', arm: 'Bra├ºo', leg: 'Perna'
  }

  el.innerHTML = Object.entries(campos)
    .filter(([key]) => ultimo[key])
    .map(([key, label]) => `
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--borda)">
        <span style="color:var(--cinza)">${label}</span>
        <span style="font-weight:600">${ultimo[key]} ${key === 'weight' ? 'kg' : 'cm'}</span>
      </div>
    `).join('')
}

// grafico com varias medidas junto ÔÇö usado na pagina de progresso
async function renderizarGraficoMedidas() {
  const res = await chamarAPI('/measures')
  if (!res.ok) return

  const medidas = res.dados.reverse()
  const labels = medidas.map(m => m.date ? m.date.slice(5, 10) : '')

  const campos = { weight: '#e8ff00', waist: '#ff4d00', chest: '#00e676', arm: '#00b0ff' }

  const ctx = document.getElementById('grafico-medidas')
  if (!ctx) return
  if (graficoMedidas) graficoMedidas.destroy()

  graficoMedidas = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: Object.entries(campos).map(([campo, cor]) => ({
        label: campo.charAt(0).toUpperCase() + campo.slice(1),
        data: medidas.map(m => m[campo] || null),
        borderColor: cor,
        backgroundColor: cor + '22',
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#888', font: { size: 10 } } } },
      scales: {
        x: { ticks: { color: '#555' }, grid: { color: '#222' } },
        y: { ticks: { color: '#555' }, grid: { color: '#222' } }
      }
    }
  })
}
