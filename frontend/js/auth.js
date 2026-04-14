// troca entre aba de login e cadastro
function trocarAba(aba) {
  document.querySelectorAll('.aba').forEach((a, i) => {
    a.classList.toggle('ativa', (i === 0) === (aba === 'login'))
  })
  document.getElementById('form-login').style.display = aba === 'login' ? '' : 'none'
  document.getElementById('form-cadastro').style.display = aba === 'cadastro' ? '' : 'none'
}

async function fazerCadastro() {
  const nome = document.getElementById('cad-nome').value.trim()
  const email = document.getElementById('cad-email').value.trim()
  const senha = document.getElementById('cad-senha').value
  const idade = document.getElementById('cad-idade').value
  const genero = document.getElementById('cad-genero').value
  const peso = document.getElementById('cad-peso').value

  if (!nome || !email || !senha) {
    mostrarToast('Preencha nome, email e senha!')
    return
  }

  const res = await chamarAPI('/auth/register', 'POST', {
    name: nome,
    email: email,
    password: senha,
    age: idade || null,
    gender: genero || null,
    weight_initial: peso || null
  })

  if (res.ok) {
    mostrarToast('Conta criada! Faça login 🎉')
    trocarAba('login')
    document.getElementById('login-email').value = email
  } else {
    mostrarToast(res.dados.error || 'Erro ao criar conta')
  }
}

async function fazerLogin() {
  const email = document.getElementById('login-email').value.trim()
  const senha = document.getElementById('login-senha').value

  if (!email || !senha) {
    mostrarToast('Preencha email e senha!')
    return
  }

  const res = await chamarAPI('/auth/login', 'POST', {
    email: email,
    password: senha
  })

  if (res.ok) {
    // salva token e dados do usuario
    localStorage.setItem('token', res.dados.token)
    localStorage.setItem('usuario', JSON.stringify(res.dados.user))
    entrarNoApp()
  } else {
    mostrarToast(res.dados.error || 'Email ou senha incorretos')
  }
}

function entrarNoApp() {
  document.getElementById('tela-auth').style.display = 'none'
  document.getElementById('tela-app').style.display = 'block'
  atualizarDashboard()
}

function sair() {
  if (!confirm('Sair da conta?')) return
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  document.getElementById('tela-auth').style.display = 'flex'
  document.getElementById('tela-app').style.display = 'none'
}