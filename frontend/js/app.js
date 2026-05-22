const API = 'https://nonetgym-production.up.railway.app/api'

function getToken() { return localStorage.getItem('token') }
function getUsuario() { const u = localStorage.getItem('usuario'); return u ? JSON.parse(u) : null }

function mostrarToast(msg) {
  const t = document.getElementById('toast')
  t.textContent = msg
  t.classList.add('visivel')
  setTimeout(() => t.classList.remove('visivel'), 2500)
}

function hoje() { return new Date().toISOString().slice(0, 10) }

function formatarData(d) {
  if (!d) return ''
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getSaudacao() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function irPara(pagina, btn) {
  document.querySelectorAll('.pagina').forEach(p => p.style.display = 'none')
  document.getElementById('pagina-' + pagina).style.display = 'flex'
  document.querySelectorAll('.nb').forEach(b => b.classList.remove('on'))
  if (btn) btn.classList.add('on')

  if (pagina === 'dashboard') carregarDashboard()
  if (pagina === 'treino') carregarExercicios()
  if (pagina === 'medidas') carregarMedidas()
  if (pagina === 'historico') carregarHistorico()
  if (pagina === 'progresso') carregarProgresso()
  if (pagina === 'nutricao') carregarNutricao()
  if (pagina === 'alimentar') carregarAlimentar()
}

async function chamarAPI(rota, metodo, dados) {
  try {
    const config = {
      method: metodo || 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() }
    }
    if (dados) config.body = JSON.stringify(dados)
    const res = await fetch(API + rota, config)
    const json = await res.json()
    return { ok: res.ok, dados: json }
  } catch (e) {
    console.log('erro na api:', e)
    return { ok: false, dados: { error: 'Erro de conexão' } }
  }
}

function abrirModalExercicio() { document.getElementById('modal-exercicio').style.display = 'flex' }
function abrirModalMedida() { document.getElementById('modal-medida').style.display = 'flex' }
function fecharModal(id) { document.getElementById(id).style.display = 'none' }

function selecionarFicha(btn, nome) {
  document.querySelectorAll('.ficha-btn').forEach(b => b.classList.remove('on'))
  btn.classList.add('on')
  document.getElementById('nome-treino').value = nome
  document.getElementById('ficha-nome-atual').textContent = nome
}

function sair() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  document.getElementById('tela-app').style.display = 'none'
  document.getElementById('tela-auth').style.display = 'flex'
}

window.onload = function() {
  const token = getToken()
  const usuario = getUsuario()
  if (token && usuario) entrarNoApp(usuario)
}