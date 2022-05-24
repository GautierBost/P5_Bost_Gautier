const items = document.getElementById("items");
//afficher les produits
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((products) => {
    for (let product in products) {
      items.innerHTML += `<a href="./product.html?id=${products[product]._id}">
                                                                <article>
                                                                    <img src="${products[product].imageUrl}" alt="${products[product].altTxt}">
                                                                    <h3 class="productName">${products[product].name}</h3>
                                                                    <p class="productDescription">${products[product].description}</p>
                                                                </article>
                                                            </a>`;
    }
  })
  //afficher un message en cas d'erreur
  .catch((err) => {
    items.innerHTML = `<p>Une erreur s'est produite. Veuillez actualiser la page. Si le problème persiste, merci contactez le support.</p>`;
    console.log(err);
  });
//afficher le nombre de produits dans le pannier(nav bar)
let totalPanier = () => {
  const panier = document
    .getElementsByTagName("nav")[0]
    .getElementsByTagName("li")[1];
  let storage = JSON.parse(localStorage.getItem("produits"));
  let totalProductsStorage = 0;
  for (let product in storage) {
    totalProductsStorage += parseInt(storage[product].qty);
    console.log(
      "🚀 ~ file: script.js ~ line 27 ~ totalPanier ~ totalProduitsStorage",
      totalProductsStorage
    );
  }
  panier.innerHTML = `Panier <span id=quantite>${totalProductsStorage}</span>`;
};
totalPanier();
