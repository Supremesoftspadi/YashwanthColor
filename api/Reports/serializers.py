from rest_framework import serializers


class SalesVsPaymentSerializer(serializers.Serializer):
    """
    Serializer for the sales vs payment report output.
    Matches the SELECT columns from salevsPaymentRegEmpNew procedure.
    """
    sl_no = serializers.SerializerMethodField()
    party_name = serializers.CharField(source='PaName')
    opening_balance = serializers.FloatField(source='Opening')
    sales = serializers.FloatField(source='Sales')
    total = serializers.FloatField(source='Total')
    payment = serializers.FloatField(source='Payment')
    balance = serializers.FloatField(source='Balance')

    def get_sl_no(self, obj):
        # Auto-increment serial number using context index
        index = self.context.get('index', {})
        paname = obj.get('PaName', '')
        return index.get(paname, '')

    def to_representation(self, instance):
        # instance is a dict from raw SQL result
        return {
            'sl_no': '',
            'party_name': instance.get('PaName', ''),
            'opening_balance': instance.get('Opening', 0.0),
            'sales': instance.get('Sales', 0.0),
            'total': instance.get('Total', 0.0),
            'payment': instance.get('Payment', 0.0),
            'balance': instance.get('Balance', 0.0),
        }


class SalesVsPaymentRequestSerializer(serializers.Serializer):
    """
    Serializer to validate input parameters for the report.
    """
    from_date = serializers.DateField(
        input_formats=['%Y-%m-%d', '%d-%m-%Y', '%d/%m/%Y'],
        help_text="Start date (YYYY-MM-DD)"
    )
    to_date = serializers.DateField(
        input_formats=['%Y-%m-%d', '%d-%m-%Y', '%d/%m/%Y'],
        help_text="End date (YYYY-MM-DD)"
    )
    emp_no = serializers.IntegerField(
        min_value=1,
        help_text="Employee number"
    )

    def validate(self, data):
        if data['from_date'] > data['to_date']:
            raise serializers.ValidationError(
                {"to_date": "To date must be greater than or equal to From date."}
            )
        return data


class SalesVsPaymentResponseSerializer(serializers.Serializer):
    """
    Wrapper serializer for the full API response.
    """
    success = serializers.BooleanField()
    emp_no = serializers.IntegerField()
    from_date = serializers.DateField()
    to_date = serializers.DateField()
    total_records = serializers.IntegerField()
    data = SalesVsPaymentSerializer(many=True)
