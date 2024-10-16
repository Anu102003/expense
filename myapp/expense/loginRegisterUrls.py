from django.urls import re_path
from . import loginRegisterViews

urlpatterns = [
    re_path('register', loginRegisterViews.RegisterView.as_view(), name='register'),
    re_path('login', loginRegisterViews.LoginView.as_view(), name='login'),
    re_path('refresh-token', loginRegisterViews.RefreshView.as_view(), name='refresh'),
    re_path('logout', loginRegisterViews.LogoutView.as_view(), name='logout'),
]

