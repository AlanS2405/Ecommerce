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
        html += `
        <div class="product">
            <div class="product___img">
                <img src="${product.image}" alt="imagen"/>
            </div>

            <div class="product__info">
                <h4>${product.name} | <span> <b>Stock</b>: ${product.quantity}</span></h4>
                <h5>
                    ${product.price}
                    <i class='bx bx-plus' id='${product.id}'></i>
                </h5>
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
                    
                    <div class="cart__product--body--op">
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

async function main() {
    const db = {
        products: JSON.parse(window.localStorage.getItem('products')) ||
         (await getProducts()),
         cart: JSON.parse(window.localStorage.getItem('cart')) || {}
    };

    printProducts(db);
    handleShowCart();
    addToCartFromProducts(db);
    printProductsInCart(db);
}

main();