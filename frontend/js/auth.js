function mostrarCadastro() {
  document.getElementById('form-login').style.display = 'none'
  document.getElementById('form-cadastro').style.display = 'flex'
  document.getElementById('form-cadastro').style.flexDirection = 'column'
  document.getElementById('form-cadastro').style.gap = '12px'
}

function mostrarLogin() {
  document.getElementById('form-cadastro').style.display = 'none'
  document.getElementById('form-login').style.display = 'flex'
  document.getElementById('form-login').style.flexDirection = 'column'
  document.getElementById('form-login').style.gap = '12px'
}

async function fazerCadastro() {
  const nome = document.getElementById('cad-nome').value.trim()
  const email = document.getElementById('cad-email').value.trim()
  const senha = document.getElementById('cad-senha').value
  const idade = document.getElementById('cad-idade').value
  const genero = document.getElementById('cad-genero').value
  const peso = document.getElementById('cad-peso').value
  const altura = document.getElementById('cad-altura').value

  if (!nome || !email || !senha) {
    mostrarToast('Preencha nome, email e senha')
    return
  }

  const res = await chamarAPI('/auth/register', 'POST', {
    name: nome, email, password: senha,
    age: idade || null, gender: genero || null,
    weight_initial: peso || null, height: altura || null
  })

  if (res.ok) {
    mostrarToast('Conta criada! Faça login.')
    mostrarLogin()
  } else {
    mostrarToast(res.dados.error || 'Erro ao cadastrar')
  }
}

async function fazerLogin() {
  const email = document.getElementById('login-email').value.trim()
  const senha = document.getElementById('login-senha').value

  if (!email || !senha) {
    mostrarToast('Preencha email e senha')
    return
  }

  const res = await chamarAPI('/auth/login', 'POST', { email, password: senha })

  if (res.ok) {
    localStorage.setItem('token', res.dados.token)
    localStorage.setItem('usuario', JSON.stringify(res.dados.user))
    entrarNoApp(res.dados.user)
  } else {
    mostrarToast(res.dados.error || 'Email ou senha incorretos')
  }
}

function entrarNoApp(usuario) {
  document.getElementById('tela-auth').style.display = 'none'
  document.getElementById('tela-app').style.display = 'flex'
  document.getElementById('nome-usuario').textContent = usuario.name
  document.getElementById('saudacao').textContent = getSaudacao()
  carregarDashboard()
}