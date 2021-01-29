var webstore = new Vue({ el: '#app', data: 
{
    sitename: "After School Club",
    order: {
        name: '',
        phoneNumber: +44
    },
    products: [],
    bought: [],
    showProduct:
        {
            visible: true,
            showP: true
    },
    cart : []
},
    mounted() {
        this.$nextTick(() => {
            this.retrieveLessons();
        })
    },
    methods: {
        retrieveLessons: function() {
        fetch('https://cw2webapps.herokuapp.com/api/collection/lessons').then(
            function (response) {
                response.json().then(
                    function (json) {
                        webstore.products = json;
                        }
                    );
                }
            )
        },
        addToCart: function(product) {
            product.spaces = product.spaces - 1;
            this.cart.push(product._id);
        },
        submitOrder: function() {   
            const newOrder = {name: this.order.name, phone: this.order.phoneNumber, ordered: this.cart };
            fetch('https://cw2webapps.herokuapp.com/api/collection/orders', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder), 
            })
            .then(response => response.json())
            .then(responseJSON => {
                console.log('Success:', responseJSON);
            });
            for (p=0;p < this.cart.length;p++){
                console.log(p);
                
                /*
                fetch('https://cw2webapps.herokuapp.com/api/collection/lessons/'+this.cart[p]).then(
                    function (response) {
                        response.json().then(
                            function (json) {
                                console.log(json);
                                webstore.bought = json;
                                }
                            );
                        }
                    )
                */
               mama = 0;
               mama = this.cart[p];
               console.log(mama);
               //console.log(mama);
                async function fetchJSON() {
                    const response = await fetch('https://cw2webapps.herokuapp.com/api/collection/lessons/'+mama);
                    const jaja = await response.json();  return jaja;
                }
                
                fetchJSON().then(jaja => {
                console.log(mama);
                nSpace = jaja.spaces - 1;
                console.log(nSpace);
                const nData = {
                    spaces : nSpace
                    }
                const putMethod = {
                    method: 'PUT', // Method itself
                    headers: {
                     'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
                    },
                    body: JSON.stringify(nData) // We send data in JSON format
                   }
                   // make the HTTP put request using fetch api
                   fetch('https://cw2webapps.herokuapp.com/api/collection/lessons/'+mama, putMethod)
                   .then(response => response.json())
                   .then(data => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
                   .catch(err => console.log(err)) // Do something with the error
                    
                });

                   
            };
            alert('order submitted!');
        },        
        showCheckout: function(){
            return this.showProduct.visible = this.showProduct.visible ? false : true;
        },
        showSort: function(){
            return this.showProduct.showP = this.showProduct.showP ? false : true;
        },
        removeId: function(product){
            for (i=0;i< this.cart.length;i++){
                if (this.cart[i] == product) {
                    this.cart.splice(i,1);
                    product.spaces = product.spaces + 1;
                    return true;
                }
            }
        },
        canShowAdd: function(product){
            return product.spaces > 0;
        },
        chooseSort: function(){
            return this.showProduct.showP = this.showProduct.showP ? false : true;
        }
    },
    computed: { 
        cartItemCount: function() { 
        return this.cart.length;
        },
        canShowBack: function(){
            if (this.showProduct.visible = true) {
                return true;
            } else {
                return false;
            }
        },
        canCheckout: function(){
            if (this.order.name != '' && this.order.phoneNumber != 44){
                return true;
        } else {
            return false;
        }},
        canShowCheckout: function(){
                return this.cart.length > 0;
        },
        sortedProducts() {
            function compare(a,b) {
                if (a.price > b.price) return 1;
                if (a.price < b.price) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
        sortProducts() {
            function compare(a,b) {
                if (a.price < b.price) return 1;
                if (a.price > b.price) return -1;
                return 0;
        }
            return this.products.sort(compare);
        },
        higher: function(){

        }

    },



});
