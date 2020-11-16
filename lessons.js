var webstore = new Vue({ el: '#app', data: 
{
    sitename: "After School Club",
    order: {
        name: '',
        phoneNumber: +44
    },
    product: 
        {
            id: 1001,     
            subject: "Math",
            location: "London",
            price: 100,
            image: "https://i.imgur.com/K4vuaWq.png",
            spaces: 5
},
    cart : []
},
    methods: {
        addToCart: function() {
            if (this.product.spaces == 0) {
                return;
            } else {
            this.product.spaces = this.product.spaces - 1;
            this.cart.push(this.product.id);
        }},
        submitOrder: function() {
            alert('Order Submitted!');
        }
    },
    computed: { 
        cartItemCount: function() { 
        return this.cart.length;
        },
        canShowAdd: function(){
            if (this.product.spaces == 0) {
                return false;
            } else {
                return true;
            }
        },
        canShowCart: function(){
            if (this.cartItemCount > 0) {
                return true;
            } else {
                return false;
            }
        },
        canShowCheckout: function(){
            if (this.order.name != '' && this.order.phoneNumber != 44){
                return true;
        } else {
            return false;
        }
    },




}});
