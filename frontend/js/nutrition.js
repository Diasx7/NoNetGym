let coposHoje = 0

async function carregarNutricao() {
  renderizarCopos()
  carregarCaloriasQueimadas()
}

function renderizarCopos() {
  const meta = 8
  let html = ''
  for (let i = 0; i < meta; i++) {
    html += `<div class="hidra-copo ${i < coposHoje ? 'cheio' : ''}">
      <i class="ti ti-droplet" style="font-size:14px"></i>
    </div>`
  }
  document.getElementById('hidra-copos').innerHTML = html
  document.getElementById('hidra-info').textContent = `${coposHoje} / ${meta} copos`
}

function adicionarCopo() {
  if (coposHoje >= 8) {
    mostrarToast('Meta de hidratação atingida!')
    return
  }
  coposHoje++
  renderizarCopos()
  if (coposHoje === 8) mostrarToast('Parabéns! Meta de hidratação atingida!')
}

function calcularTDEE() {
  const peso = parseFloat(document.getElementById('tdee-peso').value)
  const altura = parseFloat(document.getElementById('tdee-altura').value)
  const idade = parseFloat(document.getElementById('tdee-idade').value)
  const genero = document.getElementById('tdee-genero').value
  const atividade = parseFloat(document.getElementById('tdee-atividade').value)

  if (!peso || !altura || !idade) {
    mostrarToast('Preencha todos os campos')
    return
  }

  // formula de Mifflin-St Jeor
  let tmb
  if (genero === 'M') {
    tmb = 10 * peso + 6.25 * altura - 5 * idade + 5
  } else {
    tmb = 10 * peso + 6.25 * altura - 5 * idade - 161
  }

  const tdee = Math.round(tmb * atividade)
  const proteina = Math.round(peso * 2)
  const cutting = Math.round(tdee - 400)
  const bulking = Math.round(tdee + 300)

  const resultado = document.getElementById('tdee-resultado')
  resultado.style.display = 'grid'
  resultado.innerHTML = `
    <div class="tdee-item">
      <div class="t-lbl">Manutenção</div>
      <div class="t-val">${tdee}</div>
      <div class="t-sub">kcal/dia</div>
    </div>
    <div class="tdee-item">
      <div class="t-lbl">Proteína</div>
      <div class="t-val">${proteina}g</div>
      <div class="t-sub">por dia</div>
    </div>
    <div class="tdee-item">
      <div class="t-lbl">Cutting</div>
      <div class="t-val" style="color:#38bdf8">${cutting}</div>
      <div class="t-sub">kcal/dia</div>
    </div>
    <div class="tdee-item">
      <div class="t-lbl">Bulking</div>
      <div class="t-val" style="color:#4ade80">${bulking}</div>
      <div class="t-sub">kcal/dia</div>
    </div>
  `
}

async function carregarCaloriasQueimadas() {
  const res = await chamarAPI('/exercises', 'GET')
  const box = document.getElementById('calorias-queimadas')

  if (!res.ok || res.dados.length === 0) {
    box.innerHTML = '<div class="cal-vazio">Registre exercícios hoje para ver as calorias queimadas.</div>'
    return
  }

  const hojeStr = hoje()
  const exsHoje = res.dados.filter(e =>
    (e.exercise_date || e.date)?.slice(0,10) === hojeStr
  )

  if (exsHoje.length === 0) {
    box.innerHTML = '<div class="cal-vazio">Nenhum exercício registrado hoje.</div>'
    return
  }

  // estimativa simples: 0.1 kcal por kg * reps * series
  const usuario = getUsuario()
  const pesoUsuario = parseFloat(usuario?.weight_initial || 75)
  let total = 0

  exsHoje.forEach(e => {
    const volume = (e.sets||0) * (e.reps||0) * (parseFloat(e.weight)||pesoUsuario)
    total += volume * 0.0005
  })

  total = Math.round(total)

  box.innerHTML = `
    <div class="cal-total">${total} kcal</div>
    <div class="cal-sub">estimativa do treino de hoje · ${exsHoje.length} exercício${exsHoje.length > 1 ? 's' : ''}</div>
  `
}