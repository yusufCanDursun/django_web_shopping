from django.shortcuts import render, get_object_or_404
from .models import Product
from rest_framework import viewsets
from .serializers import ProductSerializers


class ProductViewSet(viewsets.ModelViewSet): 
    queryset = Product.objects.all()
    serializer_class = ProductSerializers

def product_list(request):
    products = Product.objects.all()
    return render(request, 'products/product_list.html', {'products': products})

def product_detail(request, id):
    product = get_object_or_404(Product,id=id)
    return render(request, 'products/product_detail.html', {'product': product})

