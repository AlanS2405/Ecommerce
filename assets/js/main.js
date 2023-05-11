async function getProducts() {
    try {
        const data = await fetch (
            "https://ecommercebackend.fundamentos-29.repl.co/"
            );

            const res = await data.json();

            window.localStorage.setItem("products", JSON.stringify(res));

            return res;
    } catch (error) {
        console.log(error);
    }
}

function printProducts(db) {
    const productsHTML = document.querySelector(".products")

    let html = ''

    for (const product of db.products) {
        
        const buttonAdd = product.quantity ? 
            `<i class='bx bx-plus' id='${product.id}'></i>`
            : "<span class='soldOut'>Sold out</span>";

        html += `
        <div class="product">
            <div class="product___img">
                <img src="${product.image}" alt="imagen"/>
            </div>

            <div class="product__info">
                <div>
                    ${buttonAdd}
                </div>
                <h3>
                $${product.price}
                <span>Stock: ${product.quantity}</span>
            </h3>
                <h4>${product.name}</h4>
            </div>
        </div>
        `;
    }

    productsHTML.innerHTML = html;
}

function handleShowCart() {
    const iconCartHTML = document.querySelector(".bx.bx-shopping-bag");
    const cartHTML = document.querySelector(".cart")


    iconCartHTML.addEventListener('click', function() {
        cartHTML.classList.toggle("cart__show")
    });
}

function addToCartFromProducts(db) {
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.id);

            let productFind = null

            for (const product of db.products) {
                if (product.id === id) {
                    productFind = product;
                    break;
                }
            };

            if (db.cart[productFind.id]){
                if (productFind.quantity === db.cart[productFind.id].amount) 
                return alert("No tenemos más en bodega");
                
                db.cart[productFind.id].amount++;
            } else {
                db.cart[productFind.id] = {...productFind, amount: 1};
            }

            window.localStorage.setItem("cart", JSON.stringify(db.cart));
            printProductsInCart(db);
            printTotal(db);
            handlePrintAmountProducts(db);
        }
    });
}

function printProductsInCart(db) {
    const cartProducts = document.querySelector('.cart__products');

    let html = ''

    for (const product in db.cart) {
        const {quantity, price, name, image, id, amount} = db.cart[product];

        html += `
            <div class="cart__product">
                <div class="cart__product--img">
                    <img src="${image}" alt="" />
                </div>
                <div class="cart__product--body">
                    <h4>${name} | $${price}</h4>
                    <p>Stock: ${quantity}</p>
                    
                    <div class="cart__product--body--op" id='${id}'>
                    <i class='bx bx-minus'></i>
                    <span> ${amount} unit</span>
                    <i class='bx bx-plus' ></i>
                    <i class='bx bx-trash-alt'></i>
                    </div>
                </div>
            </div>
        `;
    }

    cartProducts.innerHTML = html;
}

function handleProductsInCart (db) {
    
    const cart__products = document.querySelector(".cart__products");
    cart__products.addEventListener('click', function(e) {
        if (e.target.classList.contains('bx-plus')) {
            const id = Number(e.target.parentElement.id);

            let productFind = null

            for (const product of db.products) {
                if (product.id === id) {
                    productFind = product;
                    break;
                }
            };

            if (productFind.quantity === db.cart[productFind.id].amount) 
                return alert("No tenemos más en bodega");

            
            db.cart[id].amount++;    
        }

        if (e.target.classList.contains('bx-minus')) {
            const id = Number(e.target.parentElement.id);
            if (db.cart[id].amount === 1){
                const response = confirm('Estás seguro de que quieres eliminar este producto?');

                if (!response) return;
                delete db.cart[id];
            } else {
                db.cart[id].amount--;
            }
        }

        if (e.target.classList.contains('bx-trash-alt')) {
            const id = Number(e.target.parentElement.id);
            const response = confirm('Estás seguro de que quieres eliminar este producto?');

            if (!response) return;
            delete db.cart[id];
        }

        window.localStorage.setItem('cart', JSON.stringify(db.cart));
        printProductsInCart(db);
        printTotal(db);
        handlePrintAmountProducts(db);

    })
}

function printTotal(db) {
    const infoTotal = document.querySelector('.info__total');
    const infoAmount = document.querySelector('.info__amount');


    let = totalPrice = 0
    let = amountProducts = 0

    for (const product in db.cart) {
        const {amount, price} = db.cart[product];
        totalPrice += price * amount;
        amountProducts += db.cart[product].amount;
    }

    infoAmount.textContent = amountProducts + " items";
    infoTotal.textContent = "$"+ totalPrice + ".00";
    
}

function handleTotal(db) {
    const btnBuy = document.querySelector(".btn__buy");
    btnBuy.addEventListener('click', function () {
        if (!Object.values(db.cart).length) 
            return alert('Tu carrito se encuentra vacío 😢');
        
        const response = confirm("Seguro que quieres comprar?");
        if (!response) return;

        const currentProducts = [];

        for (const product of db.products) {
            const productCart = db.cart[product.id];
            if (product.id === productCart?.id){
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount
                });
            } else {
                currentProducts.push(product);
            }
        }  
           
        db.products = currentProducts;
        db.cart = {};

        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));

        printTotal(db);
        printProductsInCart(db);
        printProducts(db);
        handlePrintAmountProducts(db);

    });
}

function handlePrintAmountProducts(db) {
    const amountProducts = document.querySelector(".amountProducts");

    let amount = 0;

    for (const product in db.cart) {
        amount += db.cart[product].amount
    }

    amountProducts.textContent = amount;
}

function handleShowMenu () {
const iconMenuHTML = document.querySelector(".iconMenu");
const menuHTML = document.querySelector(".menu");

iconMenuHTML.addEventListener('click', function () {
    menuHTML.classList.toggle("menu_show")
})
}

function animationNavbarScroll() {
    const contentNavbarHTML = document.querySelector(".content_navbar");

    function animationScroll () {
        let y = window.scrollY

        if (y > 80) {
            contentNavbarHTML.classList.add("content_navbar_scroll");
        } else {
            contentNavbarHTML.classList.remove("content_navbar_scroll");
        }
    }

    window.onscroll = () => animationScroll();
}

function darkMode () {
    const iconDarkModeHTML = document.querySelector(".bx-moon");
    const darkModeHTML = document.querySelector("body");
    
    iconDarkModeHTML.addEventListener('click', function () {
        darkModeHTML.classList.toggle("darkmode");
        iconDarkModeHTML.classList.toggle("bx-sun")
    })
};

function loading () {
    window.addEventListener('load', function () {
        setTimeout(function() {    
            const contentLoadingHTML = document.querySelector('.content_loading');
            contentLoadingHTML.classList.add("content_loading_none");
        }, 1500);
    });
};


async function main() {
    const db = {
        products: JSON.parse(window.localStorage.getItem('products')) ||
         (await getProducts()),
         cart: JSON.parse(window.localStorage.getItem('cart')) || {}
    };

    printProducts(db);
    loading ();
    animationNavbarScroll();
    darkMode ();
    handleShowCart();
    handleShowMenu ();
    addToCartFromProducts(db);
    printProductsInCart(db);
    handleProductsInCart(db);
    printTotal(db);
    handleTotal(db);
    handlePrintAmountProducts(db);
    
    
}

main();