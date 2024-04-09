from django.urls import path

from .views import user_detail_view
from .views import user_redirect_view
from .views import user_update_view
from .api import api
from django.conf.urls.static import static

app_name = "users"
urlpatterns = [
    path("~redirect/", view=user_redirect_view, name="redirect"),
    path("~update/", view=user_update_view, name="update"),
    path("api/", api.urls),
    path("<str:username>/", view=user_detail_view, name="detail"),
]
