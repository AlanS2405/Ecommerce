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

            <div class=product__info>
                <h4>${product.name} | <span> <b>Stock</b>: ${product.quantity}</span></h4>
                <h5>
                    ${product.price}
                    <i class='bx bx-plus' id='${product.id}}'></i>
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

async function main() {
    const db = {
        products: JSON.parse(window.localStorage.getItem('products')) ||
         (await getProducts()),
         cart: {}
    };

    printProducts(db)
    handleShowCart()
}

main();