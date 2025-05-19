from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_products, name='product-list'),
    path('create/', views.create_product, name='product-create'),
    path('<int:product_id>/delete/', views.delete_product, name='product-delete'),
    path('seller/products/', views.list_seller_products, name='list_seller_products'),
]