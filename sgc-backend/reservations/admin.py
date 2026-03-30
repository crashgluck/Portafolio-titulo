from django.contrib import admin

from .models import CommonSpace, Reservation


@admin.register(CommonSpace)
class CommonSpaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'space_type', 'capacity', 'is_active')
    list_filter = ('space_type', 'is_active')
    search_fields = ('name', 'slug')
    ordering = ('name',)


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        'common_space',
        'requester_name',
        'requester_role',
        'reservation_date',
        'start_time',
        'end_time',
        'status',
    )
    list_filter = ('common_space', 'requester_role', 'status', 'reservation_date')
    search_fields = ('requester_name', 'notes')
    ordering = ('-reservation_date', '-start_time')
