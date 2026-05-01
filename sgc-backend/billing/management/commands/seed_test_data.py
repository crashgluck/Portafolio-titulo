from datetime import date, time
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from billing.models import (
    BillingPeriod,
    CommonExpense,
    CommonSpace,
    Condominium,
    Payment,
    Reservation as BillingReservation,
    ResidentAssignment,
    Unit,
)
from reservations.models import CommonSpace as LegacyCommonSpace
from reservations.models import Reservation as LegacyReservation
from users.models import User


DEFAULT_PASSWORD = "SgcSecure2026!"


class Command(BaseCommand):
    help = "Genera datos de prueba para usuarios, gastos comunes y reservas."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Borra los datos semilla antes de volver a crearlos.",
        )
        parser.add_argument(
            "--password",
            default=DEFAULT_PASSWORD,
            help=f"Contrasena comun para usuarios seed (default: {DEFAULT_PASSWORD}).",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        password = options["password"]

        if options["reset"]:
            self._reset_seed_data()
            self.stdout.write(self.style.WARNING("Datos previos de seed eliminados."))

        users = self._seed_users(password=password)
        legacy_data = self._seed_legacy_reservations(users=users)
        billing_data = self._seed_billing(users=users)

        self.stdout.write(self.style.SUCCESS("Seed completado correctamente."))
        self.stdout.write(f"Usuarios creados/actualizados: {len(users)}")
        self.stdout.write(f"Reservas legacy creadas/actualizadas: {legacy_data['reservations_count']}")
        self.stdout.write(f"Condominios activos seed: {billing_data['condominiums_count']}")
        self.stdout.write(f"Reservas billing creadas/actualizadas: {billing_data['reservations_count']}")
        self.stdout.write(f"Contrasena comun: {password}")

    def _seed_users(self, password):
        users_seed = [
            {
                "email": "superadmin@sgc.cl",
                "rut": "11.111.111-1",
                "first_name": "Sofia",
                "last_name": "Superadmin",
                "role": User.Role.SUPERADMIN,
                "is_staff": True,
                "is_superuser": True,
            },
            {
                "email": "admin@sgc.cl",
                "rut": "22.222.222-2",
                "first_name": "Adrian",
                "last_name": "Admin",
                "role": User.Role.ADMIN,
            },
            {
                "email": "conserje@sgc.cl",
                "rut": "33.333.333-3",
                "first_name": "Camila",
                "last_name": "Conserje",
                "role": User.Role.CONSERJE,
            },
            {
                "email": "residente1@sgc.cl",
                "rut": "44.444.444-4",
                "first_name": "Ricardo",
                "last_name": "Residente",
                "role": User.Role.RESIDENTE,
            },
            {
                "email": "residente2@sgc.cl",
                "rut": "55.555.555-5",
                "first_name": "Rebeca",
                "last_name": "Residente",
                "role": User.Role.RESIDENTE,
            },
            {
                "email": "residente3@sgc.cl",
                "rut": "66.666.666-6",
                "first_name": "Rafael",
                "last_name": "Residente",
                "role": User.Role.RESIDENTE,
            },
        ]

        users = {}
        for payload in users_seed:
            email = payload["email"]
            defaults = payload.copy()
            defaults.pop("email")

            user, _ = User.objects.update_or_create(
                email=email,
                defaults=defaults,
            )
            user.set_password(password)
            user.save(update_fields=["password"])
            users[email] = user

        return users

    def _seed_legacy_reservations(self, users):
        pool, _ = LegacyCommonSpace.objects.update_or_create(
            code=LegacyCommonSpace.Code.POOL,
            defaults={"name": "Piscina", "capacity": 12, "is_active": True},
        )
        multi_use_room, _ = LegacyCommonSpace.objects.update_or_create(
            code=LegacyCommonSpace.Code.MULTI_USE_ROOM,
            defaults={"name": "Sala Multiuso", "capacity": 25, "is_active": True},
        )
        gym, _ = LegacyCommonSpace.objects.update_or_create(
            code=LegacyCommonSpace.Code.GYM,
            defaults={"name": "Gimnasio", "capacity": 15, "is_active": True},
        )

        reservations_seed = [
            {
                "common_space": pool,
                "requester": users["residente1@sgc.cl"],
                "requester_name": "Ricardo Residente",
                "requester_role": User.Role.RESIDENTE,
                "reservation_date": date(2026, 4, 24),
                "start_time": time(18, 0),
                "end_time": time(20, 0),
                "status": LegacyReservation.Status.PENDING,
                "notes": "Cumpleanos familiar",
                "extra_data": {"guestCount": 8},
            },
            {
                "common_space": multi_use_room,
                "requester": users["residente2@sgc.cl"],
                "requester_name": "Rebeca Residente",
                "requester_role": User.Role.RESIDENTE,
                "reservation_date": date(2026, 4, 26),
                "start_time": time(15, 0),
                "end_time": time(17, 0),
                "status": LegacyReservation.Status.APPROVED,
                "notes": "Reunion de comite",
                "extra_data": {"requiresProjector": True},
            },
            {
                "common_space": gym,
                "requester": users["residente3@sgc.cl"],
                "requester_name": "Rafael Residente",
                "requester_role": User.Role.RESIDENTE,
                "reservation_date": date(2026, 4, 27),
                "start_time": time(7, 0),
                "end_time": time(8, 0),
                "status": LegacyReservation.Status.REJECTED,
                "notes": "Mantenimiento preventivo",
                "extra_data": {"reason": "Horario bloqueado"},
            },
        ]

        for payload in reservations_seed:
            LegacyReservation.objects.update_or_create(
                common_space=payload["common_space"],
                requester=payload["requester"],
                reservation_date=payload["reservation_date"],
                start_time=payload["start_time"],
                defaults=payload,
            )

        return {"reservations_count": len(reservations_seed)}

    def _seed_billing(self, users):
        condo_central, _ = Condominium.objects.update_or_create(
            name="Condominio Central",
            defaults={
                "address": "Av. Providencia 1000",
                "city": "Santiago",
                "is_active": True,
            },
        )
        condo_oriente, _ = Condominium.objects.update_or_create(
            name="Condominio Oriente",
            defaults={
                "address": "Av. Apoquindo 3500",
                "city": "Santiago",
                "is_active": True,
            },
        )

        unit_101, _ = Unit.objects.update_or_create(
            condominium=condo_central,
            number="101",
            defaults={"floor": 1, "proration_factor": Decimal("1.0000"), "is_active": True},
        )
        unit_102, _ = Unit.objects.update_or_create(
            condominium=condo_central,
            number="102",
            defaults={"floor": 1, "proration_factor": Decimal("1.1000"), "is_active": True},
        )
        unit_801, _ = Unit.objects.update_or_create(
            condominium=condo_oriente,
            number="801",
            defaults={"floor": 8, "proration_factor": Decimal("1.3000"), "is_active": True},
        )

        ResidentAssignment.objects.update_or_create(
            user=users["residente1@sgc.cl"],
            unit=unit_101,
            start_date=date(2026, 1, 1),
            defaults={
                "is_owner": True,
                "is_primary": True,
                "is_active": True,
                "end_date": None,
            },
        )
        ResidentAssignment.objects.update_or_create(
            user=users["residente2@sgc.cl"],
            unit=unit_102,
            start_date=date(2026, 1, 1),
            defaults={
                "is_owner": False,
                "is_primary": True,
                "is_active": True,
                "end_date": None,
            },
        )
        ResidentAssignment.objects.update_or_create(
            user=users["residente3@sgc.cl"],
            unit=unit_801,
            start_date=date(2026, 2, 1),
            defaults={
                "is_owner": True,
                "is_primary": True,
                "is_active": True,
                "end_date": None,
            },
        )

        period_april, _ = BillingPeriod.objects.update_or_create(
            condominium=condo_central,
            start_date=date(2026, 4, 1),
            end_date=date(2026, 4, 30),
            defaults={"status": BillingPeriod.Status.GENERATED, "close_date": date(2026, 5, 3)},
        )
        period_may, _ = BillingPeriod.objects.update_or_create(
            condominium=condo_oriente,
            start_date=date(2026, 5, 1),
            end_date=date(2026, 5, 31),
            defaults={"status": BillingPeriod.Status.OPEN, "close_date": None},
        )

        CommonExpense.objects.update_or_create(
            period=period_april,
            unit=unit_101,
            defaults={
                "fixed_amount": Decimal("85000.00"),
                "variable_amount": Decimal("12000.00"),
                "status": CommonExpense.Status.PENDING,
                "generated_at": timezone.localdate(),
            },
        )
        CommonExpense.objects.update_or_create(
            period=period_april,
            unit=unit_102,
            defaults={
                "fixed_amount": Decimal("92000.00"),
                "variable_amount": Decimal("15000.00"),
                "status": CommonExpense.Status.PARTIAL,
                "generated_at": timezone.localdate(),
            },
        )
        CommonExpense.objects.update_or_create(
            period=period_may,
            unit=unit_801,
            defaults={
                "fixed_amount": Decimal("110000.00"),
                "variable_amount": Decimal("8000.00"),
                "status": CommonExpense.Status.PAID,
                "generated_at": timezone.localdate(),
            },
        )

        Payment.objects.update_or_create(
            unit=unit_102,
            period=period_april,
            amount=Decimal("50000.00"),
            payment_date=date(2026, 4, 20),
            defaults={
                "payment_method": Payment.Method.TRANSFER,
                "status": Payment.Status.PENDING,
                "validation_date": None,
            },
        )
        Payment.objects.update_or_create(
            unit=unit_801,
            period=period_may,
            amount=Decimal("118000.00"),
            payment_date=date(2026, 5, 18),
            defaults={
                "payment_method": Payment.Method.CARD,
                "status": Payment.Status.APPROVED,
                "validation_date": date(2026, 5, 19),
            },
        )

        quincho_a, _ = CommonSpace.objects.update_or_create(
            condominium=condo_central,
            name="Quincho A",
            defaults={"space_type": "quincho", "block_duration": 60, "is_active": True},
        )
        sala_multiuso, _ = CommonSpace.objects.update_or_create(
            condominium=condo_oriente,
            name="Sala Multiuso",
            defaults={"space_type": "sala", "block_duration": 60, "is_active": True},
        )

        billing_reservations_seed = [
            {
                "common_space": quincho_a,
                "user": users["residente1@sgc.cl"],
                "reservation_date": date(2026, 5, 3),
                "start_time": time(20, 0),
                "end_time": time(22, 0),
                "status": BillingReservation.Status.PENDING,
            },
            {
                "common_space": sala_multiuso,
                "user": users["residente3@sgc.cl"],
                "reservation_date": date(2026, 5, 5),
                "start_time": time(10, 0),
                "end_time": time(12, 0),
                "status": BillingReservation.Status.APPROVED,
            },
        ]

        for payload in billing_reservations_seed:
            BillingReservation.objects.update_or_create(
                common_space=payload["common_space"],
                user=payload["user"],
                reservation_date=payload["reservation_date"],
                start_time=payload["start_time"],
                defaults=payload,
            )

        return {
            "condominiums_count": 2,
            "reservations_count": len(billing_reservations_seed),
        }

    def _reset_seed_data(self):
        billing_emails = [
            "superadmin@sgc.cl",
            "admin@sgc.cl",
            "conserje@sgc.cl",
            "residente1@sgc.cl",
            "residente2@sgc.cl",
            "residente3@sgc.cl",
        ]

        BillingReservation.objects.filter(user__email__in=billing_emails).delete()
        LegacyReservation.objects.filter(requester__email__in=billing_emails).delete()
        Payment.objects.filter(unit__number__in=["101", "102", "801"]).delete()
        CommonExpense.objects.filter(unit__number__in=["101", "102", "801"]).delete()
        ResidentAssignment.objects.filter(user__email__in=billing_emails).delete()
        Unit.objects.filter(number__in=["101", "102", "801"]).delete()
        BillingPeriod.objects.filter(
            start_date__in=[date(2026, 4, 1), date(2026, 5, 1)],
            end_date__in=[date(2026, 4, 30), date(2026, 5, 31)],
        ).delete()
        CommonSpace.objects.filter(name__in=["Quincho A", "Sala Multiuso"]).delete()
        Condominium.objects.filter(name__in=["Condominio Central", "Condominio Oriente"]).delete()
        LegacyCommonSpace.objects.filter(code__in=[LegacyCommonSpace.Code.POOL, LegacyCommonSpace.Code.MULTI_USE_ROOM, LegacyCommonSpace.Code.GYM]).delete()
        User.objects.filter(email__in=billing_emails).delete()
