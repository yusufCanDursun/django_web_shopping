from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import Cart, CartItem
import json
from products.models import Product

@csrf_exempt
@login_required
def add_to_cart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_id = data['product_id']
            quantity = data.get('quantity', 1)

            cart, _ = Cart.objects.get_or_create(user=request.user)
            product = Product.objects.get(id=product_id)

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )

            if not created:
                cart_item.quantity += quantity
                cart_item.save()

            return JsonResponse({
                "status": "success",
                "cart_item_id": cart_item.id,
                "quantity": cart_item.quantity
            })

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)


@login_required
def view_cart(request):
    cart = Cart.objects.get(user=request.user)
    items = cart.items.all().values(
        'id',
        'product__id',
        'product__name',
        'product__price',
        'quantity'
    )
    return JsonResponse(list(items), safe=False)


@csrf_exempt
@login_required
def remove_from_cart(request, item_id):
    try:
        item = CartItem.objects.get(id=item_id, cart__user=request.user)
        item.delete()
        return JsonResponse({"status": "success"})
    except CartItem.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Item not found"}, status=404)