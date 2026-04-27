from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'college', 'branch', 'year', 'skills']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get('username', validated_data['email']),
            email=validated_data['email'],
            password=validated_data['password'],
            college=validated_data.get('college', ''),
            branch=validated_data.get('branch', ''),
            year=validated_data.get('year'),
            skills=validated_data.get('skills', []),
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        }


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'bio', 'college', 'branch', 'year', 'skills',
            'github_url', 'linkedin_url', 'portfolio_url',
            'is_available', 'is_staff', 'is_superuser', 'created_at',
        ]
        read_only_fields = ['id', 'email', 'is_staff', 'is_superuser', 'created_at']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 'first_name', 'last_name', 'bio',
            'college', 'branch', 'year', 'skills',
            'github_url', 'linkedin_url', 'portfolio_url', 'is_available',
        ]
