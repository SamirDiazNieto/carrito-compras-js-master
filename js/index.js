//   'use strick';

const numeroProductos = 6; /// Total de productos a la venta
const sotckGeneral = 5; /// Stock por defecto para todos los productos
const costoEnvio = 7000; /// Valor por defecto para envios 
const costoImpuestos = 1800; /// Valor por defecto para envios 


////////////////////////////////////////////////////////  Funcion de inicio de sesión
function ValidaLogin() {

  let nombre = document.getElementById("nombre");
  let msjNombre = document.getElementById("msjNombre");

  let pass = document.getElementById("pass");
  let msjPass = document.getElementById("msjContrasena");

  const nombreResult = nombre.value === "Samir" ? true : false;
  evaluaImput(nombre, msjNombre, nombreResult);
  const passResult = pass.value === "Escalab123" ? true : false;
  evaluaImput(pass, msjPass, passResult);

  inicioSesion(nombreResult, passResult);

  // if (nombreResult && passResult) {
  //   let sesion = document.getElementById("sesion-iniciada");
  //   let inicio = document.getElementById("fomulario-inicio-sesion");
  //   let compras = document.getElementById("comprar");
  //   sesion.style.display = "block";
  //   inicio.style.display = "none";
  //   compras.disabled = false;
  // }
}
function inicioSesion(nombre =0, contrasenia=0){
  let sesion = document.getElementById("sesion-iniciada");
  let inicio = document.getElementById("fomulario-inicio-sesion");
  let compras = document.getElementById("comprar");
  if (!nombre && !contrasenia) {
    sesion.style.display = "none";
    inicio.style.display = "block";
    compras.disabled = true;

  }else{
    sesion.style.display = "block";
    inicio.style.display = "none";
    compras.disabled = false;

  }
}
//////////  Funcion para CSS para inicio de sesión
function evaluaImput(input, msj, estado) {
  if (!estado) {
    input.classList.remove("margin-green");
    input.classList.add("margin-red");
    msj.innerText = "El dato no coincide.";
    msj.classList.remove("exito");
    msj.classList.add("error");
    return false;
  } else {
    input.classList.remove("margin-red");
    input.classList.add("margin-green");
    msj.innerText = "  El dato coincide.";
    msj.classList.remove("error");
    msj.classList.add("exito");

    return true;
  }
}
////////////////////////////////////////////////////////  Funcion para retablecer Stock
function restablecesStock() {
  for (let index = 1; index <= numeroProductos; index++) {
    let elemento = "stock-" + index;
    let value = document.getElementById(elemento);
    asignarStock(value);    
  }
  carritoCompras.vaciaritemsCarrito();
  carritoCompras.compraRealizada(false);
  vaciarCarrito("Restaurada");
  localStorage.clear();
}
//////////  Funcion para asignar stock
function asignarStock(elemento, stock = sotckGeneral) {
  elemento.innerHTML = stock + " Unidades en Stock";
}
////////////////////////////////////////////////////////  Clase para crear los articulos comprados en el carrito

class ItemCarrito {
  constructor(image, name, cost, index, qty = 1) {
   
    this._image = image;
    this._name = name;
    this._cost = cost;
    this.qty = qty;
    this._index = index;
    this.total = qty * cost;
  }

  get image(){
    return this._image;
  }
  get name(){
    return this._name;
  }
  get cost(){
    return this._cost;
  }
  get index(){
    return this._index;
  }

}

class CarritoCompras {
  constructor() {
    this.itemsCarrito = [];
    this.totalProductos = 0;
    this.subtotalCompra = 0;
    this.totalCompra = 0;
    this.totalEnvio;
    this.contador = 0;
  }
  agregaItem = function agregar(item) {
    let idexItem;
    console.log("inicio funcion contador= "+this.contador);

    let existe = this.itemsCarrito.find(
      (elemento) => elemento.name === item.name
    );

    if (this.itemsCarrito.length == 0) {
      this.itemsCarrito.push(item);
      this.contador+=1;
      idexItem = "item-"+item.index;
      localStorage.setItem(idexItem, JSON.stringify(item));
      localStorage.setItem('items', JSON.stringify(this.contador));
      console.log(item);
      console.log(this.contador);
      console.log("primera vez");
    } else if (existe) {
      let index = this.itemsCarrito.indexOf(existe);
      this.itemsCarrito[index].qty += item.qty;
      this.itemsCarrito[index].total = this.itemsCarrito[index].qty * this.itemsCarrito[index].cost;
      this.contador+=1;
      idexItem = "item-"+item.index;
      localStorage.removeItem(idexItem);
      localStorage.setItem(idexItem, JSON.stringify(this.itemsCarrito[index]));
      localStorage.setItem('items', JSON.stringify(this.contador));
      console.log(this.contador);
      console.log("otra primera vez");
      
    } else {
      this.itemsCarrito.push(item);
      this.contador+=1;
      idexItem = "item-"+item.index;
      localStorage.setItem(idexItem, JSON.stringify(item));
      localStorage.setItem('items', JSON.stringify(this.contador));
      console.log(this.contador);
      console.log("N vez");
      
    }
    
  }
  listarItems = () => {
    limpiarCarrito();
    this.itemsCarrito.forEach((itemCart) => {
      let item = document.getElementById("itemComprado");
      let newArticle = document.createElement("article");
   newArticle.innerHTML = `
     <figure class="articulo-n">
         <img class="thumbnails" src=${itemCart.image} alt="item">
         </figure>
         <hgroup class="detalles">
             <h5 id="nombre-detalle">${itemCart.name}</h5>
             <h5 id="precios-detalle">$${itemCart.cost}</h5>
             <h5 id="cantidad-detalle">${itemCart.qty} unidades</h5>
             <h5 id="Total-detalle">Total $${itemCart.total}</h5>
             </hgroup>`;
      newArticle.classList.add("item");
      newArticle.classList.add("comprado");
      item.appendChild(newArticle);

    });
  }
  calcularTotal = () => {
    this.itemsCarrito.forEach(element => {
        this.totalProductos += element.total;
    });
    this.subtotalCompra = (this.itemsCarrito.length * costoImpuestos );
    this.totalCompra = this.totalProductos + this.subtotalCompra;
}
  actulizarStock = () => {
    
    this.itemsCarrito.forEach(element => {
        console.log(element);
        let newQty= element.qty;
        let id = "stock-"+element.index
        let newstock = document.getElementById(id);
        console.log(newstock);
        newstock.innerHTML= parseInt(newstock.innerText[0]) - parseInt(newQty)  +" unidades disponibles";
    });
    
}
compraRealizada = (valor) =>{
    let totalProductos = document.getElementById("t-productos");
    let totalCompra = document.getElementById("t-compras");
    let totalEnvio = document.getElementById("t-envio");

    if (!valor) {
        this.totalProductos = 0;
        this.subtotalCompra = 0;
        this.totalCompra = 0;
        this.totalEnvio = 0;
    }else{
      this.totalEnvio = costoEnvio; 
    }
    totalProductos.innerText = "Total Productos: $" + (this.totalProductos);
    totalEnvio.innerText = "Envio: $" + (this.totalEnvio);
    totalCompra.innerText = "Total a Comprar: $" + (this.totalEnvio + this.totalCompra);
    this.totalProductos=0;

}

vaciaritemsCarrito = () =>{
    this.itemsCarrito = [];
  }
  persisteItemsCarrito  = (item) =>{
  this.itemsCarrito.push(item);
}
persisteStockCarrito  = () =>{
  this.itemsCarrito.forEach(item => {
    let enCartProd = "enCarrito-" + item._index;
    let enCarrito = document.getElementById(enCartProd);
    enCarrito.innerHTML =`  ${item.qty} en carrito  `;

});
}


}
const carritoCompras = new CarritoCompras(); /// Elementos del Carrito de Compras

//////////  Funcion para agregar los articulos comprados en el carrito
function agregarItem(index) {

  const nomProd = "nombre-producto-" + index;
  const preProd = "precio-producto-" + index;
  const stockProd = "stock-" + index;
  const enCartProd = "enCarrito-" + index;
  const button = "comprar-" + index;
  const urlRelativa = "img-" + index;
  
  let url = document.getElementById(urlRelativa).src;
  let nombre = document.getElementById(nomProd);
  let precio = document.getElementById(preProd);
  let cantidad = document.getElementById(stockProd);
  let enCarrito = document.getElementById(enCartProd);
  let boton = document.getElementById(button);
 

  const { cantidadInt, enCarritoInt, precioInt } = stockNumber(
    cantidad.innerText,
    enCarrito.innerText,
    precio.innerText
  );

  if (enCarritoInt < cantidadInt) {
    const item = new ItemCarrito(url, nombre.innerText, precioInt, index);
    carritoCompras.agregaItem(item);
    console.log(item);
    carritoCompras.listarItems();
    enCarrito.innerHTML = enCarritoInt + 1 + " en Carrito";
    carritoCompras.calcularTotal();
    carritoCompras.compraRealizada(true);
  } else {
      boton.disabled = true;
    enCarrito.innerHTML = "No hay Stock Diponible";
  }
  //  IF ELSE EN UNA SOLA LINEA CADA UNO
  // if (true)return true;
  // return false;


}
////////// Funciones para vaciar carrito
function vaciarCarrito(texto) {

    limpiarCarrito();
  let item = document.getElementById("itemComprado");
  let clase = texto === "Exitosa" ? "exito" : "error";
  item.innerHTML = `
       <h5 class="${clase} encabezados">Compra ${texto} !!!</h5>`;
  for (let index = 1; index <= numeroProductos; index++) {
    // PREGUNTAR COMO HACER PARA NO REPETIR
    let button = "comprar-" + index;
    let enCartProd = "enCarrito-" + index;
    let boton = document.getElementById(button);
    let enCarrito = document.getElementById(enCartProd);
    boton.disabled = false;
    enCarrito.innerHTML = "";
  }
}
function limpiarCarrito(){
    const compras = document.getElementById("itemComprado");
    while (compras.firstChild) {
      compras.removeChild(compras.firstChild);
    }
}
////////////////////////////////////////////////////////  Funcion para comprar
function comprar() {

    let botones = document.querySelectorAll('button')
    let item = document.getElementById("itemComprado");
    let bloqBtnComprar = document.getElementById("comprar");
    item.innerHTML = `
   <h5 class="encabezados">Estamos Procesando su compra.....</h5>`;
    recorrerBotones(botones, true);
    setTimeout(()=>{
         recorrerBotones(botones,false);
        carritoCompras.actulizarStock();
        carritoCompras.compraRealizada(false); 
        vaciarCarrito("Exitosa");
        carritoCompras.vaciaritemsCarrito();
        localStorage.clear();
    },3000);


}
////////// Funcion para recorres botones enable/disable
function recorrerBotones(botones, estado){
    botones.forEach(element => {
        element.disabled = estado;
    });
}
////////// Funcion para convertir el INT las cantidades de items
function stockNumber(idstock, idenCart, precio) {
  const cartNumber = idenCart ? parseInt(idenCart[0]) : 0;
  const stockNumber = parseInt(idstock[0]);
  const price = precio.slice(1);

  return (obj = {
    cantidadInt: stockNumber,
    enCarritoInt: cartNumber,
    precioInt: parseInt(price),
  });
}



const btnIiniciarSesion = document.getElementById("inicio-sesions");
const btnComprar = document.getElementById("comprar");
const btnRestStock = document.getElementById("restStock");
btnIiniciarSesion.addEventListener('click',ValidaLogin);
btnComprar.addEventListener('click',comprar);
btnRestStock.addEventListener('click',restablecesStock);


  const comprarArticlo1 = document.getElementById("comprar-1");
  const comprarArticlo2 = document.getElementById("comprar-2");
  const comprarArticlo3 = document.getElementById("comprar-3");
  const comprarArticlo4 = document.getElementById("comprar-4");
  const comprarArticlo5 = document.getElementById("comprar-5");
  const comprarArticlo6 = document.getElementById("comprar-6");
 // una funcion de flecha sin llaves{} returna el valor que se asgine (solo un valor) 
  comprarArticlo1.addEventListener('click',() => agregarItem(1));
  comprarArticlo2.addEventListener('click',() => agregarItem(2));
  comprarArticlo3.addEventListener('click',() => agregarItem(3));
  comprarArticlo4.addEventListener('click',() => agregarItem(4));
  comprarArticlo5.addEventListener('click',() => agregarItem(5));
  comprarArticlo6.addEventListener('click',() => agregarItem(6));


//  document.addEventListener('onunload', ()=> {

//  });
  window.onload= function (){
    
    let producto;
    let indice;

    if(!localStorage.getItem('items')){
      console.log("Esta vacio el local Storage");
    }else{
       inicioSesion(0,0); 
        for (let index = 1; index <= numeroProductos; index++) {
          indice = 'item-'+index
          if(localStorage.getItem(indice)){
            producto = JSON.parse(localStorage.getItem(indice)) ;
            // constructor(image, name, cost, index, qty = 1)
            const itemPesit = new ItemCarrito(producto._image, producto._name, producto._cost, producto._index, producto.qty);
            // console.log(producto);
            console.log(itemPesit);
           carritoCompras.persisteItemsCarrito (itemPesit);
            
          }
        }
      carritoCompras.listarItems();
      carritoCompras.calcularTotal();
      carritoCompras.compraRealizada(true);
      carritoCompras.persisteStockCarrito();

    }

   };