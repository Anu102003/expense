"""
URL configuration for myapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import re_path, include
from . import views

urlpatterns = [
    re_path("transaction/", include("expense.transactionUrls")),
    re_path("dashboard/", include("expense.dashboardUrls")),
    # re_path("demo1/", views.message,name="message"),
    re_path("admin/", admin.site.urls),
    re_path("api/",include('expense.loginRegisterUrls'))
]
