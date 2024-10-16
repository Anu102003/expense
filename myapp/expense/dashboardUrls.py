from django.urls import re_path
from . import dashboardViews

urlpatterns = [
    re_path("",dashboardViews.GetDemo.as_view(),name="index")
]
