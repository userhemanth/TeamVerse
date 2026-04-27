from django.urls import path
from .views import SendRequestView, ReceivedRequestsView, SentRequestsView, AcceptRequestView, RejectRequestView

urlpatterns = [
    path('', SendRequestView.as_view(), name='send-request'),
    path('received', ReceivedRequestsView.as_view(), name='received-requests'),
    path('sent', SentRequestsView.as_view(), name='sent-requests'),
    path('<int:pk>/accept', AcceptRequestView.as_view(), name='accept-request'),
    path('<int:pk>/reject', RejectRequestView.as_view(), name='reject-request'),
]
