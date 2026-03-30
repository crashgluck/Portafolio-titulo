from rest_framework import generics

from users.models import User

from .models import CommonSpace, Reservation
from .permissions import CanAccessReservations, CanReadCommonSpaces
from .serializers import CommonSpaceSerializer, ReservationSerializer


class CommonSpaceListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommonSpaceSerializer
    permission_classes = (CanReadCommonSpaces,)
    queryset = CommonSpace.objects.all().order_by('name')

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.request.user.role == User.Role.SUPERADMIN:
            return queryset

        return queryset.filter(is_active=True)


class CommonSpaceRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommonSpaceSerializer
    permission_classes = (CanReadCommonSpaces,)
    queryset = CommonSpace.objects.all()
    lookup_field = 'slug'


class ReservationListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = (CanAccessReservations,)
    queryset = Reservation.objects.select_related('common_space', 'requested_by').all()

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if user.role in {User.Role.SUPERADMIN, User.Role.ADMIN}:
            return queryset

        return queryset.filter(requested_by=user)


class ReservationRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    permission_classes = (CanAccessReservations,)
    queryset = Reservation.objects.select_related('common_space', 'requested_by').all()

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if user.role in {User.Role.SUPERADMIN, User.Role.ADMIN}:
            return queryset

        return queryset.filter(requested_by=user)
