from rest_framework import serializers

from .models import CommonSpace, Reservation


class CommonSpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonSpace
        fields = (
            'id',
            'name',
            'slug',
            'space_type',
            'description',
            'capacity',
            'is_active',
            'reservation_rules',
        )


class ReservationSerializer(serializers.ModelSerializer):
    common_space = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=CommonSpace.objects.filter(is_active=True),
    )
    common_space_label = serializers.CharField(source='common_space.name', read_only=True)

    class Meta:
        model = Reservation
        fields = (
            'id',
            'common_space',
            'common_space_label',
            'requester_name',
            'requester_role',
            'reservation_date',
            'start_time',
            'end_time',
            'status',
            'notes',
            'extra_data',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('created_at', 'updated_at')
        extra_kwargs = {
            'requester_name': {'required': False, 'allow_blank': True},
            'requester_role': {'required': False, 'allow_blank': True},
            'notes': {'required': False, 'allow_blank': True},
        }

    def validate(self, attrs):
        start_time = attrs.get('start_time', getattr(self.instance, 'start_time', None))
        end_time = attrs.get('end_time', getattr(self.instance, 'end_time', None))
        reservation_date = attrs.get('reservation_date', getattr(self.instance, 'reservation_date', None))
        common_space = attrs.get('common_space', getattr(self.instance, 'common_space', None))

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError({'end_time': 'La hora de termino debe ser mayor que la hora de inicio.'})

        if common_space and reservation_date and start_time and end_time:
            overlapping_reservations = Reservation.objects.filter(
                common_space=common_space,
                reservation_date=reservation_date,
                start_time__lt=end_time,
                end_time__gt=start_time,
            )

            if self.instance:
                overlapping_reservations = overlapping_reservations.exclude(pk=self.instance.pk)

            if overlapping_reservations.exists():
                raise serializers.ValidationError('Ya existe una reserva en ese rango horario para el espacio comun seleccionado.')

        return attrs

    def create(self, validated_data):
        request = self.context['request']
        user = request.user

        validated_data.setdefault('requester_name', self._build_requester_name(user))
        validated_data.setdefault('requester_role', user.role)
        validated_data.setdefault('requested_by', user)

        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context['request']
        user = request.user

        if not validated_data.get('requester_name'):
            validated_data['requester_name'] = self._build_requester_name(user)

        if not validated_data.get('requester_role'):
            validated_data['requester_role'] = instance.requester_role or user.role

        if not instance.requested_by_id:
            validated_data['requested_by'] = user

        return super().update(instance, validated_data)

    @staticmethod
    def _build_requester_name(user):
        full_name = f'{user.first_name} {user.last_name}'.strip()
        return full_name or user.email
