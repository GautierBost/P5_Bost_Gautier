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
      const id = storage[product]._id;
      const productFind = sameObject(id);

      cartItems.innerHTML += `<article class="cart__item" data-id="${id}" data-color="${storage[product].colors}">
                                                                    <div class="cart__item__img">
                                                                        <img src="${productFind.imageUrl}" alt="${productFind.altTxt}">
                                                                    </div>
                                                                    <div class="cart__item__content">
                                                                        <div class="cart__item__content__description">
                                                                            <h2>${productFind.name}</h2>
                                                                            <p>${storage[product].colors}</p>
                                                                            <p>${productFind.price}€</p>
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
        cartItems.innerHTML = `votre pannier est vide`;
      }
    }
    //afficher la quantite totale et le prix total
    let totalPriceQuantity = () => {
      const totalQuantityBox = document.getElementById("totalQuantity");
      const totalPriceBox = document.getElementById("totalPrice");
      let totalQuantity = 0;
      let totalPrice = 0;
      for (let products in storage) {
        const id = storage[products]._id;
        const productFind = sameObject(id);
        const price = productFind.price * storage[products].qty;
        totalQuantity += storage[products].qty;
        totalPrice += price;
      }
      totalQuantityBox.innerHTML = `${totalQuantity}`;
      totalPriceBox.innerHTML = `${totalPrice}`;
    };
    totalPriceQuantity();

    //supprimer les produits
    const deleteButton = document.querySelectorAll(".deleteItem");
    console.log("🚀 ~ file: cart.js ~ line 81 ~ deleteButton", deleteButton);

    for (let i = 0; i < deleteButton.length; i++) {
      deleteButton[i].addEventListener("click", () => {
        const item = deleteButton[i].closest(".cart__item");
        const itemId = item.dataset.id;
        console.log("🚀 ~ file: cart.js ~ line 80 ~ .then ~ itemId", itemId);
        const itemColor = item.dataset.color;
        console.log(
          "🚀 ~ file: cart.js ~ line 82 ~ .then ~ itemColor",
          itemColor
        );
        for (let product in storage) {
          if (
            itemId === storage[product]._id &&
            itemColor === storage[product].colors
          ) {
            storage.splice(i, 1);
            localStorage.setItem("produits", JSON.stringify(storage));
            cartItems.removeChild(item);
            console.log(storage);
            totalPanier();
            totalPriceQuantity();
          }
        }
      });
    }

    //modifier la quantite
    const quantityButton = document.querySelectorAll(".itemQuantity");
    console.log(
      "🚀 ~ file: cart.js ~ line 94 ~ .then ~ quantityButton",
      quantityButton
    );

    for (let i = 0; i < quantityButton.length; i++) {
      quantityButton[i].addEventListener("change", () => {
        const item = quantityButton[i].closest(".cart__item");
        const itemId = item.dataset.id;
        console.log("🚀 ~ file: cart.js ~ line 80 ~ .then ~ itemId", itemId);
        const itemColor = item.dataset.color;
        console.log(
          "🚀 ~ file: cart.js ~ line 82 ~ .then ~ itemColor",
          itemColor
        );
        for (let product in storage) {
          if (
            itemId === storage[product]._id &&
            itemColor === storage[product].colors
          ) {
            const quantite = parseInt(quantityButton[i].value);
            //verifier quantite entre 0 et 100
            if (quantite < 0 || quantite > 100) {
              alert("Veuillez saisir une quantité comprise entre 0 et 100");
              //si quantite 0 supprimer
            } else if (quantite === 0) {
              storage.splice(i, 1);
              localStorage.setItem("produits", JSON.stringify(storage));
              cartItems.removeChild(item);
              console.log(storage);
              totalPanier();
              totalPriceQuantity();
            } else if (quantite <= 100) {
              //verifier que le total dans le pannier ne depasse pas 100
              let quantiteActuel = 0;
              for (let product in storage) {
                quantiteActuel += storage[product].qty;
                console.log(
                  "🚀 ~ file: cart.js ~ line 131 ~ quantityButton[i].addEventListener ~ quantiteActuel",
                  quantiteActuel
                );
                let quantiteApresAjout =
                  quantiteActuel - storage[i].qty + quantite;
                console.log(
                  "🚀 ~ file: cart.js ~ line 132 ~ quantityButton[i].addEventListener ~ quantiteApresAjout",
                  quantiteApresAjout
                );
                if (quantiteApresAjout > 100) {
                  alert(
                    "Votre pannier ne peut pas contenir plus de 100 produits"
                  );
                } else {
                  storage[i].qty = quantite;
                  localStorage.setItem("produits", JSON.stringify(storage));
                  console.log(storage);
                  totalPanier();
                  totalPriceQuantity();
                }
              }
            }
          }
        }
      });
    }
  })

  //afficher un message en cas d'erreur
  .catch((err) => {
    cartItems.innerHTML = `<p>Une erreur s'est produite. Veuillez actualiser la page. Si le problème persiste, merci contactez le support.</p>`;
    console.log(err);
  });

//verrification du formulaire
//prénom
const firstName = document.getElementById("firstName");
const patternFirstName =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð -]+$/g;
firstName.addEventListener("change", () => {
  const msg = document.getElementById("firstNameErrorMsg");
  console.log(patternFirstName.test(firstName.value));
  if (firstName.value.match(patternFirstName)) {
    console.log("valide");
    msg.innerHTML = "";
  } else {
    msg.innerHTML = "Prénom invalide";
  }
});

//nom
const lastName = document.getElementById("lastName");
const patternLastName =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð -]+$/g;
lastName.addEventListener("change", () => {
  const msg = document.getElementById("lastNameErrorMsg");
  console.log(patternLastName.test(lastName.value));
  if (lastName.value.match(patternLastName)) {
    console.log("valide");
    msg.innerHTML = "";
  } else {
    msg.innerHTML = "Nom invalide";
  }
});

//adresse
const address = document.getElementById("address");
const patternAddress =
  /^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð -']+$/g;
address.addEventListener("change", () => {
  const msg = document.getElementById("addressErrorMsg");
  console.log(patternAddress.test(address.value));
  if (address.value.match(patternAddress)) {
    console.log("valide");
    msg.innerHTML = "";
  } else {
    msg.innerHTML = "Adresse invalide";
  }
});

//ville
const city = document.getElementById("city");
const patternCity =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð -']+$/g;
city.addEventListener("change", () => {
  const msg = document.getElementById("cityErrorMsg");
  console.log(patternCity.test(city.value));
  if (city.value.match(patternCity)) {
    console.log("valide");
    msg.innerHTML = "";
  } else {
    msg.innerHTML = "Ville invalide";
  }
});

//email
const email = document.getElementById("email");
const patternEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/g;
email.addEventListener("change", () => {
  const msg = document.getElementById("emailErrorMsg");
  console.log(patternEmail.test(email.value));
  if (email.value.match(patternEmail)) {
    console.log("valide");
    msg.innerHTML = "";
  } else {
    msg.innerHTML = "Email invalide";
  }
});

//envoyer les infos formulaire et produits
const order = document.getElementById("order");
order.addEventListener("click", (e) => {
  e.preventDefault();
  if (storage.length === 0) {
    alert("Votre panier est vide");
  } else if (
    firstName.value === "" ||
    lastName.value === "" ||
    address.value === "" ||
    city.value === "" ||
    email.value === ""
  ) {
    alert("Veuillez compléter le formulaire");
  } else if (
    firstName.value.match(patternFirstName) &&
    lastName.value.match(patternLastName) &&
    address.value.match(patternAddress) &&
    city.value.match(patternCity) &&
    email.value.match(patternEmail)
  ) {
    const order = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      },
      products: storage.map((products) => products._id),
    };
    console.log(
      "🚀 ~ file: cart.js ~ line 256 ~ order.addEventListener ~ order",
      order
    );
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        "Content-Type": "application/json",
      },
    })
      //recuperer l'orderId
      .then((res) => res.json())
      .then((order) => {
        console.log("🚀 ~ file: cart.js ~ line 270 ~ .then ~ order", order);
        const orderId = order.orderId;
        console.log("🚀 ~ file: cart.js ~ line 272 ~ .then ~ orderId", orderId);
        localStorage.clear();
        window.location.href = `./confirmation.html?id=${orderId}`;
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//afficher le nombre de produits dans le pannier(nav bar)
let totalPanier = () => {
  const panier = document.getElementById("panier");
  let totalProdutsStorage = 0;
  for (let product in storage) {
    totalProdutsStorage += parseInt(storage[product].qty);
    console.log(totalProdutsStorage);
  }
  panier.innerHTML = `Panier <span id=quantite>${totalProdutsStorage}</span>`;
};
totalPanier();
