
/* =====================================================
   1. PRODUTOS
   Array com todos os produtos da loja.
   Cada objeto tem: id, nome, preço, emoji e categoria.
===================================================== */
const produtos = [
  { id: 1,  nome: "Mouse Gamer",      preco: 89.90,  emoji: "🖱️",  categoria: "Periférico"    },
  { id: 2,  nome: "Teclado Mecânico", preco: 149.90, emoji: "⌨️",  categoria: "Periférico"    },
  { id: 3,  nome: "Headset USB",      preco: 45.00,  emoji: "🎧",  categoria: "Áudio"         },
  { id: 4,  nome: "Webcam HD",        preco: 120.00, emoji: "📷",  categoria: "Câmera"        },
  { id: 5,  nome: "Mousepad XL",      preco: 35.90,  emoji: "🟫",  categoria: "Acessório"     },
  { id: 6,  nome: "Hub USB-C",        preco: 49.90,  emoji: "🔌",  categoria: "Conectivo"     },
  { id: 7,  nome: 'Monitor 24"',      preco: 899.00, emoji: "🖥️",  categoria: "Display"       },
  { id: 8,  nome: "Cabo HDMI 2m",     preco: 22.90,  emoji: "📺",  categoria: "Cabo"          },
  { id: 9,  nome: "SSD 480GB",        preco: 189.00, emoji: "💾",  categoria: "Armazenamento" },
  { id: 10, nome: "Suporte Notebook", preco: 68.00,  emoji: "💻",  categoria: "Ergonomia"     },
];


/* =====================================================
   2. ESTADO DA APLICAÇÃO
   Variáveis que guardam o que está acontecendo agora.
   Quando mudam, a interface é redesenhada.
===================================================== */
let carrinho  = [];        // lista de itens adicionados pelo usuário
let desconto  = 0;         // percentual de desconto ativo (0 a 100)
let startTime = Date.now(); // momento em que a página foi aberta (para o uptime)


/* =====================================================
   3. REFERÊNCIAS AO DOM
   Captura cada elemento HTML pelo id, uma única vez.
   Assim não precisamos buscar no HTML a cada uso.
===================================================== */
const productGrid       = document.querySelector("#productGrid");       // onde os cards de produto aparecem
const filterSelect      = document.querySelector("#filterSelect");      // select oculto de filtro
const cartItems         = document.querySelector("#cartItems");         // lista de itens na janela do cart
const cartEmpty         = document.querySelector("#cartEmpty");         // mensagem "carrinho vazio"
const totalValue        = document.querySelector("#totalValue");        // total na sidenav
const totalDisplayCart  = document.querySelector("#totalDisplayCart");  // total na janela do cart
const subtotalDisplay   = document.querySelector("#subtotalDisplay");   // subtotal na janela
const discountDisplay   = document.querySelector("#discountDisplay");   // valor do desconto na janela
const discountLine      = document.querySelector("#discountLine");      // linha de desconto (oculta/visível)
const cartCountBadge    = document.querySelector("#cartCountBadge");    // número no botão CART.EXE
const btnClearCart      = document.querySelector("#btnClearCart");      // botão FLUSH CART
const btnApplyDiscount  = document.querySelector("#btnApplyDiscount");  // botão EXEC do desconto
const discountInput     = document.querySelector("#discountInput");     // campo de % de desconto
const discountInfo      = document.querySelector("#discountInfo");      // feedback do desconto
const btnCheckout       = document.querySelector("#btnCheckout");       // botão EXECUTE CHECKOUT
const toastEl           = document.querySelector("#toast");             // notificação flutuante
const cartModal         = document.querySelector("#cartModal");         // a janela do carrinho
const cartBackdrop      = document.querySelector("#cartBackdrop");      // fundo escurecido
const btnOpenCart       = document.querySelector("#btnOpenCart");       // botão que abre o cart
const btnCloseCart      = document.querySelector("#btnCloseCart");      // botão ✕ que fecha o cart
const productCount      = document.querySelector("#productCount");      // contador de produtos na sidenav
const cartItemCount     = document.querySelector("#cartItemCount");     // contador de itens na sidenav
const discountStatus    = document.querySelector("#discountStatus");    // % de desconto na sidenav
const logText           = document.querySelector("#logText");           // texto da linha de log
const topClock          = document.querySelector("#topClock");          // relógio na topbar
const sessionIdEl       = document.querySelector("#sessionId");         // ID da sessão na sidenav
const uptimeEl          = document.querySelector("#uptime");            // tempo ativo na sidenav
const cartPidEl         = document.querySelector("#cartPid");           // PID da janela do cart


/* =====================================================
   4. listarProdutos(lista)
   Recebe um array de produtos e cria os cards na tela.
   Chamada ao carregar a página e ao filtrar.
===================================================== */
function listarProdutos(lista) {

  // Limpa o grid antes de desenhar (evita duplicar cards)
  productGrid.innerHTML = "";

  // Atualiza o contador de produtos na sidenav
  if (productCount) {
    productCount.textContent = lista.length;
  }

  // Se não há produtos para mostrar, exibe aviso e para
  if (lista.length === 0) {
    const aviso = document.createElement("p");
    aviso.textContent = "// nenhum módulo encontrado para este filtro";
    aviso.style.cssText = "color:var(--text-muted);font-size:11px;grid-column:1/-1;padding:20px;letter-spacing:0.08em;";
    productGrid.appendChild(aviso);
    return; // sai da função aqui
  }

  // Para cada produto, cria um card e o coloca na grade
  lista.forEach(function(produto, index) {

    // Elemento principal do card
    const modulo = document.createElement("div");
    modulo.classList.add("product-module");
    // Delay escalonado: cada card aparece um pouco depois do anterior
    modulo.style.animationDelay = (index * 0.045) + "s";

    // Linha de varredura que passa no hover (efeito visual)
    const scanLine = document.createElement("div");
    scanLine.classList.add("module-scan-line");

    // ID decorativo no canto: MOD-01, MOD-02...
    // padStart(2,"0") garante sempre 2 dígitos: 1 → "01"
    const pid = document.createElement("span");
    pid.classList.add("module-id");
    pid.textContent = "MOD-" + String(produto.id).padStart(2, "0");

    // Tag de categoria com barra lateral ciano
    const cat = document.createElement("div");
    cat.classList.add("module-category");
    cat.textContent = produto.categoria;

    // Ícone emoji do produto
    const emoji = document.createElement("div");
    emoji.classList.add("module-emoji");
    emoji.textContent = produto.emoji;

    // Nome do produto
    const nome = document.createElement("p");
    nome.classList.add("module-name");
    nome.textContent = produto.nome;

    // Preço formatado (ex: R$ 89,90)
    const preco = document.createElement("p");
    preco.classList.add("module-price");
    preco.textContent = formatarMoeda(produto.preco);

    // Botão de adicionar ao carrinho
    const btn = document.createElement("button");
    btn.classList.add("btn-add-module");
    btn.textContent = "ADD TO CART";
    // Ao clicar, chama adicionarAoCarrinho com este produto
    btn.addEventListener("click", function() {
      adicionarAoCarrinho(produto);
    });

    // Monta o card inserindo todos os filhos
    modulo.appendChild(scanLine);
    modulo.appendChild(pid);
    modulo.appendChild(cat);
    modulo.appendChild(emoji);
    modulo.appendChild(nome);
    modulo.appendChild(preco);
    modulo.appendChild(btn);

    // Insere o card finalizado na grade
    productGrid.appendChild(modulo);
  });

  // Atualiza a linha de log com quantos produtos foram carregados
  logSistema(lista.length + " módulos carregados no catálogo.");
}


/* =====================================================
   5. filtrarProdutos()
   Lê o filtro selecionado e exibe só os produtos que
   se encaixam. Chamada ao clicar nos botões do sidenav.
===================================================== */
function filtrarProdutos() {
  const filtro = filterSelect.value; // "todos", "ate50" ou "acima50"
  let listaFiltrada;

  switch (filtro) {
    case "ate50":
      // filter() cria novo array só com produtos baratos
      listaFiltrada = produtos.filter(function(p) { return p.preco <= 50; });
      logSistema("filtro aplicado: preço ≤ R$50 — " + listaFiltrada.length + " resultado(s).");
      break;

    case "acima50":
      listaFiltrada = produtos.filter(function(p) { return p.preco > 50; });
      logSistema("filtro aplicado: preço > R$50 — " + listaFiltrada.length + " resultado(s).");
      break;

    default: // "todos" — sem filtro
      listaFiltrada = produtos;
      logSistema("filtro removido. exibindo todos os módulos.");
      break;
  }

  listarProdutos(listaFiltrada); // redesenha os cards com a lista filtrada
}


/* =====================================================
   6. adicionarAoCarrinho(produto)
   Se o produto já está no carrinho: aumenta a quantidade.
   Se não está: cria um novo item com quantidade 1.
===================================================== */
function adicionarAoCarrinho(produto) {

  // Procura no carrinho um item com o mesmo id
  const itemExistente = carrinho.find(function(item) {
    return item.id === produto.id;
  });

  if (itemExistente) {
    // Já existe: só incrementa a quantidade
    itemExistente.quantidade += 1;
    exibirToast(produto.nome + " — quantidade atualizada");
    logSistema("update: " + produto.nome + " × " + itemExistente.quantidade);
  } else {
    // Não existe: cria novo objeto copiando o produto e adicionando quantidade
    // O spread (...produto) copia todas as propriedades do objeto
    carrinho.push({ ...produto, quantidade: 1 });
    exibirToast(produto.nome + " adicionado ao cart");
    logSistema("mount: " + produto.nome.toLowerCase() + " → cart.");
  }

  // Atualiza tudo que depende do carrinho
  renderCarrinho();
  atualizarTotal();
  atualizarBadgeHeader();
  salvarNoStorage();
}


/* =====================================================
   7. removerDoCarrinho(id)
   Se o item tem mais de 1 unidade: diminui a quantidade.
   Se tem só 1: remove o item completamente.
===================================================== */
function removerDoCarrinho(id) {

  // Encontra a posição (índice) do item no array
  const index = carrinho.findIndex(function(item) { return item.id === id; });
  if (index === -1) return; // não encontrou, sai

  if (carrinho[index].quantidade > 1) {
    // Tem mais de 1: diminui
    carrinho[index].quantidade -= 1;
  } else {
    // Tem 1: remove do array com splice
    const nome = carrinho[index].nome;
    carrinho.splice(index, 1); // remove 1 elemento a partir do índice
    exibirToast(nome + " removido");
    logSistema("unmount: " + nome.toLowerCase() + " ← cart.");
  }

  renderCarrinho();
  atualizarTotal();
  atualizarBadgeHeader();
  salvarNoStorage();
}


/* =====================================================
   8. limparCarrinho()
   Remove todos os itens do carrinho após confirmar.
===================================================== */
function limparCarrinho() {
  if (carrinho.length === 0) return; // nada para limpar

  // Caixa de confirmação nativa do navegador
  const confirmar = confirm("FLUSH CART\n\nConfirmar remoção de todos os itens?");
  if (!confirmar) return; // usuário cancelou

  // Reseta tudo
  carrinho  = [];
  desconto  = 0;
  discountInput.value      = "";
  discountInfo.textContent = "";

  renderCarrinho();
  atualizarTotal();
  atualizarBadgeHeader();
  salvarNoStorage();
  exibirToast("cart flushed — todos os itens removidos");
  logSistema("flush complete — cart cleared.");
}


/* =====================================================
   9. renderCarrinho()
   Apaga e reconstrói a lista de itens na janela do cart.
   Chamada sempre que o carrinho muda.
===================================================== */
function renderCarrinho() {
  cartItems.innerHTML = ""; // limpa a lista atual
  toggleCarrinhoVazio();    // mostra ou oculta "carrinho vazio"

  // Atualiza o contador de itens na sidenav
  if (cartItemCount) {
    const total = carrinho.reduce(function(acc, i) { return acc + i.quantidade; }, 0);
    cartItemCount.textContent = total;
  }

  // Para cada item no carrinho, cria uma linha na lista
  carrinho.forEach(function(item) {

    const div = document.createElement("div");
    div.classList.add("cart-item");

    // Miniatura com o emoji
    const thumb = document.createElement("div");
    thumb.classList.add("cart-item-thumb");
    thumb.textContent = item.emoji;

    // Bloco de informações: nome e preço total do item
    const info = document.createElement("div");
    info.classList.add("cart-item-info");

    const nomeEl = document.createElement("p");
    nomeEl.classList.add("cart-item-name");
    nomeEl.textContent = item.nome;

    const precoEl = document.createElement("p");
    precoEl.classList.add("cart-item-price");
    precoEl.textContent = formatarMoeda(item.quantidade * item.preco); // preço × qtd

    info.appendChild(nomeEl);
    info.appendChild(precoEl);

    // Controles de quantidade: botão −, número, botão +
    const controls = document.createElement("div");
    controls.classList.add("cart-item-controls");

    const btnMenos = document.createElement("button");
    btnMenos.classList.add("qty-btn");
    btnMenos.textContent = "−";
    btnMenos.addEventListener("click", function() { removerDoCarrinho(item.id); });

    const qtyDisplay = document.createElement("span");
    qtyDisplay.classList.add("qty-display");
    qtyDisplay.textContent = item.quantidade;

    const btnMais = document.createElement("button");
    btnMais.classList.add("qty-btn");
    btnMais.textContent = "+";
    btnMais.addEventListener("click", function() { adicionarAoCarrinho(item); });

    controls.appendChild(btnMenos);
    controls.appendChild(qtyDisplay);
    controls.appendChild(btnMais);

    // Botão ✕ que remove o item inteiro (independente da quantidade)
    const btnRemove = document.createElement("button");
    btnRemove.classList.add("btn-remove");
    btnRemove.textContent = "✕";
    btnRemove.title = "Remover item";
    btnRemove.addEventListener("click", function() {
      item.quantidade = 1; // força quantidade 1
      removerDoCarrinho(item.id); // remove esse 1 → item some
    });

    // Monta a linha do item
    div.appendChild(thumb);
    div.appendChild(info);
    div.appendChild(controls);
    div.appendChild(btnRemove);
    cartItems.appendChild(div);
  });
}


/* =====================================================
   10. atualizarTotal()
   Calcula subtotal, desconto e total final.
   Atualiza tanto a janela do cart quanto a sidenav.
===================================================== */
function atualizarTotal() {

  // reduce() percorre o array somando quantidade × preço de cada item
  // acc é o acumulador, começa em 0
  const subtotal   = carrinho.reduce(function(acc, item) {
    return acc + (item.quantidade * item.preco);
  }, 0);

  const valorDesc  = subtotal * (desconto / 100); // quanto é o desconto em R$
  const totalFinal = subtotal - valorDesc;

  // Atualiza os elementos na janela do cart
  if (subtotalDisplay)  subtotalDisplay.textContent  = formatarMoeda(subtotal);
  if (totalDisplayCart) totalDisplayCart.textContent = formatarMoeda(totalFinal);

  // Mostra ou esconde a linha de desconto
  if (discountLine) {
    if (desconto > 0 && subtotal > 0) {
      if (discountDisplay) discountDisplay.textContent = "− " + formatarMoeda(valorDesc);
      discountLine.style.display = "flex"; // torna visível
    } else {
      discountLine.style.display = "none"; // esconde
    }
  }

  // Atualiza os elementos na sidenav
  if (totalValue)     totalValue.textContent     = formatarMoeda(totalFinal);
  if (discountStatus) discountStatus.textContent = desconto + "%";

  // Desabilita o botão de checkout se o carrinho estiver vazio
  if (btnCheckout) btnCheckout.disabled = (carrinho.length === 0);
}


/* =====================================================
   11. aplicarDesconto()
   Lê o valor digitado no campo e aplica como desconto.
   Valida se está entre 0 e 100.
===================================================== */
function aplicarDesconto() {

  // parseInt converte a string do input para número inteiro
  const valor = parseInt(discountInput.value, 10);

  // Validação: deve ser um número entre 0 e 100
  if (isNaN(valor) || valor < 0 || valor > 100) {
    discountInfo.textContent = "// erro: valor deve estar entre 0 e 100";
    discountInfo.style.color = "var(--red)";
    return; // sai sem aplicar
  }

  desconto = valor; // salva o desconto no estado
  atualizarTotal();
  salvarNoStorage();

  if (valor === 0) {
    discountInfo.textContent = "// desconto removido";
    discountInfo.style.color = "var(--text-muted)";
  } else {
    discountInfo.textContent = "// desconto de " + valor + "% aplicado com sucesso";
    discountInfo.style.color = "var(--glow-dim)";
    exibirToast("Desconto de " + valor + "% aplicado!");
    logSistema("apply --discount=" + valor + "% executado com sucesso.");
  }
}


/* =====================================================
   12. finalizarCompra()
   Simula o checkout: confirma, limpa o carrinho e fecha
   a janela. Em um projeto real, enviaria para o servidor.
===================================================== */
function finalizarCompra() {
  if (carrinho.length === 0) return; // não faz nada se vazio

  // Pega o total atual para mostrar na confirmação
  const totalAtual = totalDisplayCart ? totalDisplayCart.textContent : totalValue.textContent;
  const confirmar  = confirm("EXECUTE CHECKOUT\n\nTotal: " + totalAtual + "\nConfirmar pedido?");
  if (!confirmar) return;

  // Limpa tudo após confirmar
  carrinho  = [];
  desconto  = 0;
  discountInput.value      = "";
  discountInfo.textContent = "";

  renderCarrinho();
  atualizarTotal();
  atualizarBadgeHeader();
  salvarNoStorage();
  fecharCarrinho();
  exibirToast("Compra finalizada com sucesso! Obrigado 🎉");
  logSistema("checkout executado. pedido confirmado — obrigado!");
}


/* =====================================================
   13. salvarNoStorage()
   Salva o carrinho e o desconto no localStorage do
   navegador. Os dados ficam mesmo ao recarregar a página.
===================================================== */
function salvarNoStorage() {
  // JSON.stringify converte o array para texto (localStorage só aceita texto)
  localStorage.setItem("shopcart_carrinho", JSON.stringify(carrinho));
  localStorage.setItem("shopcart_desconto", String(desconto));
}


/* =====================================================
   14. carregarDoStorage()
   Recupera os dados salvos ao abrir a página.
   Restaura o carrinho e o desconto da sessão anterior.
===================================================== */
function carregarDoStorage() {
  const carrinhoSalvo = localStorage.getItem("shopcart_carrinho");
  const descontoSalvo = localStorage.getItem("shopcart_desconto");

  if (carrinhoSalvo) {
    // JSON.parse converte o texto de volta para array de objetos
    carrinho = JSON.parse(carrinhoSalvo);
  }

  if (descontoSalvo) {
    desconto = parseInt(descontoSalvo, 10) || 0; // || 0 garante que não seja NaN
    if (desconto > 0) {
      discountInput.value      = desconto;
      discountInfo.textContent = "// desconto de " + desconto + "% ativo (sessão restaurada)";
      discountInfo.style.color = "var(--glow-dim)";
    }
  }
}


/* =====================================================
   15. atualizarBadgeHeader()
   Atualiza o número no botão CART.EXE da topbar.
   Soma todas as quantidades de todos os itens.
===================================================== */
function atualizarBadgeHeader() {

  // reduce() soma a quantidade de cada item no carrinho
  const totalItens = carrinho.reduce(function(acc, item) {
    return acc + item.quantidade;
  }, 0);

  cartCountBadge.textContent = totalItens;

  // Truque para reiniciar a animação de "bump":
  // remove a classe, espera o navegador processar, adiciona de novo
  cartCountBadge.classList.remove("bump");
  setTimeout(function() { cartCountBadge.classList.add("bump"); }, 0);
}


/* =====================================================
   16. toggleCarrinhoVazio()
   Mostra "NULL POINTER / carrinho vazio" se não há itens.
   Esconde quando há pelo menos 1 item.
===================================================== */
function toggleCarrinhoVazio() {
  if (carrinho.length === 0) {
    cartEmpty.classList.add("visible");    // CSS exibe o elemento
  } else {
    cartEmpty.classList.remove("visible"); // CSS oculta o elemento
  }
}


/* =====================================================
   17. exibirToast(mensagem)
   Mostra uma notificação no rodapé da tela por 2,5s.
===================================================== */
function exibirToast(mensagem) {
  toastEl.textContent = mensagem;
  toastEl.classList.add("show"); // CSS: torna visível com animação

  // Após 2500ms, remove a classe e o toast some
  setTimeout(function() { toastEl.classList.remove("show"); }, 2500);
}


/* =====================================================
   18. abrirCarrinho()
   Mostra a janela do carrinho e o fundo escurecido.
   Bloqueia o scroll da página enquanto a janela está aberta.
===================================================== */
function abrirCarrinho() {
  cartModal.classList.add("open");    // CSS: escala de 0.94 para 1 + opacity 0→1
  cartBackdrop.classList.add("open"); // CSS: fundo escurecido aparece
  document.body.style.overflow = "hidden"; // impede scroll da página
  logSistema("CART.EXE iniciado — PID: " + (cartPidEl ? cartPidEl.textContent : "4096"));
}


/* =====================================================
   19. fecharCarrinho()
   Oculta a janela e o fundo. Reativa o scroll.
===================================================== */
function fecharCarrinho() {
  cartModal.classList.remove("open");
  cartBackdrop.classList.remove("open");
  document.body.style.overflow = ""; // volta ao normal
}


/* =====================================================
   20. logSistema(msg)
   Atualiza o texto na linha de log do rodapé do viewport.
   Chamada após cada ação para registrar o que aconteceu.
===================================================== */
function logSistema(msg) {
  if (!logText) return; // sai se o elemento não existir
  logText.textContent = msg;
}


/* =====================================================
   21. atualizarRelogio()
   Atualiza o relógio na topbar e o uptime na sidenav.
   Chamada a cada 1 segundo pelo setInterval.
===================================================== */
function atualizarRelogio() {

  // Hora atual formatada como HH:MM:SS
  const agora = new Date();
  const h = String(agora.getHours()).padStart(2, "0");   // ex: 9 → "09"
  const m = String(agora.getMinutes()).padStart(2, "0");
  const s = String(agora.getSeconds()).padStart(2, "0");
  if (topClock) topClock.textContent = h + ":" + m + ":" + s;

  // Uptime: quantos segundos desde que a página abriu
  const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
  const um = String(Math.floor(elapsedSec / 60)).padStart(2, "0"); // minutos
  const us = String(elapsedSec % 60).padStart(2, "0");             // segundos restantes
  if (uptimeEl) uptimeEl.textContent = um + ":" + us;
}


/* =====================================================
   22. iniciarSessao()
   Gera um ID de sessão aleatório (ex: "A3F2B9C1") e
   um PID aleatório para a janela do cart.
===================================================== */
function iniciarSessao() {
  const chars = "ABCDEF0123456789"; // caracteres possíveis
  let id = "";

  // Sorteia 8 caracteres para montar o ID
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  if (sessionIdEl) sessionIdEl.textContent = id;
  // PID aleatório entre 2000 e 9999
  if (cartPidEl)   cartPidEl.textContent   = Math.floor(Math.random() * 8000 + 2000);
}


/* =====================================================
   AUXILIAR — formatarMoeda(valor)
   Converte um número para o formato monetário brasileiro.
   Exemplo: 89.9 → "R$ 89,90"
===================================================== */
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}


/* =====================================================
   23. INICIALIZAÇÃO — DOMContentLoaded
   Tudo aqui só roda depois que o HTML foi completamente
   carregado. Garante que todos os elementos existem.
===================================================== */
document.addEventListener("DOMContentLoaded", function() {

  // Gera sessão e inicia o relógio
  iniciarSessao();
  atualizarRelogio();
  setInterval(atualizarRelogio, 1000); // atualiza a cada 1 segundo

  // Carrega dados salvos e desenha a tela inicial
  carregarDoStorage();
  listarProdutos(produtos);
  renderCarrinho();
  atualizarTotal();
  atualizarBadgeHeader();


  /* ── EVENTOS ── */

  // Botão CART.EXE abre a janela
  btnOpenCart.addEventListener("click", abrirCarrinho);

  // Botão ✕ da janela a fecha
  btnCloseCart.addEventListener("click", fecharCarrinho);

  // Clicar no fundo escurecido também fecha
  cartBackdrop.addEventListener("click", fecharCarrinho);

  // Pressionar Escape fecha a janela
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") fecharCarrinho();
  });

  // Botões de filtro no sidenav
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      // Remove .active de todos, adiciona só no clicado
      filterBtns.forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");

      // Copia o valor do botão para o select oculto
      filterSelect.value = btn.dataset.filter;

      // Aplica o filtro
      filtrarProdutos();
    });
  });

  // Select oculto (compatibilidade com o filtro original)
  filterSelect.addEventListener("change", filtrarProdutos);

  // Botão FLUSH CART
  btnClearCart.addEventListener("click", limparCarrinho);

  // Botão EXEC do desconto
  btnApplyDiscount.addEventListener("click", aplicarDesconto);

  // Enter no campo de desconto também aplica
  discountInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") aplicarDesconto();
  });

  // Botão EXECUTE CHECKOUT
  btnCheckout.addEventListener("click", finalizarCompra);

  logSistema("nexus://shopcart inicializado. sessão ativa.");
});
