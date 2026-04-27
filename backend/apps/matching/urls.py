from django.urls import path
from .views import MatchUsersForProjectView, MatchProjectsForUserView

urlpatterns = [
    path('project/<int:project_id>', MatchUsersForProjectView.as_view(), name='match-users-for-project'),
    path('users/me', MatchProjectsForUserView.as_view(), name='match-projects-for-user'),
]
