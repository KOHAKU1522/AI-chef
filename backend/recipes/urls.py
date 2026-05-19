from django.urls import path
from . import views

urlpatterns = [
    path('generate-recipe/', views.GenerateRecipeView.as_view(), name='generate-recipe'),
]
