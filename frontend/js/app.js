// endereço do backend
const API = 'http://localhost:3000/api'

// pega o token salvo no localStorage
function getToken() {
  return localStorage.getItem('token')
}

// mostra mensagem rapida na tela
function mostrarToast(msg) {
  const t = document.getElementById('toast')
  t.textContent = msg
  t.classList.add('visivel')
  setTimeout(() => t.classList.remove('visivel'), 2200)
}

// pega a data de hoje no formato YYYY-MM-DD
function hoje() {
  return new Date().toISOString().slice(0, 10)
}

// formata data pra exibir bonito
function formatarData(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'short'
  })
}

// troca de pagina
function irPara(pagina, btn) {
  document.querySelectorAll('.pagina').forEach(p => p.style.display = 'none')
  document.getElementById('pagina-' + pagina).style.display = 'flex'
  document.getElementById('pagina-' + pagina).style.flexDirection = 'column'

  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('ativo'))
  if (btn) btn.classList.add('ativo')

  // carrega os dados da pagina
  if (pagina === 'exercicios') {
    renderizarExercicios()
    atualizarGrafico()
  }
  if (pagina === 'medidas') {
    renderizarGraficoPeso()
    renderizarUltimoRegistro()
  }
  if (pagina === 'historico') renderizarHistorico()
  if (pagina === 'progresso') renderizarProgresso()
}

// faz requisicao pra API com o token
async function chamarAPI(rota, metodo, dados) {
  try {
    const config = {
      method: metodo || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      }
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

// verifica se tem sessao salva ao abrir o app
window.onload = function() {
  const token = getToken()
  const usuario = localStorage.getItem('usuario')

  if (token && usuario) {
    entrarNoApp()
  }
}