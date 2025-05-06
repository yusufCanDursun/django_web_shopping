from rest_framework import serializers
from .models import CartItem
from products.models import Product  

class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )
    
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity', 'product_id']
        read_only_fields = ['cart', 'product']  