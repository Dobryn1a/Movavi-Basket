openCart();

var d = document;
var tovar = d.querySelectorAll('.tovar'); // каждый товар в отдельности

function addEvent(elem, type, handler) {
    if (!elem) {
        return false;
    }
    if (window.addEventListener) {
        elem.addEventListener(type, handler, false);
    } else {
        elem.attachEvent('on' + type, function() {
            handler.call(elem);
        });
    }
    return false;
}
// Получаем данные из LocalStorage
function getCartData(){
    return JSON.parse(localStorage.getItem('cart'));
}
// Записываем данные в LocalStorage
function setCartData(o){
    localStorage.setItem('cart', JSON.stringify(o));
    return false;
}

// Добавляем товар в корзину
function addToCart(e){
    this.disabled = true; // блокируем кнопку на время операции с корзиной
    var cartData = getCartData() || {}, // получаем данные корзины или создаём новый объект, если данных еще нет
        parentBox = this.parentNode, // родительский элемент кнопки "Добавить в корзину"
        parentItems = parentBox.parentNode, // родительский элемент блока корзины, вообще как то не оч.
        itemId = this.getAttribute('data-id'), // ID товара
        itemTitle = parentItems.querySelector('.js-title').innerHTML, // название товара
        itemPrice = parentItems.querySelector('.tovar_price--item').innerHTML; // стоимость товара
    if(cartData.hasOwnProperty(itemId)){ // если такой товар уже в корзине, то добавляем +1 к его количеству
      cartData[itemId][2] += 1;
    } else { // если товара в корзине еще нет, то добавляем в объект
      cartData[itemId] = [itemId, itemTitle, itemPrice, 1];
    }
    if(!setCartData(cartData)){ // Обновляем данные в LocalStorage
      this.disabled = false; // разблокируем кнопку после обновления LS
    }
   return false;
}
// Устанавливаем обработчик события на каждую кнопку "Добавить в корзину"
for(var i = 0; i < tovar.length; i++){
    addEvent(tovar[i].querySelector('.js-add_item'), 'click', addToCart);
}

// Открываем корзину со списком добавленных товаров
function openCart(e){
    var cartData = getCartData(); // вытаскиваем все данные корзины
    var totalItems = '';
    var totalSum = 0;
    // если что-то в корзине уже есть, начинаем формировать данные для вывода
    if(cartData !== null){
      for(var items in cartData){
        totalItems += '<div class="cart_content">' + 
        '<button class="cart_close" data-delete="' + cartData[items][0] + '" type="button"></button>' +
        '<p class="cart_content--name">' + cartData[items][1] + '</p>' +
        '<p class="cart_content--price"><span class="js-price">' + cartData[items][2] + '</span> руб.</p>' +
        '</div>';
        totalSum += cartData[items][2] * 1;
      }
      document.getElementById('js-summ').innerHTML = totalSum; // итоговая сумма
      var basketItems = document.getElementById('js-carts'); // блок корзины
      basketItems.innerHTML = totalItems;
    }
    return false;
}
/* Очистить корзину */
addEvent(d.getElementById('order'), 'click', function(e){
  localStorage.removeItem('cart');
});