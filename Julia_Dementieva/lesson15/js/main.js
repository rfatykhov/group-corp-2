function loadProducts(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function(){
            if (xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status !== 200){
                    reject(xhr.status);
                }
                const dbObject = JSON.parse(xhr.responseText);
                resolve(dbObject);
            }
        };
        xhr.send();
    });
}


loadProducts('/catalog')
  .then((catalogDB) => {
    const arrCatalog = [];

    catalogDB.forEach( (element) => {
          const catalogItem = new Product(element.id,element.name, element.price, element.quantity, element.imgs);
          arrCatalog.push(catalogItem);
    });

    const catalog = new Catalog(arrCatalog);

    document.querySelector('.catalog-container').appendChild(catalog.render());
    const hr = document.createElement('hr');
    document.querySelector('.catalog-container').appendChild(hr);

    // Сделала через замыкание, т.к. нужен был доступ сразу к переменной catalog(catalog.init(basket)) и 
    // к данным корзины, поэтому написать просто return loadProducts('/catalog') не получилось
    return loadProducts('/basket').then((basketDB)=> {

        const arrBasket = [];

        basketDB.forEach( (element) => {
              const basketItem = new ProductInBasket(element.id,element.name, element.price, element.quantity, element.imgs);
              arrBasket.push(basketItem);
        });
        

        const basket = new Basket(arrBasket);


        catalog.init(basket);
        const renderForm = new RenderForm();
        basket.init(renderForm, catalog);
        renderForm.init(basket);
        renderForm.renderAddressComment();
        renderForm.switchForm(true,false,false);


        document.querySelector('.wrapper').addEventListener('click',(event) =>{
          if(event.target.classList.contains('addBasket')){
            const input = document.querySelector(`#quanCatInput${event.target.id}`);
            if(/^[1-9][0-9]*$/.test(input.value) && basket.add(catalog.productList[event.target.id], input.value)){
              input.classList.remove('input-error');
              input.value = 0;

              catalog.clearRender();
              catalog.render();

              basket.clearRender();
              basket.render();
            } else {
              input.classList.toggle('input-error');
            }
          }else if(event.target.classList.contains('deleteProduct')){
            basket.delete(event.target.id);
            catalog.clearRender();
            catalog.render();
            basket.clearRender();
            basket.render();
          }else if(event.target.classList.contains('nextBasket')){
            renderForm.activeAddress = true;
            renderForm.switchForm(true,true,false);
          } else if (event.target.classList.contains('nextAddress')){
              const inputName = document.querySelector('.inputName');
              const inputPhone = document.querySelector('.inputPhone');
              const inputEmail = document.querySelector('.inputEmail');
              const inputAddress = document.querySelector('.inputAddress');

              // Вся проверка в методе, в нем же и отрисовка подсказок в случае ошибки
              if(renderForm.validContact(inputName,inputPhone,inputEmail,inputAddress)){
                renderForm.activeComment = true;
                renderForm.switchForm(true,true,true);

              } else {
                alert(renderForm.getErr());
                renderForm.clearErr();

              }
                  
              
          } else if (event.target.classList.contains('orderExec')){

              basket.name = document.querySelector('.inputName').value;
              basket.phone = document.querySelector('.inputPhone').value;
              basket.email = document.querySelector('.inputEmail').value;
              basket.address = document.querySelector('.inputAddress').value;
              basket.comment = document.querySelector('textarea').value;
              
              
              renderForm.showConfirm();
          } else if (event.target.classList.contains('btn-secondary')){
              renderForm.closeConfirm();
          } else if (event.target.classList.contains('btn-info')){
              renderForm.closeConfirm();
              renderForm.clear();
              
              renderForm.openBasket();
              alert('Спасибо за заказ!');

          }
        }); 
    });
  },(status) => {
      console.log(status);
  });

async function ChartStatics(){
  const response = await fetch('/sales');
  const sales = await response.json();
  // Pie
  var canvasPie = document.querySelector('.pieChart');
  canvasPie.width = 200;
  canvasPie.height = 200;

  // Одна легенда на две диаграммы
  var legend = document.querySelector('.Legend');
  let chartP = new PieChart(sales, canvasPie, legend);
  chartP.renderPie();

  // Bar
  var canvasBar = document.querySelector('.barChart');
  canvasBar.width = 300;
  canvasBar.height = 200;
  var barLegend = document.querySelector('.barLegend');
  let chartB = new BarChart(sales, canvasBar, barLegend);
  chartB.renderBar();
}

ChartStatics();


async function changeQuan(url, quanChange){
  const quan = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({quantity: quanChange}),
    headers:{
      'Content-type': 'application/json',
    }
  });
}

async function addPrdInBasket(product){
  const newProduct = await fetch('/basket', {
    method: 'POST',
    body: JSON.stringify({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      imgs: product.imgs,
    }),
    headers:{
      'Content-type': 'application/json',
    }
  });
}

async function deleteProduct(idProduct){
  const id = await fetch(`/basket/${idProduct}`, {
    method: 'DELETE'
  });
}

async function getPrdsInBasket(name){
  const basket = await fetch(`/basket?name=${name}`);
  return basket.json();
}



    