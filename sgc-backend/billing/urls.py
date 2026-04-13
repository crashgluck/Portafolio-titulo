from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BillingPeriodViewSet,
    CommonExpenseViewSet,
    CommonSpaceViewSet,
    CondominiumViewSet,
    PaymentReceiptViewSet,
    PaymentViewSet,
    ReservationViewSet,
    ResidentAssignmentViewSet,
    UnitViewSet,
)

router = DefaultRouter()
router.register('condominiums', CondominiumViewSet, basename='billing-condominiums')
router.register('units', UnitViewSet, basename='billing-units')
router.register('resident-assignments', ResidentAssignmentViewSet, basename='billing-resident-assignments')
router.register('billing-periods', BillingPeriodViewSet, basename='billing-periods')
router.register('common-expenses', CommonExpenseViewSet, basename='billing-common-expenses')
router.register('payments', PaymentViewSet, basename='billing-payments')
router.register('payment-receipts', PaymentReceiptViewSet, basename='billing-payment-receipts')
router.register('common-spaces', CommonSpaceViewSet, basename='billing-common-spaces')
router.register('reservations', ReservationViewSet, basename='billing-reservations')

urlpatterns = [
    path('', include(router.urls)),
]
