from django.urls import path, include
from . import views
from .views import CartItemViewSet
from rest_framework.routers import DefaultRouter



router = DefaultRouter()
router.register(r'cart', CartItemViewSet, basename='cart')

urlpatterns = [
    path('', views.cart_view, name='cart_view'),
    path('add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('api/', include(router.urls)),
]
