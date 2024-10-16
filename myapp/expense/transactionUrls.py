from django.urls import re_path,path
from . import transactionViews

urlpatterns = [
    re_path('editExpense', transactionViews.EditExpenseView.as_view(), name='editExpense'),
    re_path('getExpenseById', transactionViews.GetExpenseById.as_view(), name='getexpenseById'),
    # re_path(r'getExpenseById/<int:pk>', transactionViews.GetExpenseById.as_view(), name='getexpenseById'),
    re_path('addExpenses', transactionViews.AddExpensesView.as_view(), name='addExpenses'),
    re_path('getCategories', transactionViews.GetAllCategoriesView.as_view(), name='getAllCategories'),
    re_path('getPaymentModes', transactionViews.GetAllPaymentModesView.as_view(), name='getAllPaymentModes'),
    re_path('search', transactionViews.GetBySearchView.as_view(), name='getBySearch'),
    re_path('getAllExpenses', transactionViews.GetAllExpenseView.as_view(), name='getAll'),
    re_path('addCategory', transactionViews.AddCategoryView.as_view(), name='addCategory'),
    re_path('addPaymentMode', transactionViews.AddPaymentModeView.as_view(), name='addPaymentMode'),
]

