from django.urls import path

from .views import (
    CommonSpaceListCreateAPIView,
    CommonSpaceRetrieveUpdateDestroyAPIView,
    ReservationListCreateAPIView,
    ReservationRetrieveUpdateDestroyAPIView,
)

urlpatterns = [
    path('common-spaces/', CommonSpaceListCreateAPIView.as_view(), name='common-space-list-create'),
    path('common-spaces/<slug:slug>/', CommonSpaceRetrieveUpdateDestroyAPIView.as_view(), name='common-space-detail'),
    path('', ReservationListCreateAPIView.as_view(), name='reservation-list-create'),
    path('<int:pk>/', ReservationRetrieveUpdateDestroyAPIView.as_view(), name='reservation-detail'),
]
