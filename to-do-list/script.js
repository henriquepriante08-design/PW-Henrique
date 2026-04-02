
const inputTarefa  = document.getElementById('inputTarefa');
const inputData    = document.getElementById('inputData');
const btnAdicionar = document.getElementById('btnAdicionar');
const listaTarefas = document.getElementById('listaTarefas');
const contadorEl   = document.getElementById('contadorTexto');
const msgErro      = document.getElementById('msgErro');
const estadoVazio  = document.getElementById('estadoVazio');



let totalTarefas = 0;



inputTarefa.addEventListener('keydown', function (evento) {
  if (evento.key === 'Enter') {
    adicionarTarefa();
  }
});


function adicionarTarefa() {

  const textoTarefa = inputTarefa.value.trim();
  const dataEscolhida = inputData.value;


  if (textoTarefa === '') {
    exibirErro('Por favor, descreva a tarefa antes de adicionar.');
    inputTarefa.focus();
    return;
  }


  if (textoTarefa.length < 3) {
    exibirErro('A descrição deve ter no mínimo 3 caracteres.');
    inputTarefa.focus();
    return;
  }


  if (dataEscolhida === '') {
    exibirErro('Selecione uma data para a realização da tarefa.');
    inputData.focus();
    return;
  }

  limparErro();


  const itemLista = criarItemTarefa(textoTarefa, dataEscolhida);
  listaTarefas.appendChild(itemLista);


  inputTarefa.value = '';
  inputData.value   = '';

  totalTarefas++;
  atualizarContador();
  atualizarEstadoVazio();

  inputTarefa.focus();
}


function criarItemTarefa(texto, data) {

  const dataFormatada = formatarData(data);

  const li = document.createElement('li');
  li.classList.add('tarefa');


  const conteudo = document.createElement('div');
  conteudo.classList.add('tarefa-conteudo');

  const nomeTarefa = document.createElement('p');
  nomeTarefa.classList.add('tarefa-nome');
  nomeTarefa.textContent = texto;

  const badgeData = document.createElement('span');
  badgeData.classList.add('tarefa-data');
  badgeData.textContent = '📅 ' + dataFormatada;

  conteudo.appendChild(nomeTarefa);
  conteudo.appendChild(badgeData);

  const acoes = document.createElement('div');
  acoes.classList.add('tarefa-acoes');

  const btnConcluir = document.createElement('button');
  btnConcluir.classList.add('btn-concluir');
  btnConcluir.textContent = 'Concluir';
  btnConcluir.setAttribute('aria-label', 'Marcar tarefa como concluída');

  btnConcluir.addEventListener('click', function () {
    concluirTarefa(li, btnConcluir);
  });

  const btnRemover = document.createElement('button');
  btnRemover.classList.add('btn-remover');
  btnRemover.textContent = 'Remover';
  btnRemover.setAttribute('aria-label', 'Remover tarefa da lista');


  btnRemover.addEventListener('click', function () {
    removerTarefa(li);
  });

  acoes.appendChild(btnConcluir);
  acoes.appendChild(btnRemover);

  li.appendChild(conteudo);
  li.appendChild(acoes);

  return li;
}


function concluirTarefa(itemLi, botao) {

  const estaConcluida = itemLi.classList.contains('concluida');

  if (estaConcluida) {

    itemLi.classList.remove('concluida');
    botao.textContent = 'Concluir';
  } else {

    itemLi.classList.add('concluida');
    botao.textContent = 'Reabrir';
  }
}


function removerTarefa(itemLi) {

  listaTarefas.removeChild(itemLi);


  totalTarefas--;
  atualizarContador();
  atualizarEstadoVazio();
}


function atualizarContador() {

  const label = totalTarefas === 1 ? 'tarefa' : 'tarefas';
  contadorEl.textContent = totalTarefas + ' ' + label;
}



function atualizarEstadoVazio() {

  if (totalTarefas === 0) {
    estadoVazio.classList.add('visivel');
  } else {
    estadoVazio.classList.remove('visivel');
  }
}



function formatarData(dataISO) {


  const partes = dataISO.split('-');
  const ano    = partes[0];
  const mes    = partes[1];
  const dia    = partes[2];

  return dia + '/' + mes + '/' + ano;
}


function exibirErro(mensagem) {
  msgErro.textContent = mensagem;
}

function limparErro() {
  msgErro.textContent = '';
}



atualizarContador();
atualizarEstadoVazio();
