import pytest
from rest_framework.test import APIClient

from reservations.models import CommonSpace, Reservation
from users.models import User


@pytest.mark.django_db
def test_superadmin_can_create_and_list_reservations():
    client = APIClient()
    superadmin = User.objects.create_user(email='root@sgc.cl', password='SgcSecure2026!', role=User.Role.SUPERADMIN)
    space = CommonSpace.objects.get(slug='pool')

    client.force_authenticate(user=superadmin)
    create_response = client.post(
        '/api/v1/reservations/',
        {
            'common_space': space.slug,
            'requester_name': 'Daniela Soto',
            'requester_role': User.Role.RESIDENTE,
            'reservation_date': '2026-04-10',
            'start_time': '15:00:00',
            'end_time': '17:00:00',
            'status': Reservation.Status.PENDING,
            'notes': 'Reserva de prueba',
            'extra_data': {'guestCount': 4, 'poolSlot': 'afternoon'},
        },
        format='json',
    )

    list_response = client.get('/api/v1/reservations/')

    assert create_response.status_code == 201
    assert list_response.status_code == 200
    assert len(list_response.data) == 1
    assert list_response.data[0]['common_space'] == 'pool'


@pytest.mark.django_db
def test_resident_only_sees_own_reservations():
    client = APIClient()
    resident = User.objects.create_user(email='residente@sgc.cl', password='SgcSecure2026!', role=User.Role.RESIDENTE)
    other_resident = User.objects.create_user(email='otro@sgc.cl', password='SgcSecure2026!', role=User.Role.RESIDENTE)
    space = CommonSpace.objects.get(slug='gym')

    Reservation.objects.create(
        common_space=space,
        requested_by=resident,
        requester_name='Residente Uno',
        requester_role=resident.role,
        reservation_date='2026-04-12',
        start_time='08:00:00',
        end_time='09:00:00',
    )
    Reservation.objects.create(
        common_space=space,
        requested_by=other_resident,
        requester_name='Residente Dos',
        requester_role=other_resident.role,
        reservation_date='2026-04-12',
        start_time='09:00:00',
        end_time='10:00:00',
    )

    client.force_authenticate(user=resident)
    response = client.get('/api/v1/reservations/')

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]['requester_name'] == 'Residente Uno'


@pytest.mark.django_db
def test_cannot_create_overlapping_reservation_for_same_space():
    client = APIClient()
    admin = User.objects.create_user(email='admin@sgc.cl', password='SgcSecure2026!', role=User.Role.ADMIN)
    space = CommonSpace.objects.get(slug='multi_use_room')

    Reservation.objects.create(
        common_space=space,
        requested_by=admin,
        requester_name='Administrador',
        requester_role=admin.role,
        reservation_date='2026-04-15',
        start_time='18:00:00',
        end_time='20:00:00',
    )

    client.force_authenticate(user=admin)
    response = client.post(
        '/api/v1/reservations/',
        {
            'common_space': space.slug,
            'reservation_date': '2026-04-15',
            'start_time': '19:00:00',
            'end_time': '21:00:00',
            'status': Reservation.Status.PENDING,
            'notes': '',
            'extra_data': {'eventPurpose': 'Asamblea'},
        },
        format='json',
    )

    assert response.status_code == 400
