from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    SalesVsPaymentRequestSerializer,
    SalesVsPaymentSerializer,
)


def execute_sales_vs_payment_proc(from_date, to_date, emp_no):
    """
    Executes the salevsPaymentRegEmpNew stored procedure and returns results.

    Args:
        from_date (date): Start date
        to_date  (date): End date
        emp_no   (int):  Employee number

    Returns:
        list[dict]: Each dict has keys matching the procedure's SELECT columns.
    """
    with connection.cursor() as cursor:
        cursor.execute(
            "EXEC [dbo].[salevsPaymentRegEmpNew] @FDate=%s, @ToDate=%s, @Empno=%s",
            [from_date, to_date, emp_no]
        )
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()

    # Map column names to row values
    # Procedure returns: SL.No, PARTY NAME, OPENING BALANCE, SALES, TOTAL, PAYMENT, BALANCE
    column_map = {
        'SL.No':           'SLNo',
        'PARTY NAME':      'PaName',
        'OPENING BALANCE': 'Opening',
        'SALES':           'Sales',
        'TOTAL':           'Total',
        'PAYMENT':         'Payment',
        'BALANCE':         'Balance',
    }

    results = []
    for row in rows:
        row_dict = dict(zip(columns, row))
        # Rename keys to match serializer expectations
        normalized = {
            column_map.get(k, k): (v if v is not None else 0.0)
            for k, v in row_dict.items()
        }
        results.append(normalized)

    return results


class SalesVsPaymentReportView(APIView):
    """
    GET /api/sales-vs-payment/?from_date=2019-04-01&to_date=2019-08-09&emp_no=13

    Returns party-wise sales vs payment summary for a given employee
    and date range by calling the salevsPaymentRegEmpNew stored procedure.
    """

    def get(self, request):
        # 1. Validate query parameters
        request_serializer = SalesVsPaymentRequestSerializer(
            data=request.query_params
        )
        if not request_serializer.is_valid():
            return Response(
                {"success": False, "errors": request_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        validated = request_serializer.validated_data
        from_date = validated['from_date']
        to_date   = validated['to_date']
        emp_no    = validated['emp_no']

        # 2. Execute stored procedure
        try:
            results = execute_sales_vs_payment_proc(from_date, to_date, emp_no)
        except Exception as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # 3. Serialize results
        serializer = SalesVsPaymentSerializer(results, many=True)

        return Response(
            {
                "success": True,
                "emp_no": emp_no,
                "from_date": str(from_date),
                "to_date": str(to_date),
                "total_records": len(results),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        """
        POST /api/sales-vs-payment/
        Body: { "from_date": "2019-04-01", "to_date": "2019-08-09", "emp_no": 13 }
        """
        request_serializer = SalesVsPaymentRequestSerializer(data=request.data)
        if not request_serializer.is_valid():
            return Response(
                {"success": False, "errors": request_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        validated = request_serializer.validated_data
        from_date = validated['from_date']
        to_date   = validated['to_date']
        emp_no    = validated['emp_no']

        try:
            results = execute_sales_vs_payment_proc(from_date, to_date, emp_no)
        except Exception as exc:
            return Response(
                {"success": False, "error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        serializer = SalesVsPaymentSerializer(results, many=True)

        return Response(
            {
                "success": True,
                "emp_no": emp_no,
                "from_date": str(from_date),
                "to_date": str(to_date),
                "total_records": len(results),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
