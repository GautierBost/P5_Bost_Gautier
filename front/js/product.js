//recuperation de l'id du produit
const id = new URL(document.location).searchParams.get("id");

//recuperation du produit
fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => res.json())
  .then((product) => {
    //afficher le produit
    document.querySelector("title").innerHTML = product.name;
    document.querySelector(
      ".item__img"
    ).innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.querySelector("#title").innerHTML = product.name;
    document.querySelector("#price").innerHTML = product.price;
    document.querySelector("#description").innerHTML = product.description;
    for (let couleur in product.colors) {
      document.querySelector(
        "#colors"
      ).innerHTML += `<option value="${product.colors[couleur]}">${product.colors[couleur]}</option>`;
    }
  })
  //afficher un message en cas d'erreur
  .catch((err) => {
    document.getElementById(
      "item"
    ).innerHTML += `<p>Une erreur s'est produite. Veuillez actualiser la page. Si le problème persiste, merci contactez le support.</p>`;
    console.log(err);
  });

//ajout du produit au panier
const addProduct = () => {
  //récupération des options du produit
  let couleur = document.getElementById("colors").value;
  console.log(
    "🚀 ~ file: product.js ~ line 29 ~ ajoutProduit ~ couleur",
    couleur
  );
  let quantite = document.getElementById("quantity").value;
  console.log(
    "🚀 ~ file: product.js ~ line 31 ~ ajoutProduit ~ quantite",
    quantite
  );
  let optionsDuProduit = {
    _id: id,
    colors: couleur,
    qty: parseInt(quantite, 10),
  };
  console.log(
    "🚀 ~ file: product.js ~ line 37 ~ ajoutProduit ~ optionsDuProduit",
    optionsDuProduit
  );

  //recuperation du localStorage
  let storage = JSON.parse(localStorage.getItem("produits"));
  console.log(
    "🚀 ~ file: product.js ~ line 40 ~ ajoutProduit ~ storage",
    storage
  );
  if (!storage) {
    storage = [];
  }

  //ajout du produit au storage
  const ajoutProduitStorage = () => {
    storage.push(optionsDuProduit);
    localStorage.setItem("produits", JSON.stringify(storage));
    alert("Votre selection a bien été ajouter au panier");
  };

  //recherche de produit similaire
  const produitSimilaire = storage.findIndex(
    (produit) =>
      produit._id == optionsDuProduit._id &&
      produit.colors == optionsDuProduit.colors
  );
  console.log(
    "🚀 ~ file: product.js ~ line 52 ~ ajoutProduit ~ produitSimilaire",
    produitSimilaire
  );

  //modifier un produit deja présent dans le storage
  const modifierQuantite = () => {
    storage[produitSimilaire].qty += optionsDuProduit.qty;
    localStorage.setItem("produits", JSON.stringify(storage));
  };

  //verifier la couleur et la quantité
  if (couleur === "") {
    alert("Veuillez choisir une couleur!");
  } else if (quantite <= 0) {
    alert("Veuillez choisir une quantité!");
  } else if (quantite > 100) {
    alert("Quantié maximale de 100 produits autorisé!");
  } else {
    //verifier la quantité total du storage
    let totalProductsStorage = 0;
    for (let product in storage) {
      totalProductsStorage += storage[product].qty;
    }
    console.log(
      "🚀 ~ file: product.js ~ line 60 ~ modifierQuantite ~ totalProductsStorage",
      totalProductsStorage
    );
    //verifier que le storage ne depassera pas 100 produits
    let totalApresAjout = totalProductsStorage + optionsDuProduit.qty;
    console.log(
      "🚀 ~ file: product.js ~ line 66 ~ modifierQuantite ~ totalApresAjout",
      totalApresAjout
    );
    if (totalApresAjout > 100) {
      alert("Votre panier ne peu contenir plus de 100 produits!");
    } else {
      //si pas de produit dans le storage ajouter le produit
      if (!storage) {
        ajoutProduitStorage();
      }
      //sinon verifier qu'un produit similaire ne soit pas deja present
      else {
        //si produit similaire modifier la quantite
        if (produitSimilaire !== -1) {
          modifierQuantite();
          //sinon ajouter le produit
        } else {
          ajoutProduitStorage();
        }
      }
    }
    totalPanier();
    console.log(storage);
  }
};
//ajouter le produit au panier
const button = document.getElementById("addToCart");
button.addEventListener("click", addProduct);

//afficher le nombre de produits dans le pannier(nav bar)
let totalPanier = () => {
  const panier = document
    .getElementsByTagName("nav")[0]
    .getElementsByTagName("li")[1];
  let storage = JSON.parse(localStorage.getItem("produits"));
  let totalProduitsStorage = 0;
  for (let produit in storage) {
    totalProduitsStorage += parseInt(storage[produit].qty, 10);
    console.log(totalProduitsStorage);
  }
  panier.innerHTML = `Panier <span id=quantite>${totalProduitsStorage}</span>`;
};
totalPanier();
