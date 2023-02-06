function addToCart(proId,price) {
    $.ajax({
        url: '/add-to-cart/',
        data:{
            proId:proId,
            price:price
        },
        method:'post',
        success:(response)=>{
            if(response.status){
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $('#cart-count').html(count)
                location.reload()
            } else {
                location.href = '/login'
            }
        }
    })
}

function goToCart() {
    location.href='/cart'
}


