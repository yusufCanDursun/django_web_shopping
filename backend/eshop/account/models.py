from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_TYPES = (
        ('B', 'Buyer'),
        ('S', 'Seller'),
    )
    user_type = models.CharField(
        max_length=1,
        choices=USER_TYPES,
        default='B',
        verbose_name="Kullanıcı Tipi"
    )

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"