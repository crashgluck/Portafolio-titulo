from rest_framework.permissions import BasePermission, SAFE_METHODS

from users.models import User


class IsReservationManager(BasePermission):
    message = 'No tienes permisos para gestionar configuracion de reservas.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == User.Role.SUPERADMIN
        )


class CanAccessReservations(BasePermission):
    message = 'No tienes permisos para gestionar reservas.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in {User.Role.SUPERADMIN, User.Role.ADMIN, User.Role.RESIDENTE}
        )

    def has_object_permission(self, request, view, obj):
        if request.user.role in {User.Role.SUPERADMIN, User.Role.ADMIN}:
            return True

        return obj.requested_by_id == request.user.id


class CanReadCommonSpaces(BasePermission):
    message = 'No tienes permisos para acceder a espacios comunes.'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return request.user.role in {User.Role.SUPERADMIN, User.Role.ADMIN, User.Role.RESIDENTE}

        return request.user.role == User.Role.SUPERADMIN
