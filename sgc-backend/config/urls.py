from django.contrib import admin
from django.urls import include, path

from config.api import healthcheck

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health', healthcheck, name='healthcheck'),
    path('api/v1/auth/', include('users.urls')),
]
