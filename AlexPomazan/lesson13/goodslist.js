const makeGETRequest = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status != 200) {
          reject(`${xhr.status}: ${xhr.statusText}`);
        }
        resolve(JSON.parse(xhr.responseText));
      }
    }
    xhr.open('GET', url, true);
    xhr.send();
  });
}

class GoodsList {
  fetchGoods() {
    makeGETRequest(`${API_URL}/items`)
      .then(items => {
        items.forEach(item => this.productRender(item.id, item.name, item.price, item.images));
      })
      .catch(errMessage => console.log(errMessage));
  }

  productRender(id, name, price, images) {
    const modalImg = document.createElement("div");
    modalImg.className = "modal-img";
    modalImg.innerHTML = `
    <a type="button" class="a-${id}" data-toggle="modal" data-target="#exampleModal-${id}">
</a>
  <div class="modal fade" id="exampleModal-${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">${name}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div id="carouselExampleControls-${id}" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="${images[0]}" class=" img-1 d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="${images[1]}" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="${images[2]}" class="d-block w-100" alt="...">
          </div>
        </div>
        <a class="carousel-control-prev prev" href="#carouselExampleControls-${id}" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next next" href="#carouselExampleControls-${id}" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
        </div>
      </div>
    </div>
  </div>`;
    const productCard = document.createElement("div");
    productCard.className = "card card-product";
    const catalogOfProduct = document.querySelector(".catalog");
    catalogOfProduct.append(productCard);
    productCard.style.margin = "20px";
    const productItem = document.createElement("div");
    productItem.className = `product product-${id}`;
    productCard.appendChild(productItem);
    const infoProduct = document.createElement("div");
    infoProduct.className = "product-info";
    let imgProduct = document.createElement("img");
    imgProduct.src = images[0];
    imgProduct.height = 150;
    imgProduct.style.margin = "20px";
    imgProduct.className = "product-img";
    productItem.append(modalImg);
    let productName = document.createElement("div");
    let productPrice = document.createElement("div");
    let productPriceValue = document.createElement("div");
    const productInfo = document.createElement("div");
    productName.className = "name";
    productPrice.className = "price";
    productPriceValue.className = "price-value";
    productInfo.className = "product-info";
    productName.innerHTML = `${name}`;
    productPrice.innerHTML = "Цена:";
    productPriceValue.innerHTML = `${price}`;
    productItem.append(productInfo);
    productInfo.append(productName);
    productInfo.append(productPrice);
    productPrice.append(productPriceValue);

    let modalTarget = document.querySelector(`.a-${id}`);
    modalTarget.prepend(imgProduct);
    const btnsProduct = document.createElement("div");
    btnsProduct.className = "product-btns";
    productItem.append(btnsProduct);
    const btnAdd = document.createElement("button");
    const btnDelete = document.createElement("button");
    btnAdd.className = `btn btn-add btn-success`;
    btnDelete.className = `btn btn-delete btn-danger`;
    btnAdd.textContent = "Добавить";
    btnDelete.textContent = "Удалить";
    btnsProduct.append(btnAdd);
    btnsProduct.append(btnDelete);
  }
}