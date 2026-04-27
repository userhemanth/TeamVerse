from django.urls import path
from .views import MeView, UserDetailView, UserSearchView

urlpatterns = [
    path('me', MeView.as_view(), name='user-me'),
    path('search', UserSearchView.as_view(), name='user-search'),
    path('<int:pk>', UserDetailView.as_view(), name='user-detail'),
]
