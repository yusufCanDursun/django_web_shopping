from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet


router = DefaultRouter()
router.register(r'products',ProductViewSet, basename='product')

urlpatterns = [
    path('', views.product_list, name='product_list'),
    path('<int:id>/', views.product_detail, name='product_detail'),
    path('api/', include (router.urls)),
]
