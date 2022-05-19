//recuperation du storage
let storage = JSON.parse(localStorage.getItem("produits"));

//recuperation des produits(api)
const cartItems = document.getElementById("cart__items");
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((products) => {
    //trouver les objets corespondant
    let sameObject = (id) => {
      return products.find((product) => product._id === id);
    };
    //afficher les produits
    for (let product in storage) {
      let id = storage[product]._id;
      let productFind = sameObject(id);
      let price = productFind.price * storage[product].qty;

      cartItems.innerHTML += `<article class="cart__item" data-id="${id}" data-color="${storage[product].colors}">
                                                                    <div class="cart__item__img">
                                                                        <img src="${productFind.imageUrl}" alt="${productFind.altTxt}">
                                                                    </div>
                                                                    <div class="cart__item__content">
                                                                        <div class="cart__item__content__description">
                                                                            <h2>${productFind.name}</h2>
                                                                            <p>${storage[product].colors}</p>
                                                                            <p>${price}€</p>
                                                                        </div>
                                                                        <div class="cart__item__content__settings">
                                                                            <div class="cart__item__content__settings__quantity">
                                                                                <p>Qté : </p>
                                                                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${storage[product].qty}">
                                                                            </div>
                                                                            <div class="cart__item__content__settings__delete">
                                                                                <p class="deleteItem">Supprimer</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </article>`;
      if (!storage) {
        cartItems.innerHTML += `votre pannier est vide`;
      }
    }
    //afficher la quantite totale et le prix total
    const totalQuantityBox = document.getElementById("totalQuantity");
    const totalPriceBox = document.getElementById("totalPrice");
    let totalQuantity = 0;
    let totalPrice = 0;
    for (let products in storage) {
      let id = storage[products]._id;
      let productFind = sameObject(id);
      let price = productFind.price * storage[products].qty;
      totalQuantity += storage[products].qty;
      totalPrice += price;
    }
    totalQuantityBox.innerHTML += `${totalQuantity}`;
    totalPriceBox.innerHTML += `${totalPrice}`;
  })
  //afficher un message en cas d'erreur
  .catch((err) => {
    cartItems.innerHTML += `<p>Une erreur s'est produite. Veuillez actualiser la page. Si le problème persiste, merci contactez le support.</p>`;
    console.log(err);
  });

//supprimer les produits
const deleteProduct = () => {
  let index = storage.findIndex(
    (product) =>
      product._id === cartItems.dataset.id &&
      product.colors === cartItems.dataset.color
  );
  storage.splice(index, 1);
  console.log(
    "🚀 ~ file: cart.js ~ line 73 ~ deleteProduct ~ storage",
    storage
  );
};
let deleteButton = document.querySelectorAll(".deleteItem");
deleteButton.addEventListener("click", deleteProduct);

//afficher le nombre de produits dans le pannier(nav bar)
let totalPanier = () => {
  const panier = document
    .getElementsByTagName("nav")[0]
    .getElementsByTagName("li")[1];
  let totalProdutsStorage = 0;
  for (let product in storage) {
    totalProdutsStorage += parseInt(storage[product].qty);
    console.log(totalProdutsStorage);
  }
  panier.innerHTML = `Panier <span id=quantite>${totalProdutsStorage}</span>`;
};
totalPanier();
