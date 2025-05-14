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
                return JsonResponse({
                    "status": "error",
                    "message": "Eksik bilgi: username, email ve password gereklidir"
                }, status=400)

            email = request.POST['email'].lower().strip()
            if '@' not in email or '.' not in email.split('@')[-1]:
                return JsonResponse({
                    "status": "error",
                    "message": "Geçersiz email formatı"
                }, status=400)

            if User.objects.filter(username=request.POST['username']).exists():
                return JsonResponse({
                    "status": "error",
                    "message": "Bu kullanıcı adı zaten alınmış"
                }, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({
                    "status": "error",
                    "message": "Bu email adresi zaten kayıtlı"
                }, status=400)

            user_type = request.POST.get('user_type', 'B')
            if user_type not in dict(User.USER_TYPES).keys():
                return JsonResponse({
                    "status": "error",
                    "message": f"Geçersiz kullanıcı tipi. Geçerli seçenekler: {list(dict(User.USER_TYPES).keys())}"
                }, status=400)

            user = User.objects.create_user(
                username=request.POST['username'],
                email=email,
                password=request.POST['password'],
                user_type=user_type
            )

            return JsonResponse({
                "status": "success",
                "user_id": user.id,
                "username": user.username,
                "user_type": user.get_user_type_display(),
                "message": "Kullanıcı başarıyla oluşturuldu"
            }, status=201)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": f"Beklenmeyen hata: {str(e)}"
            }, status=500)

    return JsonResponse({
        "status": "error",
        "message": "Sadece POST isteği kabul edilir"
    }, status=405)

@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

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
                "user_type": "seller" if user.user_type == 'S' else "buyer"
            }

            if user.user_type == 'S':
                response_data["redirect_url"] = "/seller-dashboard/"
            else:
                response_data["redirect_url"] = "/products/"

            return JsonResponse(response_data)

        return JsonResponse({
            "status": "error",
            "message": "Geçersiz email veya şifre"
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