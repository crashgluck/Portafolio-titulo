from django.contrib import admin
from django.urls import include, path

from config.api import healthcheck

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health', healthcheck, name='healthcheck'),
    path('api/v1/auth/', include('users.auth_urls')),
    path('api/v1/users/', include('users.user_urls')),
    path('api/v1/billing/', include('billing.urls')),
    path('api/v1/reservations/', include('reservations.urls')),
]
