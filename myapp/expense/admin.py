from django.contrib import admin
from .models import Expense,Category,PaymentMode

# Register your models here.
# class PostAdmin(admin.ModelAdmin):
    # list_display=('title','content')
    # search_fields=('title','content')
    # list_filter=('category','created_at')

admin.site.register(Expense)
admin.site.register(Category)
admin.site.register(PaymentMode)