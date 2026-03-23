// Banco de dados simulado
const products = [
    { id: 1, name: "Caneca Mágica Personalizada", price: 49.90, category: "canecas", img: "https://placehold.co/400x400/2ecc71/fff?text=Caneca+Mágica", desc: "Caneca que revela a foto/texto quando recebe líquido quente.", options: ['gravação'] },
    { id: 2, name: "Camiseta Algodão Premium", price: 89.90, category: "vestuario", img: "https://placehold.co/400x400/3498db/fff?text=Camiseta", desc: "Camiseta 100% algodão. Estampe sua arte ou frase favorita.", options: ['tamanho', 'cor', 'gravação'] },
    { id: 3, name: "Moletom Canguru", price: 159.90, category: "vestuario", img: "https://placehold.co/400x400/9b59b6/fff?text=Moletom", desc: "Moletom quente e confortável com bordado personalizado.", options: ['tamanho', 'cor'] },
    { id: 4, name: "Chaveiro Couro Gravado", price: 29.90, category: "acessorios", img: "https://placehold.co/400x400/e67e22/fff?text=Chaveiro", desc: "Chaveiro elegante em material sintético com iniciais gravadas.", options: ['gravação'] },
    { id: 5, name: "Garrafa Térmica 500ml", price: 79.90, category: "acessorios", img: "https://placehold.co/400x400/34495e/fff?text=Garrafa", desc: "Mantém a bebida gelada por 12h. Grave seu nome.", options: ['cor', 'gravação'] },
    { id: 6, name: "Caneca Porcelana Clássica", price: 35.00, category: "canecas", img: "https://placehold.co/400x400/e74c3c/fff?text=Caneca+Branca", desc: "A clássica caneca branca, pronta para receber sua ideia.", options: ['gravação'] }
];

const app = {
    cart: [],
    
    init() {
        this.renderProducts(products.slice(0, 4), 'featured-products'); // 4 primeiros na home
        this.renderProducts(products, 'catalog-products'); // Todos no catálogo
        this.updateCartCount();
    },

    // Navegação estilo Single Page Application (SPA)
    navigate(sectionId) {
        document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        window.scrollTo(0, 0);
    },

    // Formata Moeda
    formatPrice(price) {
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    // Renderiza Lista de Produtos
    renderProducts(productList, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = productList.map(p => `
            <div class="product-card">
                <img src="${p.img}" alt="${p.name}" onclick="app.viewProduct(${p.id})">
                <div class="product-info">
                    <h4 onclick="app.viewProduct(${p.id})">${p.name}</h4>
                    <p class="product-price">${this.formatPrice(p.price)}</p>
                    <button class="btn-primary" onclick="app.viewProduct(${p.id})">Personalizar</button>
                </div>
            </div>
        `).join('');
    },

    // Filtros no Catálogo
    filterProducts(category) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const filtered = category === 'todos' ? products : products.filter(p => p.category === category);
        this.renderProducts(filtered, 'catalog-products');
    },

    // Abre a página de detalhes do produto
    viewProduct(id) {
        const product = products.find(p => p.id === id);
        const container = document.getElementById('detail-content');
        
        // Gerar campos de customização dinamicamente com base no produto
        let customHtml = '';
        if(product.options.includes('tamanho')) {
            customHtml += `
                <div class="form-group">
                    <label>Tamanho</label>
                    <select id="opt-size">
                        <option value="P">P</option><option value="M">M</option><option value="G">G</option><option value="GG">GG</option>
                    </select>
                </div>`;
        }
        if(product.options.includes('cor')) {
            customHtml += `
                <div class="form-group">
                    <label>Cor</label>
                    <select id="opt-color">
                        <option value="Preto">Preto</option><option value="Branco">Branco</option><option value="Cinza">Cinza</option>
                    </select>
                </div>`;
        }
        if(product.options.includes('gravação')) {
            customHtml += `
                <div class="form-group">
                    <label>Nome ou Frase para Gravação</label>
                    <input type="text" id="opt-text" placeholder="Ex: Meu Amor, Nome, etc." maxlength="30">
                </div>`;
        }

        container.innerHTML = `
            <div class="detail-img">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="detail-info">
                <h2>${product.name}</h2>
                <p class="detail-price">${this.formatPrice(product.price)}</p>
                <p>${product.desc}</p>
                
                <div class="customization-options">
                    <h3>Opções de Personalização</h3>
                    ${customHtml}
                </div>
                
                <button class="btn-primary" onclick="app.addToCart(${product.id})">Adicionar ao Carrinho</button>
            </div>
        `;
        
        this.navigate('product-detail');
    },

    // Adiciona ao Carrinho
    addToCart(productId) {
        const product = products.find(p => p.id === productId);
        
        // Capturar opções de personalização preenchidas
        const size = document.getElementById('opt-size') ? document.getElementById('opt-size').value : null;
        const color = document.getElementById('opt-color') ? document.getElementById('opt-color').value : null;
        const text = document.getElementById('opt-text') ? document.getElementById('opt-text').value : null;

        let customString = [];
        if(size) customString.push(`Tam: ${size}`);
        if(color) customString.push(`Cor: ${color}`);
        if(text) customString.push(`Gravação: "${text}"`);

        const cartItem = {
            cartId: Date.now(), // ID único pro carrinho (permite o mesmo produto c/ customizações diferentes)
            ...product,
            customDetails: customString.join(' | '),
            quantity: 1
        };

        this.cart.push(cartItem);
        this.updateCartCount();
        alert('Produto adicionado ao carrinho com sucesso!');
        this.navigate('cart');
        this.renderCart();
    },

    // Renderiza e atualiza a tela do carrinho
    renderCart() {
        const container = document.getElementById('cart-items');
        const btnCheckout = document.getElementById('btn-checkout');
        let total = 0;

        if (this.cart.length === 0) {
            container.innerHTML = '<p>Seu carrinho está vazio.</p>';
            document.getElementById('cart-total').innerText = 'R$ 0,00';
            btnCheckout.disabled = true;
            return;
        }

        btnCheckout.disabled = false;
        container.innerHTML = this.cart.map(item => {
            total += item.price * item.quantity;
            return `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.customDetails}</p>
                    <p style="color: var(--primary-color); font-weight: bold; margin-top:5px;">${this.formatPrice(item.price)}</p>
                </div>
                <div class="cart-actions">
                    <input type="number" value="${item.quantity}" min="1" onchange="app.changeQty(${item.cartId}, this.value)">
                    <button class="btn-remove" onclick="app.removeFromCart(${item.cartId})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `}).join('');

        document.getElementById('cart-total').innerText = this.formatPrice(total);
    },

    changeQty(cartId, newQty) {
        const item = this.cart.find(i => i.cartId === cartId);
        if(item) {
            item.quantity = parseInt(newQty);
            this.renderCart();
            this.updateCartCount();
        }
    },

    removeFromCart(cartId) {
        this.cart = this.cart.filter(i => i.cartId !== cartId);
        this.renderCart();
        this.updateCartCount();
    },

    updateCartCount() {
        const count = this.cart.reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById('cart-count').innerText = count;
    },

    // Processar formulário de checkout
    processCheckout(event) {
        event.preventDefault();
        if(this.cart.length === 0) {
            alert("Adicione produtos ao carrinho antes de finalizar.");
            return;
        }
        alert("Pedido realizado com sucesso! (Simulação concluída). Entraremos em contato via e-mail com o andamento do seu produto exclusivo.");
        this.cart = []; // Esvazia o carrinho
        this.updateCartCount();
        this.navigate('home');
        document.getElementById('checkout-form').reset();
    }
};

// Inicializa a loja assim que a página carrega
window.onload = () => app.init();
