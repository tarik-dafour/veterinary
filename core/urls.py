from django.urls import path
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    path('', RedirectView.as_view(url='/dashboard/', permanent=True)),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('reservation/', views.reservation, name='reservation'),
    path('stock/', views.stock, name='stock'),
    path('logs/', views.logs, name='logs'),
    path('clients/', views.clients, name='clients'),
    path('animals/', views.animals, name='animals'),
    path('facture/', views.facture, name='facture'),
    path('report/', views.report, name='report'),
    path('settings/', views.settings_view, name='settings'),
    # Export URLs
    path('export/clients/csv/', views.export_clients_csv, name='export_clients_csv'),
    path('export/animals/csv/', views.export_animals_csv, name='export_animals_csv'),
    path('export/reservations/csv/', views.export_reservations_csv, name='export_reservations_csv'),
    path('export/products/csv/', views.export_products_csv, name='export_products_csv'),
    path('export/logs/csv/', views.export_logs_csv, name='export_logs_csv'),
    path('export/reports/csv/', views.export_reports_csv, name='export_reports_csv'),
    # User Management URLs
    path('users/', views.users, name='users'),
    path('export/users/csv/', views.export_users_csv, name='export_users_csv'),
    # All appointments API
    path('api/all_appointments/', views.all_appointments, name='all_appointments'),
]