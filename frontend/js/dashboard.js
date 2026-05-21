async function atualizarDashboard() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  // saudacao com o primeiro nome
  const primeiroNome = (usuario.name || 'Atleta').split(' ')[0].toUpperCase()
  document.getElementById('saudacao').textContent = 'OL├ü, ' + primeiroNome

  // data de hoje formatada
  document.getElementById('data-hoje').textContent = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long'
  })

  // avatar com inicial do nome
  document.getElementById('avatar').textContent = (usuario.name || 'A')[0].toUpperCase()

  // busca dados na api
  const [resEx, resMed] = await Promise.all([
    chamarAPI('/exercises'),
    chamarAPI('/measures')
  ])

  const exercicios = resEx.ok ? resEx.dados : []
  const medidas = resMed.ok ? resMed.dados : []

  // calcula stats
  const stats = calcularStats(exercicios, medidas, usuario)

  document.getElementById('total-treinos').textContent = stats.total
  document.getElementById('treinos-semana').textContent = stats.semana
  document.getElementById('sequencia').textContent = stats.sequencia + '­ƒöÑ'
  document.getElementById('peso-atual').innerHTML = (stats.peso || 'ÔÇö') + '<span style="font-size:16px">kg</span>'

  // barra de dias da semana
  atualizarBarraSemana(exercicios)

  // ultimo treino
  mostrarUltimoTreino(exercicios)
}

function calcularStats(exercicios, medidas, usuario) {
  // agrupa exercicios por dia
  const diasTreinados = {}
  exercicios.forEach(ex => {
    const dia = ex.date ? ex.date.slice(0, 10) : ''
    if (dia) diasTreinados[dia] = true
  })
  const dias = Object.keys(diasTreinados).sort()
  const total = dias.length

  // conta treinos da semana atual
  const agora = new Date()
  const diaDaSemana = agora.getDay()
  const inicioSemana = new Date(agora)
  inicioSemana.setDate(agora.getDate() - (diaDaSemana === 0 ? 6 : diaDaSemana - 1))
  const chaveInicioSemana = inicioSemana.toISOString().slice(0, 10)
  const semana = dias.filter(d => d >= chaveInicioSemana).length

  // calcula sequencia de dias seguidos
  let sequencia = 0
  const verificar = new Date()
  for (let i = 0; i < 60; i++) {
    const chave = verificar.toISOString().slice(0, 10)
    if (diasTreinados[chave]) sequencia++
    else if (i > 0) break
    verificar.setDate(verificar.getDate() - 1)
  }

  // pega peso atual
  let peso = null
  if (medidas.length) peso = medidas[0].weight
  if (!peso && usuario.weight_initial) peso = usuario.weight_initial

  return { total, semana, sequencia, peso }
}

function atualizarBarraSemana(exercicios) {
  // agrupa por dia
  const diasTreinados = {}
  exercicios.forEach(ex => {
    const dia = ex.date ? ex.date.slice(0, 10) : ''
    if (dia) diasTreinados[dia] = true
  })

  const agora = new Date()
  const diaDaSemana = agora.getDay()
  const inicioSemana = new Date(agora)
  inicioSemana.setDate(agora.getDate() - (diaDaSemana === 0 ? 6 : diaDaSemana - 1))

  const pontos = document.getElementById('barra-semana').children
  for (let i = 0; i < 7; i++) {
    const dia = new Date(inicioSemana)
    dia.setDate(inicioSemana.getDate() + i)
    const chave = dia.toISOString().slice(0, 10)
    pontos[i].classList.toggle('feito', !!diasTreinados[chave])
  }
}

function mostrarUltimoTreino(exercicios) {
  const el = document.getElementById('ultimo-treino')
  if (!exercicios.length) {
    el.textContent = 'Nenhum treino ainda.'
    return
  }

  // pega o dia mais recente
  const diaRecente = exercicios[0].date ? exercicios[0].date.slice(0, 10) : ''
  const doUltimoDia = exercicios.filter(e => e.date && e.date.slice(0, 10) === diaRecente)

  el.innerHTML = `
    <div style="font-weight:600;margin-bottom:8px;color:var(--verde)">${formatarData(diaRecente)}</div>
    ${doUltimoDia.map(ex => `
      <div style="font-size:13px;color:var(--cinza);padding:2px 0">
        ${ex.name} ÔÇö ${ex.sets}x${ex.reps} ┬À ${ex.load}kg
      </div>
    `).join('')}
  `
}

async function renderizarHistorico() {
  const res = await chamarAPI('/exercises')
  const el = document.getElementById('lista-historico')

  if (!res.ok || !res.dados.length) {
    el.innerHTML = `
      <div class="estado-vazio">
        <div class="icone-vazio">­ƒôï</div>
        <div>Nenhum treino ainda.</div>
      </div>`
    return
  }

  // agrupa por data
  const porData = {}
  res.dados.forEach(ex => {
    const dia = ex.date ? ex.date.slice(0, 10) : 'sem data'
    if (!porData[dia]) porData[dia] = []
    porData[dia].push(ex)
  })

  el.innerHTML = Object.entries(porData).map(([data, lista]) => `
    <div style="margin-bottom:20px">
      <div class="data-historico">${formatarData(data)}</div>
      ${lista.map(ex => `
        <div class="item-exercicio">
          <div>
            <div class="ex-nome">${ex.name}</div>
            <div class="ex-detalhe">${ex.sets}x${ex.reps}</div>
          </div>
          <div class="badge-carga">${ex.load}kg</div>
        </div>
      `).join('')}
    </div>
  `).join('')
}

async function renderizarProgresso() {
  const [resEx, resMed] = await Promise.all([
    chamarAPI('/exercises'),
    chamarAPI('/measures')
  ])

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const exercicios = resEx.ok ? resEx.dados : []
  const medidas = resMed.ok ? resMed.dados : []
  const stats = calcularStats(exercicios, medidas, usuario)

  document.getElementById('p-total').textContent = stats.total
  document.getElementById('p-semana').textContent = stats.semana
  document.getElementById('p-sequencia').textContent = stats.sequencia + '­ƒöÑ'
  document.getElementById('p-peso').textContent = stats.peso || 'ÔÇö'

  renderizarGraficoMedidas()
  renderizarConquistas(stats, medidas)
}

function renderizarConquistas(stats, medidas) {
  const conquistas = [
    { icone: '­ƒÅà', texto: 'Primeiro treino!',         ganhou: stats.total >= 1 },
    { icone: '­ƒöÑ', texto: '7 treinos no total',        ganhou: stats.total >= 7 },
    { icone: 'ÔÜí', texto: '3 dias seguidos',            ganhou: stats.sequencia >= 3 },
    { icone: '­ƒôÅ', texto: 'Medidas registradas',        ganhou: medidas.length >= 1 },
    { icone: '­ƒÅå', texto: '10 treinos completados',     ganhou: stats.total >= 10 },
    { icone: '­ƒÆ¬', texto: '30 treinos ÔÇö voc├¬ ├® faixa!', ganhou: stats.total >= 30 },
  ]

  document.getElementById('lista-conquistas').innerHTML = conquistas.map(c => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--borda);opacity:${c.ganhou ? 1 : 0.3}">
      <span style="font-size:24px">${c.icone}</span>
      <span style="font-size:14px;font-weight:${c.ganhou ? 600 : 400}">${c.texto}</span>
      ${c.ganhou ? '<span style="margin-left:auto;color:var(--verde);font-size:12px">Ô£ô</span>' : ''}
    </div>
  `).join('')
}
