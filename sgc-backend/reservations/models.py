from django.conf import settings
from django.db import models


class CommonSpace(models.Model):
    class SpaceType(models.TextChoices):
        POOL = 'pool', 'Piscina'
        MULTI_USE_ROOM = 'multi_use_room', 'Sala multiuso'
        GYM = 'gym', 'Gimnasio'

    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    space_type = models.CharField(max_length=30, choices=SpaceType.choices, unique=True)
    description = models.TextField(blank=True)
    capacity = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    reservation_rules = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name


class Reservation(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pendiente'
        APPROVED = 'approved', 'Aprobada'
        REJECTED = 'rejected', 'Rechazada'

    common_space = models.ForeignKey(
        CommonSpace,
        on_delete=models.PROTECT,
        related_name='reservations',
    )
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reservations',
    )
    requester_name = models.CharField(max_length=150)
    requester_role = models.CharField(max_length=20)
    reservation_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    notes = models.TextField(blank=True)
    extra_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('reservation_date', 'start_time', '-id')

    def __str__(self):
        return f'{self.common_space.name} - {self.reservation_date} {self.start_time}'
