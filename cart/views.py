from django.shortcuts import render, redirect
from .models import Cart
from products.models import Product

def cart_view(request):
    cart = Cart.objects.get(user=request.user)
    return render(request, 'cart/cart_view.html', {'cart': cart})

def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart.products.add(product)  # Örneğin, ürün sepete ekleniyor
    return redirect('cart_view')
