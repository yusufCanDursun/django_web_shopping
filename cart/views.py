from django.shortcuts import render, redirect
from .models import Cart,CartItem
from products.models import Product
from rest_framework import viewsets
from .serializers import CartItemSerializer



class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializers_class = CartItemSerializer

def cart_view(request):
    cart = Cart.objects.get(user=request.user)
    return render(request, 'cart/cart_view.html', {'cart': cart})

def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart.products.add(product) 
    return redirect('cart_view')
