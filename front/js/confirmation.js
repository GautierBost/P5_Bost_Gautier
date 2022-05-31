const id = new URL(document.location).searchParams.get("id");
document.getElementById("orderId").innerHTML = id;

let totalPanier = () => {
  const panier = document.getElementById("panier");
  let totalProdutsStorage = 0;

  panier.innerHTML = `Panier <span id=quantite>${totalProdutsStorage}</span>`;
};
totalPanier();
