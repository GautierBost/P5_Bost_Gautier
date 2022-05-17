//recuperation du storage
let storage = JSON.parse(localStorage.getItem('produits'))

//recuperation des produits(api)
fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((produits) => {
        //trouver les objets corespondant
        let objetsCommun = (id) => {
            return produits.find((produit) => produit._id === id)
        }
        //afficher les produits
        for(let produit in storage){
            let id = storage[produit]._id
            let produitTrouve = objetsCommun(id)
            let prix = produitTrouve.price * storage[produit].qty

            document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${id}" data-color="${storage[produit].colors}">
                                                                    <div class="cart__item__img">
                                                                        <img src="${produitTrouve.imageUrl}" alt="${produitTrouve.altTxt}">
                                                                    </div>
                                                                    <div class="cart__item__content">
                                                                        <div class="cart__item__content__description">
                                                                            <h2>${produitTrouve.name}</h2>
                                                                            <p>${storage[produit].colors}</p>
                                                                            <p>${prix}€</p>
                                                                        </div>
                                                                        <div class="cart__item__content__settings">
                                                                            <div class="cart__item__content__settings__quantity">
                                                                                <p>Qté : </p>
                                                                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${storage[produit].qty}">
                                                                            </div>
                                                                            <div class="cart__item__content__settings__delete">
                                                                                <p class="deleteItem">Supprimer</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </article>`
        }
    })
    //afficher un message en cas d'erreur
    .catch((err) => {
        document.getElementById("cart__items").innerHTML += `<p>Une erreur s'est produite. Veuillez actualiser la page. Si le problème persiste, merci contactez le support.</p>`
        console.log(err)
    })



//afficher le nombre de produits dans le pannier(nav bar)
let totalPanier = () => {
    const panier = document.getElementsByTagName("nav")[0].getElementsByTagName("li")[1]
    let storage = JSON.parse(localStorage.getItem('produits'))
    let totalProduitsStorage = 0
        for(let produit in storage){
            totalProduitsStorage += parseInt(storage[produit].qty)
            console.log(totalProduitsStorage)
        }
    panier.innerHTML = `Panier <span id=quantite>${totalProduitsStorage}</span>`
}
totalPanier()