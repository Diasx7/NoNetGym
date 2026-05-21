let graficoPeso = null

async function carregarMedidas() {
  const res = await chamarAPI('/measures', 'GET')
  if (!res.ok) return

  renderizarIMC(res.dados)
  renderizarGraficoPeso(res.dados)
  renderizarComparativo(res.dados)
  renderizarListaMedidas(res.dados)
}

function renderizarIMC(medidas) {
  const comPeso = medidas.filter(m => m.weight)
  const usuario = getUsuario()

  if (comPeso.length === 0 || !usuario) {
    document.getElementById('imc-card').innerHTML =
      '<div class="vazio">Registre seu peso e altura para ver o IMC.</div>'
    return
  }

  const peso = parseFloat(comPeso[0].weight)
  const altura = parseFloat(usuario.height || 170) / 100
  const imc = (peso / (altura * altura)).toFixed(1)

  let classe = ''
  let cor = ''
  if (imc < 18.5) { classe = 'Abaixo do peso'; cor = '#38bdf8' }
  else if (imc < 25) { classe = 'Peso normal'; cor = '#4ade80' }
  else if (imc < 30) { classe = 'Sobrepeso'; cor = '#EF9F27' }
  else { classe = 'Obesidade'; cor = '#ff4444' }

  document.getElementById('imc-card').innerHTML = `
    <div class="imc-titulo">IMC</div>
    <div class="imc-valor" style="color:${cor}">${imc}</div>
    <div class="imc-class" style="color:${cor}">${classe}</div>
  `
}

function renderizarGraficoPeso(medidas) {
  const comPeso = medidas.filter(m => m.weight).reverse()
  if (graficoPeso) graficoPeso.destroy()

  const ctx = document.getElementById('grafico-peso').getContext('2d')
  graficoPeso = new Chart(ctx, {
    type: 'line',
    data: {
      labels: comPeso.map(m => formatarData((m.measure_date || m.date)?.slice(0,10))),
      datasets: [{
        label: 'Peso (kg)',
        data: comPeso.map(m => m.weight),
        borderColor: '#c8ff00',
        backgroundColor: 'rgba(200,255,0,0.06)',
        borderWidth: 2,
        pointBackgroundColor: '#c8ff00',
        pointRadius: 4,
        tension: 0.3,
        fill: true
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

function renderizarComparativo(medidas) {
  if (medidas.length < 2) {
    document.getElementById('comparativo-medidas').innerHTML =
      '<div class="vazio">Registre pelo menos 2 medidas para ver o comparativo.</div>'
    return
  }

  const primeira = medidas[medidas.length - 1]
  const ultima = medidas[0]

  const campos = [
    { key: 'weight', label: 'Peso', unidade: 'kg' },
    { key: 'arm', label: 'Braço', unidade: 'cm' },
    { key: 'waist', label: 'Cintura', unidade: 'cm' },
    { key: 'abdomen', label: 'Abdômen', unidade: 'cm' },
    { key: 'chest', label: 'Peito', unidade: 'cm' },
    { key: 'leg', label: 'Perna', unidade: 'cm' }
  ]

  const html = campos.filter(c => ultima[c.key] && primeira[c.key]).map(c => {
    const diff = (parseFloat(ultima[c.key]) - parseFloat(primeira[c.key])).toFixed(1)
    const pos = parseFloat(diff) > 0
    const diffStr = pos ? '+' + diff : diff
    return `
      <div class="comp-item">
        <div class="comp-nome">${c.label}</div>
        <div class="comp-vals">
          <div class="comp-atual">${ultima[c.key]}${c.unidade}</div>
          <div class="comp-diff ${pos ? 'pos' : 'neg'}">${diffStr}</div>
        </div>
      </div>`
  }).join('')

  document.getElementById('comparativo-medidas').innerHTML =
    `<div class="comparativo">${html}</div>`
}

function renderizarListaMedidas(medidas) {
  if (medidas.length === 0) {
    document.getElementById('lista-medidas').innerHTML =
      '<div class="vazio">Nenhuma medida registrada ainda.</div>'
    return
  }

  document.getElementById('lista-medidas').innerHTML = medidas.map(m => `
    <div class="medida-card">
      <div class="medida-data">${formatarData((m.measure_date || m.date)?.slice(0,10))}</div>
      <div class="medida-grid">
        ${m.weight ? `<div class="medida-item"><div class="m-lbl">Peso</div><div class="m-val">${m.weight}kg</div></div>` : ''}
        ${m.arm ? `<div class="medida-item"><div class="m-lbl">Braço</div><div class="m-val">${m.arm}cm</div></div>` : ''}
        ${m.waist ? `<div class="medida-item"><div class="m-lbl">Cintura</div><div class="m-val">${m.waist}cm</div></div>` : ''}
        ${m.abdomen ? `<div class="medida-item"><div class="m-lbl">Abdômen</div><div class="m-val">${m.abdomen}cm</div></div>` : ''}
        ${m.chest ? `<div class="medida-item"><div class="m-lbl">Peito</div><div class="m-val">${m.chest}cm</div></div>` : ''}
        ${m.leg ? `<div class="medida-item"><div class="m-lbl">Perna</div><div class="m-val">${m.leg}cm</div></div>` : ''}
      </div>
    </div>
  `).join('')
}

async function salvarMedida() {
  const peso = document.getElementById('med-peso').value
  const braco = document.getElementById('med-braco').value
  const cintura = document.getElementById('med-cintura').value
  const quadril = document.getElementById('med-quadril').value
  const perna = document.getElementById('med-perna').value
  const peito = document.getElementById('med-peito').value

  const res = await chamarAPI('/measures', 'POST', {
    weight: peso || null,
    arm: braco || null,
    waist: cintura || null,
    abdomen: quadril || null,
    chest: peito || null,
    leg: perna || null,
    date: hoje()
  })

  if (res.ok) {
    mostrarToast('Medida salva!')
    fecharModal('modal-medida')
    document.getElementById('med-peso').value = ''
    document.getElementById('med-braco').value = ''
    document.getElementById('med-cintura').value = ''
    document.getElementById('med-quadril').value = ''
    document.getElementById('med-perna').value = ''
    document.getElementById('med-peito').value = ''
    carregarMedidas()
  } else {
    mostrarToast(res.dados.error || 'Erro ao salvar')
  }
}