from django.urls import path
from .views import SalesVsPaymentReportView

app_name = 'sales_report'

urlpatterns = [
    path(
        'sales-vs-payment/',
        SalesVsPaymentReportView.as_view(),
        name='sales-vs-payment',
    ),
]
