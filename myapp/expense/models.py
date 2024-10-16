from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager() # type: ignore

    def __str__(self):
        return self.email
    
class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class PaymentMode(models.Model):
    id = models.AutoField(primary_key=True)
    mode = models.CharField(max_length=20, unique=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.mode

class Expense(models.Model):
    id = models.AutoField(primary_key=True)
    TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    type = models.CharField(max_length=7, choices=TYPE_CHOICES)
    date = models.DateField()
    time = models.TimeField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    payment_mode = models.ForeignKey(PaymentMode, on_delete=models.CASCADE)
    deleted = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['type']),
            models.Index(fields=['category']),
            models.Index(fields=['payment_mode']),
        ]
    
    def delete(self):
        self.deleted = True
        self.save()

    def undelete(self):
        self.deleted = False
        self.save()

    def __str__(self):
        return f"{self.type} - {self.amount} on {self.date}"

