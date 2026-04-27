from django.urls import path
from .views import HackathonListCreateView

urlpatterns = [
    path('', HackathonListCreateView.as_view(), name='hackathon-list'),
]
