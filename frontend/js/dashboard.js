const checkinState = { energia: 0, sono: 0, humor: 0 }

async function carregarDashboard() {
  await Promise.all([
    carregarStreak(),
    carregarEstatisticas(),
    carregarSemana(),
    carregarMusculoMaisTreinado(),
    carregarUltimoTreino()
  ])
}

async function carregarStreak() {
  const res = await chamarAPI('/exercises', 'GET')
  if (!res.ok) return

  const datas = [...new Set(res.dados.map(e => e.exercise_date?.slice(0,10) || e.date?.slice(0,10)))]
    .filter(Boolean).sort().reverse()

  let streak = 0
  const hoje = new Date()
  hoje.setHours(0,0,0,0)

  for (let i = 0; i < datas.length; i++) {
    const d = new Date(datas[i] + 'T00:00:00')
    const diff = Math.round((hoje - d) / 86400000)
    if (diff === i || diff === i + 1) streak++
    else break
  }

  document.getElementById('streak-num').textContent = streak
}

async function carregarEstatisticas() {
  const res = await chamarAPI('/exercises', 'GET')
  if (!res.ok) return

  const mes = new Date().getMonth()
  const ano = new Date().getFullYear()

  const diasMes = [...new Set(
    res.dados
      .map(e => e.exercise_date?.slice(0,10) || e.date?.slice(0,10))
      .filter(d => {
        if (!d) return false
        const dt = new Date(d)
        return dt.getMonth() === mes && dt.getFullYear() === ano
      })
  )]

  document.getElementById('total-treinos').textContent = diasMes.length

  // calcula volume total
  const volume = res.dados.reduce((acc, e) => {
    return acc + ((e.sets || 0) * (e.reps || 0) * (parseFloat(e.weight) || 0))
  }, 0)
  document.getElementById('volume-total').textContent =
    volume >= 1000 ? (volume/1000).toFixed(1) + 't' : volume + 'kg'

  // conta prs
  const prs = calcularPRs(res.dados)
  document.getElementById('total-prs').textContent = prs.length
}

async function carregarSemana() {
  const res = await chamarAPI('/exercises', 'GET')
  const exercicios = res.ok ? res.dados : []

  const diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const hoje = new Date()
  hoje.setHours(0,0,0,0)

  const inicioDaSemana = new Date(hoje)
  inicioDaSemana.setDate(hoje.getDate() - hoje.getDay())

  const datasComTreino = exercicios.map(e =>
    e.exercise_date?.slice(0,10) || e.date?.slice(0,10)
  ).filter(Boolean)

  let html = ''
  for (let i = 0; i < 7; i++) {
    const dia = new Date(inicioDaSemana)
    dia.setDate(inicioDaSemana.getDate() + i)
    const diaStr = dia.toISOString().slice(0,10)
    const treinou = datasComTreino.includes(diaStr)
    const ehHoje = diaStr === hoje.toISOString().slice(0,10)

    html += `
      <div class="wd ${treinou ? 'treinou' : ''} ${ehHoje ? 'hoje' : ''}">
        <div class="wd-nome">${diasSemana[dia.getDay()]}</div>
        <div class="wd-circulo">
          ${treinou ? '<i class="ti ti-check" style="font-size:11px"></i>' : dia.getDate()}
        </div>
      </div>`
  }
  document.getElementById('week-grid').innerHTML = html
}

async function carregarMusculoMaisTreinado() {
  const res = await chamarAPI('/exercises', 'GET')
  if (!res.ok || res.dados.length === 0) {
    document.getElementById('musculo-mais').innerHTML = '<div class="vazio">Nenhum exercício ainda.</div>'
    return
  }

  const contagem = {}
  res.dados.forEach(e => {
    if (e.name) {
      const grupo = e.name
      contagem[grupo] = (contagem[grupo] || 0) + 1
    }
  })

  // agrupa por grupo muscular se tiver
  const porGrupo = {}
  res.dados.forEach(e => {
    if (e.grupo_muscular || e.group) {
      const g = e.grupo_muscular || e.group
      porGrupo[g] = (porGrupo[g] || 0) + 1
    }
  })

  const dados = Object.keys(porGrupo).length > 0 ? porGrupo : contagem
  const max = Math.max(...Object.values(dados))
  const sorted = Object.entries(dados).sort((a,b) => b[1]-a[1]).slice(0,5)

  document.getElementById('musculo-mais').innerHTML = sorted.map(([nome, qtd]) => `
    <div class="musculo-row">
      <div class="musculo-nome">${nome}</div>
      <div class="musculo-barra-track">
        <div class="musculo-barra-fill" style="width:${(qtd/max*100).toFixed(0)}%"></div>
      </div>
      <div class="musculo-count">${qtd}</div>
    </div>
  `).join('')
}

async function carregarUltimoTreino() {
  const res = await chamarAPI('/exercises', 'GET')
  if (!res.ok || res.dados.length === 0) {
    document.getElementById('ultimo-treino').innerHTML = '<div class="vazio">Nenhum treino ainda.</div>'
    return
  }

  const ultimaData = (res.dados[0].exercise_date || res.dados[0].date)?.slice(0,10)
  const exs = res.dados.filter(e =>
    (e.exercise_date || e.date)?.slice(0,10) === ultimaData
  )

  let html = `<div class="ultimo-card"><div class="ultimo-data">${formatarData(ultimaData)}</div>`
  exs.forEach(e => {
    html += `
      <div class="ex-card">
        <div class="ex-dot"></div>
        <div class="ex-info">
          <div class="ex-nome">${e.name}</div>
          <div class="ex-meta">${e.sets}x${e.reps} · ${e.weight}kg</div>
        </div>
      </div>`
  })
  html += '</div>'
  document.getElementById('ultimo-treino').innerHTML = html
}

// check-in
function setCheckin(campo, valor) {
  checkinState[campo] = valor
  const ids = { energia: 'ci-energia', sono: 'ci-sono', humor: 'ci-humor' }
  const container = document.getElementById(ids[campo])
  container.querySelectorAll('span').forEach((s, i) => {
    s.textContent = i < valor ? '●' : '○'
    s.classList.toggle('on', i < valor)
  })
}

async function salvarCheckin() {
  if (!checkinState.energia && !checkinState.sono && !checkinState.humor) {
    mostrarToast('Avalie pelo menos um item')
    return
  }
  mostrarToast('Check-in registrado!')
  document.getElementById('checkin-box').style.display = 'none'
}

// calcula prs (maior carga por exercicio)
function calcularPRs(exercicios) {
  const prs = {}
  exercicios.forEach(e => {
    const carga = parseFloat(e.weight) || 0
    if (!prs[e.name] || carga > prs[e.name].carga) {
      prs[e.name] = { carga, data: e.exercise_date || e.date }
    }
  })
  return Object.entries(prs).map(([nome, v]) => ({ nome, ...v }))
}