from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.auth_urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/projects/', include('apps.projects.urls')),
    path('api/requests/', include('apps.teamrequests.urls')),
    path('api/messages/', include('apps.chat.urls')),
    path('api/match/', include('apps.matching.urls')),
    path('api/hackathons/', include('apps.hackathons.urls')),
]
