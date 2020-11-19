var webstore = new Vue({ el: '#app', data: 
{
    sitename: "After School Club",
    order: {
        name: '',
        phoneNumber: +44
    },
    products: products,
    showProduct:
        {  
            visible: true,
            showP: true
    },
    cart : []
},
    methods: {
        addToCart: function(product) {
            product.spaces = product.spaces - 1;
            this.cart.push(product.id);
        },
        submitOrder: function() {
            alert('Order Submitted!');
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
