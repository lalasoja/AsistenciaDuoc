from rest_framework import serializers

from .models import CustomUser

from drf_extra_fields import fields as extra_fields


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture']

    profile_picture = extra_fields.Base64ImageField(required=True, represent_in_base64=False)