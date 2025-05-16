from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
import json
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required


User = get_user_model()

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            # JSON verisini parse et
            data = json.loads(request.body)

            required_fields = ['username', 'email', 'password']
            if not all(field in data for field in required_fields):
                return JsonResponse({
                    "status": "error",
                    "message": "Eksik bilgi: username, email ve password gereklidir",
                    "missing_fields": [field for field in required_fields if field not in data]
                }, status=400)

            # Kullanıcı oluştur
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                user_type=data.get('user_type', 'B')
            )

            return JsonResponse({
                "status": "success",
                "user_id": user.id,
                "username": user.username
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({
                "status": "error",
                "message": "Geçersiz JSON formatı"
            }, status=400)
        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)

    return JsonResponse({
        "status": "error",
        "message": "Sadece POST isteği kabul edilir"
    }, status=405)

@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        try:
            # JSON verisini parse et
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({
                    "status": "error",
                    "message": "Email ve şifre gereklidir"
                }, status=400)

            user = authenticate(request, email=email, password=password)

            if user is not None:
                login(request, user)
                response_data = {
                    "status": "success",
                    "user_type": "seller" if user.user_type == 'S' else "buyer",
                    "message": "Giriş başarılı"
                }

                if user.user_type == 'S':
                    response_data["redirect_url"] = "/sellerpanel/"
                else:
                    response_data["redirect_url"] = "/products/"

                return JsonResponse(response_data)

            return JsonResponse({
                "status": "error",
                "message": "Geçersiz email veya şifre"
            }, status=400)

        except json.JSONDecodeError:
            return JsonResponse({
                "status": "error",
                "message": "Geçersiz veri formatı"
            }, status=400)

    return JsonResponse({
        "status": "error",
        "message": "Sadece POST isteği kabul edilir"
    }, status=405)

@csrf_exempt
@login_required
def user_info(request):
    if request.method == 'GET':
        return JsonResponse({
            "username": request.user.username,
            "email": request.user.email,
            "user_type": "seller" if request.user.user_type == 'S' else "buyer"
        })

@csrf_exempt
def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({"success": "Çıkış başarılı"})
    return JsonResponse({"error": "Kullanıcı giriş yapmamış"}, status=400)