import json
import logging
from django.db.models import Q
from rest_framework.views import APIView # type: ignore
from rest_framework import status # type: ignore
from .models import Expense, Category, PaymentMode
from .serializers import ExpenseSerializer,CategorySerializer,PaymentModeSerializer
from django.shortcuts import get_object_or_404
from .createResponse import create_response
from rest_framework.exceptions import ValidationError # type: ignore
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from django.http import Http404
from .permission import JWTAuthentication # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework.exceptions import APIException # type: ignore
from django.core.paginator import Paginator

logger = logging.getLogger(__name__)

#  allexpense GET
class GetAllExpenseView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request, *args, **kwargs):
        try:
            user = request.user.id
            expenses = Expense.objects.filter(user_id=user,deleted=False).select_related('category', 'payment_mode')
            data = list(expenses.values('id', 'type', 'date', 'time', 'category__name', 'amount', 'description', 'payment_mode__mode'))
            paginator=Paginator(data,5)
            page_number=request.GET.get('page')
            page_obj=paginator.get_page(page_number)
            response_data = {
                'expenses': list(page_obj),
                'num_pages': paginator.num_pages,
                'current_page': page_obj.number,
                'has_previous': page_obj.has_previous(),
                'has_next': page_obj.has_next(),
            }
            return create_response(status.HTTP_200_OK,'List of expenses retrieved successfully!',response_data)
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except (ObjectDoesNotExist, Http404):
            return create_response(status.HTTP_404_NOT_FOUND, 'Expenses not found.')
        except Exception:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR,'An error occurred while retrieving expenses.')


#  getexpenseById GET
class GetExpenseById(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            user = request.user.id
            _id = request.GET.get('id')
            if _id is None:
                raise Http404('Expense with the id is not given')
            expense = Expense.objects.filter(user_id=user,deleted=False,pk=_id).select_related('category', 'payment_mode')
            data = list(expense.values('id', 'type', 'date', 'time', 'category__name', 'amount', 'description', 'payment_mode__mode'))
            return create_response(status.HTTP_200_OK,'List of expenses by ID retrieved successfully!',data)
        except (ObjectDoesNotExist, Http404) as e:
            return create_response(status.HTTP_404_NOT_FOUND, f'Expenses not found {e}')
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR,f'An error occurred :{e}')


#  add POST
class AddExpensesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            if isinstance(data, list): 
                for item in data:
                    item['user'] = request.user.id
            else: 
                data['user'] = request.user.id
            serializer = ExpenseSerializer(data=data, many=True if isinstance(data, list) else False)
            if serializer.is_valid():
                serializer.save()
                return create_response(status.HTTP_201_CREATED, 'Expenses added successfully')
            else:
                return create_response(status.HTTP_400_BAD_REQUEST, 'Validation error', serializer.errors)
        except ValidationError as ve:
            return create_response(status.HTTP_400_BAD_REQUEST, f'Validation error: {ve}')
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except ObjectDoesNotExist as oe:
            return create_response(status.HTTP_404_NOT_FOUND, f'Object not found: {oe}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Failed to add expenses: {e}')


#  edit | delete PUT DELETE
class EditExpenseView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def delete(self, request, *args, **kwargs):
        _id = request.GET.get('id')
        if _id is None:
            raise Http404('Expense with the id is not given')
        try:
            expense = get_object_or_404(Expense, pk=_id,deleted=False)
            expense.deleted = True
            expense.save()
            return create_response(status.HTTP_204_NO_CONTENT,'List of Expenses deleted retrieved successfully!')
        except ObjectDoesNotExist:
            return create_response(status.HTTP_404_NOT_FOUND, 'Expense not found.')
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'An error occurred: {e}')
        
    def put(self, request, *args, **kwargs):
        try:
            _id = request.GET.get('id')
            if _id is None:
                raise Http404('Expense with the id is not given')
            expense = get_object_or_404(Expense, pk=_id,deleted=False)
            serializer = ExpenseSerializer(expense, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return create_response(status.HTTP_200_OK, 'Expense updated successfully!', serializer.data)
            else:
                return create_response(status.HTTP_400_BAD_REQUEST, 'Validation error', serializer.errors)
        except ValidationError as ve:
            return create_response(status.HTTP_400_BAD_REQUEST, f'Validation error: {ve}')
        except ObjectDoesNotExist:
            return create_response(status.HTTP_404_NOT_FOUND, 'Expense not found.')
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'An error occurred: {e}')
        

#  search GET
class GetBySearchView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            user = request.user.id
            
            get_category_list= request.GET.get('category_list', '[]')
            try:
                category_list = json.loads(get_category_list)
            except json.JSONDecodeError:
                return create_response(status.HTTP_400_BAD_REQUEST, 'Invalid JSON format for category_list')
            
            get_payment_mode_list= request.GET.get('payment_mode_list', '[]')
            try:
                payment_mode_list = json.loads(get_payment_mode_list)
            except json.JSONDecodeError:
                return create_response(status.HTTP_400_BAD_REQUEST, 'Invalid JSON format for payment_mode_list')
            search = request.GET.get('search', '').strip() 
            expense_type = request.GET.get('type', '').strip()
            amount_min = request.GET.get('amount_min', '').strip()
            amount_max = request.GET.get('amount_max', '').strip()
            date_from = request.GET.get('date_from', '').strip()
            date_to = request.GET.get('date_to', '').strip()

            sort_by_date = request.GET.get('sort_by_date', '')
            sort_by_amount = request.GET.get('sort_by_amount', '')

            query = Q(deleted=False,user_id=user)

            if category_list:
                query &= Q(category__name__in=category_list)
            if payment_mode_list:
                query &= Q(payment_mode__mode__in=payment_mode_list)
            if search:
                query &= (
                    Q(category__name__icontains=search) |
                    Q(payment_mode__mode__icontains=search) |
                    Q(description__icontains=search)
                )
            if expense_type:
                query &= Q(type__iexact=expense_type)
            if amount_min:
                query &= Q(amount__gte=amount_min)
            if amount_max:
                query &= Q(amount__lte=amount_max)
            if date_from:
                query &= Q(date__gte=date_from)
            if date_to:
                query &= Q(date__lte=date_to)

            expenses = Expense.objects.filter(query).select_related('category', 'payment_mode')

            if sort_by_date:
                expenses = expenses.order_by('-date' if sort_by_date == 'desc' else 'date')
            if sort_by_amount:
                expenses = expenses.order_by('-amount' if sort_by_amount == 'desc' else 'amount')

            data = list(expenses.values('id', 'type', 'date', 'time', 'category__name', 'amount', 'description', 'payment_mode__mode'))
            paginator=Paginator(data,5)
            page_number=request.GET.get('page')
            page_obj=paginator.get_page(page_number)
            response_data = {
                'expenses': list(page_obj),
                'num_pages': paginator.num_pages,
                'current_page': page_obj.number,
                'has_previous': page_obj.has_previous(),
                'has_next': page_obj.has_next(),
            }
            return create_response(status.HTTP_200_OK,'List of expenses retrieved successfully by search!',response_data)
        
        except ValidationError as ve:
            return create_response(status.HTTP_400_BAD_REQUEST, f'Validation error: {ve}')
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except ValueError as ve:
            return create_response(status.HTTP_400_BAD_REQUEST, f'Value error: {ve}')
        except Exception:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR,'An error occurred while retrieving expenses by search.')


# categories GET
class GetAllCategoriesView(APIView):
    def get(self,request, *args, **kwargs):
        try:
            categories = Category.objects.filter(deleted=False)
            data = list(categories.values('id', 'name'))
            return create_response(status.HTTP_200_OK,'List of Categories retrieved successfully!',data)
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except ObjectDoesNotExist:
            return create_response(status.HTTP_404_NOT_FOUND, 'Categories not found.')
        except Exception:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR,'An error occurred while retrieving Categories.')


#  PaymentMode GET
class GetAllPaymentModesView(APIView):
    def get(self,request, *args, **kwargs):
        try:
            payment_modes = PaymentMode.objects.filter(deleted=False)
            data = list(payment_modes.values('id', 'mode'))
            return create_response(status.HTTP_200_OK,'List of Payment Modes retrieved successfully!',data)
        except DatabaseError as de:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Database error: {de}')
        except ObjectDoesNotExist:
            return create_response(status.HTTP_404_NOT_FOUND, 'Payment Modes not found.')
        except Exception:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR,'An error occurred while retrieving Payment Modes.')


# add categories POST
class AddCategoryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            category_name = data.get('name')
            
            if Category.objects.filter(name=category_name).exists():
                return  create_response(status.HTTP_400_BAD_REQUEST, 'Category with this name already exists.')
            serializer = CategorySerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return create_response(status.HTTP_201_CREATED,'Category created successfully')
        except ValidationError as ve:
            return create_response(status.HTTP_400_BAD_REQUEST,f'Validation error: {ve.detail}')
        except APIException as ae:
            return create_response(status.HTTP_400_BAD_REQUEST, f'API exception: {str(ae)}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'An error occurred: {e}')


#  add PaymentMode POST
class AddPaymentModeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            payment_mode = data.get('mode')
            
            if PaymentMode.objects.filter(mode=payment_mode).exists():
                return  create_response(status.HTTP_400_BAD_REQUEST, 'Payment Mode  already exists.')
            serializer = PaymentModeSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return create_response(status.HTTP_201_CREATED,'Payment Mode created successfully')
        except ValidationError as ve:
            return create_response(status.HTTP_400_BAD_REQUEST,f'Validation error: {ve.detail}')
        except APIException as ae:
            return create_response(status.HTTP_400_BAD_REQUEST, f'API exception: {str(ae)}')
        except Exception as e:
            return create_response(status.HTTP_500_INTERNAL_SERVER_ERROR, f'An error occurred: {e}')