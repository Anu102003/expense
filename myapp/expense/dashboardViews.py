from django.db.models import Case, When, Q, Sum, Sum, F,DecimalField
from rest_framework.views import APIView # type: ignore
from rest_framework import status # type: ignore
from .models import Expense
from django.db.models.functions import TruncMonth
from decimal import Decimal
from .createResponse import create_response
from django.db import DatabaseError
from django.core.exceptions import ValidationError
from .permission import JWTAuthentication # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore

class GetDemo(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            user = request.user.id
            date_from = request.GET.get("date_from", "").strip()
            date_to = request.GET.get("date_to", "").strip()
            query = Q(deleted=False,user_id=user)
            if date_from:
                query &= Q(date__gte=date_from)
            if date_to:
                query &= Q(date__lte=date_to)


            # Aggregate income ,expense, balance, total count
            totals = Expense.objects.filter(query).aggregate(
                total_income=Sum(Case(When(type='income', then='amount'), default=0, output_field=DecimalField())),
                total_expense=Sum(Case(When(type='expense', then='amount'), default=0, output_field=DecimalField()))
            )
            income = totals['total_income'] or Decimal('0')
            expense = totals['total_expense'] or Decimal('0')
            transaction = Expense.objects.filter(query).count()


            # Get category sums of income and expense
            category_sums = Expense.objects.filter(query).values("category__name", "type").annotate(
                total=Sum("amount", output_field=DecimalField())
            )

            category_data = {
                "income": {"categories": [], "totals": [], "percentages": []},
                "expense": {"categories": [], "totals": [], "percentages": []},
            }

            for category in category_sums:
                category_name = category["category__name"]
                category_total = category["total"]
                category_type = category["type"]

                if category_type in category_data:
                    total_amount = income if category_type == "income" else expense
                    category_percentage = (category_total / total_amount * Decimal('100')) if total_amount > 0 else Decimal('0')
                    formatted_percentage = round(category_percentage, 2)

                    category_data[category_type]["categories"].append(category_name)
                    category_data[category_type]["totals"].append(int(category_total))
                    category_data[category_type]["percentages"].append(float(formatted_percentage))


            # Get latest expenses
            latest_expenses = list(
                Expense.objects.filter(query)
                .select_related("category", "payment_mode")
                .order_by("-date")[:5]
                .values(
                   "type", "date", "time", "category__name", "amount", "description", "payment_mode__mode"
                )
            )
            for e in latest_expenses:
                e["amount"] = int(e["amount"])


            # Calculate monthly balances
            monthly_balances = Expense.objects.filter(query).annotate(month=TruncMonth('date')).values('month').annotate(
                total_income=Sum(Case(When(type='income', then=F('amount')), default=0, output_field=DecimalField())),
                total_expense=Sum(Case(When(type='expense', then=F('amount')), default=0, output_field=DecimalField())),
            ).order_by('month')

            months = []
            incomes = []
            expenses = []
            balances = []

            for month_balance in monthly_balances:
                month_str = month_balance['month'].month
                months.append(month_str)
                income_total = month_balance['total_income']
                expense_total = month_balance['total_expense']
                balance = income_total - expense_total
                incomes.append(income_total)
                expenses.append(expense_total)
                balances.append(balance)

            response={
                    "income": int(income),
                    "expense": int(expense),
                    "balance": int(income - expense),
                    "transaction": transaction,
                    "type":category_data,
                    "data": latest_expenses,
                    "monthly_balances": {
                        "month": months,
                         "balance": [int(b) for b in balances],
                    },
                    "monthly_income_expense": {
                        "month": months,
                        "income": [int(i) for i in incomes],
                        "expense": [int(e) for e in expenses],
                    },
                }
            return create_response(status.HTTP_200_OK,'List of dashboard retrieved successfully !',response)
        except ValidationError as ve:
            return create_response(status.HTTP_400_BAD_REQUEST, f'Validation error: {ve}')
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR,f'An error occurred while retrieving dashboard :{e}')
        
