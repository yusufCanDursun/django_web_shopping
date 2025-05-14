from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError


class User(AbstractUser):
    USER_TYPES = (
        ('B', 'Buyer'),
        ('S', 'Seller'),
    )

    email = models.EmailField(
        'email address',
        unique=True,
        error_messages={
            'unique': "Bu email adresi zaten kayıtlı."
        }
    )
    user_type = models.CharField(max_length=1, choices=USER_TYPES, default='B')

    def clean(self):
        super().clean()
        if User.objects.filter(email=self.email).exclude(pk=self.pk).exists():
            raise ValidationError({'email': 'Bu email adresi zaten kullanımda.'})

    def save(self, *args, **kwargs):
        self.full_clean()  
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"