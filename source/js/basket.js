(function() {
  // проверяем поддержку IE
  if (!Element.prototype.closest) {
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    Element.prototype.closest = function (s) {
      var el = this;
      var ancestor = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (ancestor.matches(s)) return ancestor;
        ancestor = ancestor.parentElement;
      } while (ancestor !== null);
      return null;
    };
  }
})();

var elements = document.querySelectorAll('.sticky');
Stickyfill.add(elements);

var d = document;
var tovar = d.querySelectorAll('.tovar'); // каждый товар в отдельности

function addEvent(elem, type, handler){
  if(elem.addEventListener){
    elem.addEventListener(type, handler, false);
  } else {
    elem.attachEvent('on'+type, function(){ handler.call(elem); });
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
    var cartData = getCartData() || {}; // получаем данные корзины или создаём новый объект, если данных еще нет
    var parentBox = this.parentNode; // родительский элемент кнопки "Добавить в корзину"
    var parentItems = parentBox.parentNode; // родительский элемент блока корзины, вообще как то не оч.
    var itemId = this.getAttribute('data-id'); // ID товара
    var itemTitle = parentItems.querySelector('.js-title').innerHTML; // название товара
    var itemPrice = parentItems.querySelector('.tovar_price--item').innerHTML; // стоимость товара
    if(cartData.hasOwnProperty(itemId)){ // если такой товар уже в корзине, то добавляем +1 к его количеству
      cartData[itemId][3] += 1;
    } else { // если товара в корзине еще нет, то добавляем в объект
      cartData[itemId] = [itemId, itemTitle, itemPrice, 1];
    }
    if(!setCartData(cartData)){ // Обновляем данные в LocalStorage
      this.disabled = false; // разблокируем кнопку после обновления LS
    }
  return false;
}

// Обновляем корзину со списком добавленных товаров
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

// Устанавливаем обработчик события на каждую кнопку "Добавить в корзину"
for(var i = 0; i < tovar.length; i++){
    addEvent(tovar[i].querySelector('.js-add_item'), 'click', addToCart);
    addEvent(tovar[i].querySelector('.js-add_item'), 'click', openCart);
}

addEvent(document.getElementById('js-carts'), 'click', function(e){
	if(e.target.className === 'cart_close') {
    var itemId = e.target.getAttribute('data-delete');
		cartData = getCartData();
		if(cartData.hasOwnProperty(itemId)){
      var del = e.target.closest('div');
			del.parentNode.removeChild(del); /* Удаляем строку товара из таблицы */
      var totalSumOutput = document.getElementById('js-summ'); // пересчитываем общую сумму и цену
      totalSumOutput.textContent = +totalSumOutput.textContent - cartData[itemId][2] * 1;
			delete cartData[itemId]; // удаляем товар из объекта
			setCartData(cartData); // перезаписываем измененные данные в localStorage
		}
	}
}, false);

// Очистить корзину Специально сделано, что бы при нажатии на "Оформить заказ" отчищалось хранилище, просто для удобства
// addEvent(d.getElementById('order'), 'click', function(e){
//   localStorage.removeItem('cart');
//   location.reload();
// });
