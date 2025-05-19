from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Product
from django.contrib.auth.decorators import login_required
from django.conf import settings
import json
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def create_product(request):
    if request.method == 'POST':
        try:
            name = request.POST.get('name')
            description = request.POST.get('description')
            price = request.POST.get('price')
            image = request.FILES.get('image')

            product = Product.objects.create(
                seller=request.user,
                name=name,
                description=description,
                price=price,
                image=image
            )

            return JsonResponse({
                "status": "success",
                "product_id": product.id
            }, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

def list_products(request):
    products = Product.objects.all()
    data = []
    for product in products:
        data.append({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "image": request.build_absolute_uri(product.image.url) if product.image else None,
        })
    return JsonResponse(data, safe=False)

@login_required
def get_current_user(request):
    user = request.user

    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "user_type": getattr(user, 'user_type', None),
    }

    return JsonResponse(user_data)

@csrf_exempt
@login_required
def list_seller_products(request):
    """Sadece giriş yapmış satıcının kendi ürünlerini listeler"""
    user = request.user

    logger.info(f"list_seller_products çağrıldı. Kullanıcı: {user.username}, ID: {user.id}")

    # Satıcının kendi ürünlerini filtrele
    products = Product.objects.filter(seller=user)

    logger.info(f"Bulunan ürün sayısı: {products.count()}")

    data = []
    for product in products:
        data.append({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": str(product.price),
            "image": request.build_absolute_uri(product.image.url) if product.image else None,
            "seller_id": product.seller.id,
        })

    logger.info(f"Toplam {len(data)} ürün döndürülüyor")
    return JsonResponse(data, safe=False)

@login_required
def delete_product(request, product_id):

    if request.method != 'DELETE':
        return JsonResponse({"error": "Sadece DELETE metodu kabul edilir"}, status=405)

    try:
        product = Product.objects.get(id=product_id)

        # Sadece ürünün sahibi silebilir
        if product.seller != request.user:
            return JsonResponse(
                {"error": "Bu ürünü silme yetkiniz yok. Sadece kendi ürünlerinizi silebilirsiniz."},
                status=403
            )

        product.delete()
        return JsonResponse({"success": True, "message": "Ürün başarıyla silindi"})

    except Product.DoesNotExist:
        return JsonResponse({"error": "Ürün bulunamadı"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)