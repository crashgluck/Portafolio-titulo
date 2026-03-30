from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def seed_common_spaces(apps, schema_editor):
    CommonSpace = apps.get_model('reservations', 'CommonSpace')

    spaces = [
        {
            'name': 'Piscina',
            'slug': 'pool',
            'space_type': 'pool',
            'description': 'Reserva por bloques para uso recreativo de residentes.',
            'capacity': 10,
            'reservation_rules': {
                'fields': ['guestCount', 'poolSlot'],
            },
        },
        {
            'name': 'Sala multiuso',
            'slug': 'multi_use_room',
            'space_type': 'multi_use_room',
            'description': 'Espacio para reuniones y actividades comunitarias.',
            'capacity': 40,
            'reservation_rules': {
                'fields': ['attendeeCount', 'eventPurpose', 'supportNotes'],
            },
        },
        {
            'name': 'Gimnasio',
            'slug': 'gym',
            'space_type': 'gym',
            'description': 'Reservas por bloques para entrenamiento en espacios compartidos.',
            'capacity': 8,
            'reservation_rules': {
                'fields': ['trainingType', 'participantCount'],
            },
        },
    ]

    for space in spaces:
        CommonSpace.objects.update_or_create(slug=space['slug'], defaults=space)


def unseed_common_spaces(apps, schema_editor):
    CommonSpace = apps.get_model('reservations', 'CommonSpace')
    CommonSpace.objects.filter(slug__in=['pool', 'multi_use_room', 'gym']).delete()


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CommonSpace',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('slug', models.SlugField(unique=True)),
                ('space_type', models.CharField(choices=[('pool', 'Piscina'), ('multi_use_room', 'Sala multiuso'), ('gym', 'Gimnasio')], max_length=30, unique=True)),
                ('description', models.TextField(blank=True)),
                ('capacity', models.PositiveIntegerField(default=1)),
                ('is_active', models.BooleanField(default=True)),
                ('reservation_rules', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('requester_name', models.CharField(max_length=150)),
                ('requester_role', models.CharField(max_length=20)),
                ('reservation_date', models.DateField()),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('status', models.CharField(choices=[('pending', 'Pendiente'), ('approved', 'Aprobada'), ('rejected', 'Rechazada')], default='pending', max_length=20)),
                ('notes', models.TextField(blank=True)),
                ('extra_data', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('common_space', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='reservations', to='reservations.commonspace')),
                ('requested_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reservations', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('reservation_date', 'start_time', '-id'),
            },
        ),
        migrations.RunPython(seed_common_spaces, unseed_common_spaces),
    ]
