const PLANOS = [
  {
    tipo: 'Treino — Peito e Tríceps',
    refeicoes: [
      { nome: 'Café da manhã', horario: '07:00', kcal: 520, cor: '#1a1a00', icone: 'ti-sun', iconeCor: '#EF9F27',
        itens: [
          { nome: 'Omelete de 3 ovos com queijo cottage', macros: { p: '32g', c: '8g', g: '18g' }, preparo: 'Bata 3 ovos inteiros, adicione 2 col. sopa de cottage. Tempere com sal e pimenta. Cozinhe em frigideira antiaderente por 2 min cada lado.' },
          { nome: 'Pão integral com pasta de amendoim', macros: { p: '10g', c: '30g', g: '12g' }, preparo: '2 fatias de pão integral com 1 col. sopa de pasta de amendoim integral. Acompanhe com 1 copo de café preto sem açúcar.' }
        ]
      },
      { nome: 'Pré-treino', horario: '11:30', kcal: 420, cor: '#001a0a', icone: 'ti-bolt', iconeCor: '#4ade80',
        itens: [
          { nome: 'Frango grelhado com arroz e batata doce', macros: { p: '42g', c: '58g', g: '6g' }, preparo: '150g de frango grelhado com tempero verde. 100g de arroz integral cozido. 150g de batata doce cozida amassada com canela.' }
        ]
      },
      { nome: 'Pós-treino', horario: '14:30', kcal: 480, cor: '#001020', icone: 'ti-barbell', iconeCor: '#38bdf8',
        itens: [
          { nome: 'Whey protein com banana', macros: { p: '28g', c: '35g', g: '3g' }, preparo: '1 scoop de whey com 300ml de água ou leite desnatado. Acompanhe com 1 banana prata.' },
          { nome: 'Arroz com carne moída magra', macros: { p: '38g', c: '50g', g: '8g' }, preparo: '150g de arroz branco. 200g de carne moída patinho refogada com cebola, alho e tomate.' }
        ]
      },
      { nome: 'Jantar', horario: '20:00', kcal: 400, cor: '#1a0010', icone: 'ti-moon', iconeCor: '#c084fc',
        itens: [
          { nome: 'Tilápia grelhada com legumes', macros: { p: '38g', c: '12g', g: '8g' }, preparo: '200g de tilápia temperada com limão, alho e ervas finas. Grelhe por 4 min cada lado. Acompanhe com brócolis e abobrinha no vapor.' },
          { nome: 'Iogurte grego com chia', macros: { p: '18g', c: '12g', g: '4g' }, preparo: '200g de iogurte grego natural com 1 col. sopa de chia. Deixe descansar 10 min antes de consumir.' }
        ]
      }
    ]
  },
  {
    tipo: 'Descanso ativo — foco em recuperação',
    refeicoes: [
      { nome: 'Café da manhã', horario: '08:00', kcal: 450, cor: '#1a1a00', icone: 'ti-sun', iconeCor: '#EF9F27',
        itens: [{ nome: 'Vitamina de frutas com aveia', macros: { p: '15g', c: '55g', g: '8g' }, preparo: 'Bata no liquidificador: 1 banana, 1 maçã, 200ml de leite desnatado, 4 col. sopa de aveia e 1 col. sopa de mel.' }]
      },
      { nome: 'Almoço', horario: '12:30', kcal: 520, cor: '#001a0a', icone: 'ti-salad', iconeCor: '#4ade80',
        itens: [{ nome: 'Salada completa com frango desfiado', macros: { p: '40g', c: '25g', g: '12g' }, preparo: 'Folhas verdes + tomate + pepino + cenoura ralada. 180g de frango desfiado temperado. Molho de azeite com limão e mostarda.' }]
      },
      { nome: 'Lanche', horario: '16:00', kcal: 280, cor: '#1a1a00', icone: 'ti-apple', iconeCor: '#EF9F27',
        itens: [{ nome: 'Mix de castanhas e frutas secas', macros: { p: '8g', c: '22g', g: '18g' }, preparo: '30g de mix de castanha-do-pará, amêndoas e nozes. Acompanhe com 1 fruta de sua escolha.' }]
      },
      { nome: 'Jantar', horario: '19:30', kcal: 380, cor: '#1a0010', icone: 'ti-moon', iconeCor: '#c084fc',
        itens: [{ nome: 'Sopa de lentilha com legumes', macros: { p: '22g', c: '40g', g: '6g' }, preparo: 'Refogue cebola e alho. Adicione lentilha, cenoura, batata e caldo de legumes. Cozinhe 25 min. Tempere com cominho e pimenta.' }]
      }
    ]
  },
  {
    tipo: 'Treino — Costas e Bíceps',
    refeicoes: [
      { nome: 'Café da manhã', horario: '07:00', kcal: 500, cor: '#1a1a00', icone: 'ti-sun', iconeCor: '#EF9F27',
        itens: [{ nome: 'Tapioca com frango e queijo', macros: { p: '35g', c: '40g', g: '10g' }, preparo: 'Hidrate a goma de tapioca. Espalhe em frigideira quente até firmar. Recheie com 100g de frango desfiado e 30g de queijo branco.' }]
      },
      { nome: 'Pré-treino', horario: '11:00', kcal: 450, cor: '#001a0a', icone: 'ti-bolt', iconeCor: '#4ade80',
        itens: [{ nome: 'Macarrão integral com atum', macros: { p: '38g', c: '60g', g: '7g' }, preparo: '150g de macarrão integral cozido al dente. Misture 1 lata de atum em água escorrido, azeite, tomate e ervas frescas.' }]
      },
      { nome: 'Pós-treino', horario: '14:00', kcal: 500, cor: '#001020', icone: 'ti-barbell', iconeCor: '#38bdf8',
        itens: [
          { nome: 'Shake de whey com aveia e mel', macros: { p: '32g', c: '45g', g: '5g' }, preparo: 'Bata 1 scoop de whey, 4 col. sopa de aveia, 1 banana, 1 col. chá de mel e 300ml de leite desnatado.' },
          { nome: 'Peito de frango com quinoa', macros: { p: '45g', c: '40g', g: '6g' }, preparo: '200g de frango grelhado. 80g de quinoa cozida com caldo de legumes. Tempere com limão e salsinha.' }
        ]
      },
      { nome: 'Jantar', horario: '20:00', kcal: 380, cor: '#1a0010', icone: 'ti-moon', iconeCor: '#c084fc',
        itens: [{ nome: 'Ovo mexido com espinafre e tomate', macros: { p: '28g', c: '10g', g: '14g' }, preparo: '4 ovos mexidos com folhas de espinafre, tomate cereja e 1 fio de azeite. Tempere com sal, pimenta e noz-moscada.' }]
      }
    ]
  },
  {
    tipo: 'Descanso — alimentação leve',
    refeicoes: [
      { nome: 'Café da manhã', horario: '08:00', kcal: 380, cor: '#1a1a00', icone: 'ti-sun', iconeCor: '#EF9F27',
        itens: [{ nome: 'Iogurte grego com granola e frutas', macros: { p: '18g', c: '40g', g: '8g' }, preparo: '200g de iogurte grego, 3 col. sopa de granola sem açúcar, morangos e banana fatiada. Regue com mel.' }]
      },
      { nome: 'Almoço', horario: '12:30', kcal: 550, cor: '#001a0a', icone: 'ti-salad', iconeCor: '#4ade80',
        itens: [{ nome: 'Frango assado com batata e legumes', macros: { p: '45g', c: '45g', g: '10g' }, preparo: 'Tempere 200g de frango com alho, limão e ervas. Asse a 200°C por 35 min. Sirva com batata inglesa assada e cenoura.' }]
      },
      { nome: 'Lanche', horario: '16:00', kcal: 250, cor: '#1a1a00', icone: 'ti-apple', iconeCor: '#EF9F27',
        itens: [{ nome: 'Cottage com torradas integrais', macros: { p: '15g', c: '20g', g: '4g' }, preparo: '100g de cottage com 3 torradas integrais. Adicione fatias de tomate e folhas de manjericão.' }]
      },
      { nome: 'Jantar', horario: '19:30', kcal: 350, cor: '#1a0010', icone: 'ti-moon', iconeCor: '#c084fc',
        itens: [{ nome: 'Caldo verde com frango', macros: { p: '30g', c: '25g', g: '8g' }, preparo: 'Refogue alho e cebola. Adicione batata cozida amassada, couve fatiada e frango desfiado. Tempere com sal e azeite.' }]
      }
    ]
  },
  {
    tipo: 'Treino — Pernas e Glúteos',
    refeicoes: [
      { nome: 'Café da manhã', horario: '07:00', kcal: 560, cor: '#1a1a00', icone: 'ti-sun', iconeCor: '#EF9F27',
        itens: [{ nome: 'Panqueca de aveia com banana', macros: { p: '20g', c: '65g', g: '8g' }, preparo: 'Amasse 2 bananas maduras. Misture com 6 col. sopa de aveia, 2 ovos e 1 pitada de canela. Frite em frigideira antiaderente 2 min cada lado. Sirva com mel.' }]
      },
      { nome: 'Pré-treino', horario: '11:30', kcal: 500, cor: '#001a0a', icone: 'ti-bolt', iconeCor: '#4ade80',
        itens: [{ nome: 'Arroz com feijão e bife grelhado', macros: { p: '48g', c: '65g', g: '10g' }, preparo: '150g de arroz branco, 3 col. sopa de feijão carioca, 200g de bife de alcatra temperado e grelhado com alho e sal.' }]
      },
      { nome: 'Pós-treino', horario: '15:00', kcal: 520, cor: '#001020', icone: 'ti-barbell', iconeCor: '#38bdf8',
        itens: [
          { nome: 'Batata doce com frango e brócolis', macros: { p: '45g', c: '55g', g: '6g' }, preparo: '200g de batata doce assada. 180g de frango grelhado com tempero. Brócolis no vapor com limão e azeite.' },
          { nome: 'Suco de beterraba com gengibre', macros: { p: '2g', c: '22g', g: '0g' }, preparo: 'Bata 1 beterraba média com 1 maçã, 1 cenoura, suco de 1 limão e 1 pedaço de gengibre.' }
        ]
      },
      { nome: 'Jantar', horario: '20:00', kcal: 420, cor: '#1a0010', icone: 'ti-moon', iconeCor: '#c084fc',
        itens: [{ nome: 'Salmão com aspargos e arroz integral', macros: { p: '42g', c: '35g', g: '16g' }, preparo: 'Grelhe 200g de salmão com limão e endro por 4 min cada lado. Sirva com 100g de arroz integral e aspargos grelhados com azeite.' }]
      }
    ]
  },
  {
    tipo: 'Treino — Ombros e Abdômen',
    refeicoes: [
      { nome: 'Café da manhã', horario: '08:00', kcal: 480, cor: '#1a1a00', icone: 'ti-sun', iconeCor: '#EF9F27',
        itens: [{ nome: 'Açaí bowl proteico', macros: { p: '22g', c: '60g', g: '10g' }, preparo: 'Bata 200g de açaí congelado com 1 banana. Adicione granola, frutas frescas, 1 col. sopa de pasta de amendoim e 1 scoop de whey.' }]
      },
      { nome: 'Pré-treino', horario: '10:30', kcal: 400, cor: '#001a0a', icone: 'ti-bolt', iconeCor: '#4ade80',
        itens: [{ nome: 'Wrap integral com frango e abacate', macros: { p: '38g', c: '42g', g: '16g' }, preparo: 'Tortilha integral com 150g de frango desfiado, 1/2 abacate amassado, tomate, alface e molho de iogurte com limão.' }]
      },
      { nome: 'Pós-treino', horario: '13:00', kcal: 550, cor: '#001020', icone: 'ti-barbell', iconeCor: '#38bdf8',
        itens: [{ nome: 'Massa integral com molho de tomate e carne', macros: { p: '42g', c: '70g', g: '10g' }, preparo: '150g de macarrão integral. Refogue 200g de carne moída magra com molho de tomate caseiro, cebola e alho. Finalize com queijo parmesão.' }]
      },
      { nome: 'Jantar', horario: '20:00', kcal: 360, cor: '#1a0010', icone: 'ti-moon', iconeCor: '#c084fc',
        itens: [{ nome: 'Frango ao forno com batata rústica', macros: { p: '40g', c: '38g', g: '8g' }, preparo: 'Tempere 200g de frango com paprica, alho, limão e azeite. Asse a 200°C por 30 min. Sirva com batatas cortadas em cubos assadas com ervas.' }]
      }
    ]
  },
  {
    tipo: 'Descanso total — refeição livre controlada',
    refeicoes: [
      { nome: 'Café da manhã', horario: '09:00', kcal: 500, cor: '#1a1a00', icone: 'ti-sun', iconeCor: '#EF9F27',
        itens: [{ nome: 'French toast proteico', macros: { p: '28g', c: '45g', g: '12g' }, preparo: 'Bata 2 ovos com 100ml de leite e canela. Mergulhe 2 fatias de pão integral. Frite em manteiga até dourar. Sirva com frutas e mel.' }]
      },
      { nome: 'Almoço em família', horario: '13:00', kcal: 650, cor: '#001a0a', icone: 'ti-salad', iconeCor: '#4ade80',
        itens: [{ nome: 'Refeição livre com foco em proteína', macros: { p: '45g', c: '60g', g: '20g' }, preparo: 'Domingo é dia de flexibilidade! Priorize proteína e verduras. Pode incluir um carboidrato especial — apenas controle a porção.' }]
      },
      { nome: 'Lanche', horario: '16:30', kcal: 300, cor: '#1a1a00', icone: 'ti-apple', iconeCor: '#EF9F27',
        itens: [{ nome: 'Crepioca com recheio doce', macros: { p: '16g', c: '28g', g: '8g' }, preparo: 'Misture 2 ovos com 2 col. sopa de tapioca. Cozinhe em frigideira. Recheie com banana amassada, canela e mel.' }]
      },
      { nome: 'Jantar leve', horario: '20:00', kcal: 320, cor: '#1a0010', icone: 'ti-moon', iconeCor: '#c084fc',
        itens: [{ nome: 'Omelete de claras com legumes', macros: { p: '30g', c: '8g', g: '10g' }, preparo: 'Bata 4 claras e 1 ovo inteiro. Adicione pimentão, cebola e tomate picados. Cozinhe tampado por 4 min. Finalize com queijo ralado.' }]
      }
    ]
  }
]

let diaAtual = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

function selecionarDia(btn, idx) {
  document.querySelectorAll('.dia-btn').forEach(b => b.classList.remove('on'))
  btn.classList.add('on')
  diaAtual = idx
  renderizarPlanoDia(idx)
}

function renderizarPlanoDia(idx) {
  const plano = PLANOS[idx]
  const container = document.getElementById('plano-dia')
  let html = `<div class="plano-tipo"><i class="ti ti-calendar-event"></i> ${plano.tipo}</div>`
  plano.refeicoes.forEach((r, i) => {
    html += `
      <div class="refeicao-card" style="animation:cardIn .3s ease ${i * 0.08}s both">
        <div class="refeicao-header" onclick="toggleRefeicao(this)">
          <div class="refeicao-icon" style="background:${r.cor}"><i class="ti ${r.icone}" style="color:${r.iconeCor}"></i></div>
          <div style="flex:1">
            <div class="refeicao-titulo">${r.nome}</div>
            <div class="refeicao-horario">${r.horario}</div>
          </div>
          <div class="refeicao-kcal">${r.kcal} kcal</div>
          <i class="ti ti-chevron-down refeicao-chevron"></i>
        </div>
        <div class="refeicao-body">
          <div class="refeicao-itens">
            ${r.itens.map(item => `
              <div class="refeicao-item">
                <div class="refeicao-nome">${item.nome}</div>
                <div class="refeicao-macro">
                  <span class="macro p">${item.macros.p} prot</span>
                  <span class="macro c">${item.macros.c} carb</span>
                  <span class="macro g">${item.macros.g} gord</span>
                </div>
                <div class="refeicao-preparo">${item.preparo}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`
  })
  container.innerHTML = html
}

function toggleRefeicao(el) {
  el.closest('.refeicao-card').classList.toggle('aberto')
}

function carregarAlimentar() {
  const btns = document.querySelectorAll('.dia-btn')
  btns.forEach(b => b.classList.remove('on'))
  if (btns[diaAtual]) btns[diaAtual].classList.add('on')
  renderizarPlanoDia(diaAtual)
}