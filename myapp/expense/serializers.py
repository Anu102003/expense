from .models import Expense, Category, PaymentMode,User
from rest_framework.serializers import ModelSerializer # type: ignore
from rest_framework import serializers # type: ignore


class UserSerializer(ModelSerializer):
    class Meta:
        model=User
        fields=['id','first_name','last_name','email','password']
        extra_kwargs={
            'password':{'write_only':True}
        }
    
    def create(self,validated_data):
        password=validated_data.pop('password',None)
        instance=self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    payment_mode = serializers.PrimaryKeyRelatedField(queryset=PaymentMode.objects.all())

    class Meta:
        model = Expense
        fields = ['type', 'date', 'time', 'category', 'amount', 'description', 'payment_mode','user']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

class PaymentModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMode
        fields = ['mode']