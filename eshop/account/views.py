from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout


@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            required_fields = ['username', 'email', 'password']
            if not all(field in request.POST for field in required_fields):
                return JsonResponse({"status": "error", "message": "Eksik bilgi"}, status=400)

            user_type = request.POST.get('user_type', 'B')

            user = User.objects.create_user(
                username=request.POST['username'],
                email=request.POST['email'],
                password=request.POST['password'],
                user_type=user_type
            )

            return JsonResponse({
                "status": "success",
                "user_id": user.id,
                "user_type": user.get_user_type_display()
            })

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Sadece POST isteği kabul edilir"}, status=405)

@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user_type = request.POST.get('user_type')  # 'B' veya 'S'

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.user_type != user_type:
                return JsonResponse({
                    "status": "error",
                    "message": f"{user.get_user_type_display()} olarak giriş yapamazsınız"
                }, status=403)

            login(request, user)
            return JsonResponse({
                "status": "success",
                "user_type": user.get_user_type_display()
            })

        return JsonResponse({
            "status": "error",
            "message": "Kullanıcı adı/şifre hatalı"
        }, status=400)

    return JsonResponse({
        "status": "error",
        "message": "Sadece POST isteği kabul edilir"
    }, status=405)


@csrf_exempt
def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({"success": "Çıkış başarılı"})
    return JsonResponse({"error": "Kullanıcı giriş yapmamış"}, status=400)