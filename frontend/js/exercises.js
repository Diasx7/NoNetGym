let timerInterval = null
let timerSegundos = 0

async function carregarExercicios() {
  const res = await chamarAPI('/exercises', 'GET')
  if (!res.ok) return

  const hojeStr = hoje()
  const exsHoje = res.dados.filter(e =>
    (e.exercise_date || e.date)?.slice(0,10) === hojeStr
  )

  const lista = document.getElementById('lista-exercicios')

  if (exsHoje.length === 0) {
    lista.innerHTML = '<div class="vazio">Nenhum exercício adicionado hoje.</div>'
    return
  }

  // pega prs pra mostrar badge
  const prs = calcularPRs(res.dados)
  const prMap = {}
  prs.forEach(p => prMap[p.nome] = p.carga)

  lista.innerHTML = exsHoje.map(e => {
    const isPR = parseFloat(e.weight) > 0 && parseFloat(e.weight) >= (prMap[e.name] || 0)
    return `
      <div class="ex-card">
        <div class="ex-dot"></div>
        <div class="ex-info">
          <div class="ex-nome">${e.name}</div>
          <div class="ex-meta">${e.sets} séries · ${e.reps} reps · ${e.weight}kg</div>
        </div>
        ${isPR ? '<div class="pr-badge"><i class="ti ti-trophy" style="font-size:10px"></i> PR</div>' : ''}
        <button class="btn-timer" onclick="iniciarTimer()">
          <i class="ti ti-clock"></i>
        </button>
        <button class="btn-del" onclick="deletarExercicio(${e.id})">
          <i class="ti ti-trash"></i>
        </button>
      </div>`
  }).join('')
}

async function salvarExercicio() {
  const nome = document.getElementById('ex-nome').value.trim()
  const grupo = document.getElementById('ex-grupo').value
  const series = document.getElementById('ex-series').value
  const reps = document.getElementById('ex-reps').value
  const carga = document.getElementById('ex-carga').value

  if (!nome || !series || !reps) {
    mostrarToast('Nome, séries e reps são obrigatórios')
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
    mostrarToast('Exercício salvo!')
    fecharModal('modal-exercicio')
    document.getElementById('ex-nome').value = ''
    document.getElementById('ex-grupo').value = ''
    document.getElementById('ex-series').value = ''
    document.getElementById('ex-reps').value = ''
    document.getElementById('ex-carga').value = ''
    carregarExercicios()
  } else {
    mostrarToast(res.dados.error || 'Erro ao salvar')
  }
}

async function deletarExercicio(id) {
  const res = await chamarAPI('/exercises/' + id, 'DELETE')
  if (res.ok) {
    mostrarToast('Exercício removido')
    carregarExercicios()
  }
}

async function registrarTreino() {
  const nome = document.getElementById('nome-treino').value.trim()
  if (!nome) {
    mostrarToast('Dê um nome ao treino')
    return
  }
  mostrarToast('Treino "' + nome + '" registrado!')
  document.getElementById('nome-treino').value = ''
}

// timer de descanso
function iniciarTimer() {
  setTimer(60)
}

function setTimer(segundos) {
  if (timerInterval) clearInterval(timerInterval)
  timerSegundos = segundos
  document.getElementById('timer-box').style.display = 'flex'
  atualizarDisplayTimer()

  timerInterval = setInterval(() => {
    timerSegundos--
    atualizarDisplayTimer()
    if (timerSegundos <= 0) {
      clearInterval(timerInterval)
      timerInterval = null
      mostrarToast('Descansou! Hora da próxima série.')
      document.getElementById('timer-box').style.display = 'none'
    }
  }, 1000)
}

function atualizarDisplayTimer() {
  const min = Math.floor(timerSegundos / 60)
  const seg = timerSegundos % 60
  document.getElementById('timer-display').textContent =
    min > 0 ? `${min}:${seg.toString().padStart(2,'0')}` : timerSegundos
}

function pararTimer() {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = null
  document.getElementById('timer-box').style.display = 'none'
}