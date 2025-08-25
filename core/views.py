from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse
from .models import Client, Animal, Reservation, Produit, Categorie, Fournisseur, Log, RapportEnvoye, UserProfile
from .decorators import admin_required, veterinarian_required, assistant_required, receptionist_required
from .utils import log_login, log_logout, log_create, log_update, log_delete, log_export, log_password_change, log_profile_update, log_theme_change, log_report_sent
from django.db import models
import csv
from django.http import HttpResponse

def root_redirect(request):
    return redirect('dashboard')

def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            # Log successful login
            log_login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid credentials')
    return render(request, 'core/login.html')

def logout_view(request):
    # Log logout before actually logging out
    if request.user.is_authenticated:
        log_logout(request, request.user)
    auth_logout(request)
    return redirect('login')

@login_required(login_url='login')
def settings_view(request):
    if request.method == 'POST':
        # Handle form submissions
        if 'update_profile' in request.POST:
            # Update user profile
            user = request.user
            user.first_name = request.POST.get('first_name', '')
            user.last_name = request.POST.get('last_name', '')
            user.email = request.POST.get('email', '')
            user.save()
            
            # Update user profile
            if hasattr(user, 'profile'):
                profile = user.profile
            else:
                profile = UserProfile.objects.create(user=user)
            
            profile.phone = request.POST.get('phone', '')
            profile.address = request.POST.get('address', '')
            profile.save()
            
            # Log profile update
            log_profile_update(request, user)
            
            messages.success(request, 'Profile updated successfully!')
            return redirect('settings')
        
        elif 'change_password' in request.POST:
            # Handle password change
            current_password = request.POST.get('current_password')
            new_password = request.POST.get('new_password')
            confirm_password = request.POST.get('confirm_password')
            
            if not request.user.check_password(current_password):
                messages.error(request, 'Current password is incorrect.')
            elif new_password != confirm_password:
                messages.error(request, 'New passwords do not match.')
            elif len(new_password) < 8:
                messages.error(request, 'Password must be at least 8 characters long.')
            else:
                request.user.set_password(new_password) 
                request.user.save()
                
                # Log password change
                log_password_change(request, request.user)
                
                messages.success(request, 'Password changed successfully! Please login again.')
                return redirect('login')
            
            return redirect('settings')
        
        elif 'change_theme' in request.POST:
            # Handle theme change
            theme = request.POST.get('theme', 'dark')
            if hasattr(request.user, 'profile'):
                profile = request.user.profile
            else:
                profile = UserProfile.objects.create(user=request.user)
            
            # Store theme preference in profile
            profile.theme = theme
            profile.save()
            
            # Log theme change
            log_theme_change(request, request.user, theme)
            
            messages.success(request, f'Theme changed to {theme.title()}!')
            return redirect('settings')
    
    # Get current theme from profile
    if hasattr(request.user, 'profile'):
        current_theme = request.user.profile.theme
    else:
        current_theme = 'dark'
    
    # Get user profile data
    user = request.user
    profile = getattr(user, 'profile', None)
    
    context = {
        'current_theme': current_theme,
        'user': user,
        'profile': profile,
    }
    
    return render(request, 'core/settings.html', context)

@login_required(login_url='login')
def dashboard(request):
    from django.utils import timezone
    from datetime import datetime, timedelta
    
    # Basic counts
    total_clients = Client.objects.count()
    total_animals = Animal.objects.count()
    total_reservations = Reservation.objects.count()
    total_products = Produit.objects.count()
    
    # Since Client model doesn't have date_creation, we'll use total clients for now
    # You can add this field later if needed
    new_clients_this_month = total_clients  # Placeholder - can be enhanced later
    
    # Calculate revenue from products (since reservations don't have price)
    total_revenue = sum(product.prix * product.quantite for product in Produit.objects.all())
    
    # Recent products for revenue calculation
    recent_products = Produit.objects.filter(
        date_ajout__gte=timezone.now().date() - timedelta(days=30)
    )
    monthly_revenue = sum(product.prix * product.quantite for product in recent_products)
    
    # Stock alerts
    stock_alerts = Produit.objects.filter(quantite__lte=5).order_by('quantite')[:5]
    
    # Upcoming appointments (today and tomorrow)
    today = timezone.now().date()
    tomorrow = today + timedelta(days=1)
    upcoming_appointments = Reservation.objects.filter(
        date_reservation__date__in=[today, tomorrow]
    ).order_by('date_reservation')[:5]
    
    # Team members (users with profiles)
    team_members = UserProfile.objects.select_related('user').all()[:5]
    
    # Recent logs (using date_action instead of date_creation)
    recent_logs = Log.objects.order_by('-date_action')[:3]
    
    # Show different data based on user role
    if hasattr(request.user, 'profile'):
        user_role = request.user.profile.role
    else:
        # Create profile if it doesn't exist
        UserProfile.objects.create(user=request.user)
        user_role = request.user.profile.role
    
    can_manage_users = user_role == 'admin' or request.user.is_superuser
    can_view_logs = user_role in ['admin', 'veterinarian'] or request.user.is_superuser
    can_view_reports = user_role in ['admin', 'veterinarian'] or request.user.is_superuser
    can_manage_stock = user_role in ['admin', 'veterinarian', 'assistant'] or request.user.is_superuser
    
    return render(request, 'core/dashboard.html', {
        'total_clients': total_clients,
        'total_animals': total_animals,
        'total_reservations': total_reservations,
        'total_products': total_products,
        'new_clients_this_month': new_clients_this_month,
        'total_revenue': total_revenue,
        'monthly_revenue': monthly_revenue,
        'stock_alerts': stock_alerts,
        'upcoming_appointments': upcoming_appointments,
        'team_members': team_members,
        'recent_logs': recent_logs,
        'can_manage_users': can_manage_users,
        'can_view_logs': can_view_logs,
        'can_view_reports': can_view_reports,
        'can_manage_stock': can_manage_stock,
        'user_role': user_role,
    })

@login_required(login_url='login')
def reservation(request):
    from django.shortcuts import get_object_or_404
    search_query = request.GET.get('search', '')
    qs = Reservation.objects.select_related('client', 'animal').all()
    if search_query:
        qs = qs.filter(
            models.Q(client__nom__icontains=search_query) |
            models.Q(client__prenom__icontains=search_query) |
            models.Q(animal__nom__icontains=search_query) |
            models.Q(service__icontains=search_query) |
            models.Q(statut__icontains=search_query)
        )
    clients = Client.objects.all()
    animals = Animal.objects.all()
    if request.method == 'POST':
        edit_id = request.POST.get('edit_id')
        client_id = request.POST.get('client')
        animal_id = request.POST.get('animal')
        date_reservation = request.POST.get('date_reservation')
        service = request.POST.get('service')
        statut = request.POST.get('statut')
        note = request.POST.get('note')
        if edit_id:
            reservation = get_object_or_404(Reservation, id=edit_id)
            reservation.client_id = client_id
            reservation.animal_id = animal_id
            reservation.date_reservation = date_reservation
            reservation.service = service
            reservation.statut = statut
            reservation.note = note
            reservation.save()
        else:
            if client_id and animal_id and date_reservation and service and statut:
                Reservation.objects.create(
                    client_id=client_id,
                    animal_id=animal_id,
                    date_reservation=date_reservation,
                    service=service,
                    statut=statut,
                    note=note
                )
        return redirect('reservation')
    elif request.method == 'GET' and 'delete' in request.GET:
        reservation = get_object_or_404(Reservation, id=request.GET.get('delete'))
        reservation.delete()
        return redirect('reservation')
    elif request.method == 'GET' and 'edit' in request.GET:
        all_reservations = qs
        reservation_to_edit = get_object_or_404(Reservation, id=request.GET.get('edit'))
        return render(request, 'core/reservation.html', {
            'reservations': all_reservations,
            'edit_reservation': reservation_to_edit,
            'clients': clients,
            'animals': animals,
            'search_query': search_query
        })
    all_reservations = qs
    return render(request, 'core/reservation.html', {
        'reservations': all_reservations,
        'clients': clients,
        'animals': animals,
        'search_query': search_query
    })

@assistant_required
def stock(request):
    from django.shortcuts import get_object_or_404
    search_query = request.GET.get('search', '')
    qs = Produit.objects.select_related('categorie', 'fournisseur').all()
    if search_query:
        qs = qs.filter(
            models.Q(nom__icontains=search_query) |
            models.Q(categorie__nom__icontains=search_query) |
            models.Q(fournisseur__nom__icontains=search_query)
        )
    categories = Categorie.objects.all()
    fournisseurs = Fournisseur.objects.all()
    produits = qs
    # Category CRUD
    if request.method == 'POST' and 'cat_form' in request.POST:
        cat_edit_id = request.POST.get('cat_edit_id')
        nom = request.POST.get('cat_nom')
        if cat_edit_id:
            cat = get_object_or_404(Categorie, id=cat_edit_id)
            cat.nom = nom
            cat.save()
        else:
            if nom:
                Categorie.objects.create(nom=nom)
        return redirect('stock')
    elif request.method == 'GET' and 'cat_delete' in request.GET:
        cat = get_object_or_404(Categorie, id=request.GET.get('cat_delete'))
        cat.delete()
        return redirect('stock')
    elif request.method == 'GET' and 'cat_edit' in request.GET:
        all_produits = qs
        cat_to_edit = get_object_or_404(Categorie, id=request.GET.get('cat_edit'))
        return render(request, 'core/stock.html', {
            'produits': all_produits,
            'cat_to_edit': cat_to_edit,
            'categories': categories,
            'fournisseurs': fournisseurs,
            'search_query': search_query
        })
    # Supplier CRUD
    if request.method == 'POST' and 'fourn_form' in request.POST:
        fourn_edit_id = request.POST.get('fourn_edit_id')
        nom = request.POST.get('fourn_nom')
        telephone = request.POST.get('fourn_telephone')
        email = request.POST.get('fourn_email')
        adresse = request.POST.get('fourn_adresse')
        if fourn_edit_id:
            fourn = get_object_or_404(Fournisseur, id=fourn_edit_id)
            fourn.nom = nom
            fourn.telephone = telephone
            fourn.email = email
            fourn.adresse = adresse
            fourn.save()
        else:
            if nom and telephone and email and adresse:
                Fournisseur.objects.create(nom=nom, telephone=telephone, email=email, adresse=adresse)
        return redirect('stock')
    elif request.method == 'GET' and 'fourn_delete' in request.GET:
        fourn = get_object_or_404(Fournisseur, id=request.GET.get('fourn_delete'))
        fourn.delete()
        return redirect('stock')
    elif request.method == 'GET' and 'fourn_edit' in request.GET:
        all_produits = qs
        fourn_to_edit = get_object_or_404(Fournisseur, id=request.GET.get('fourn_edit'))
        return render(request, 'core/stock.html', {
            'produits': all_produits,
            'fourn_to_edit': fourn_to_edit,
            'categories': categories,
            'fournisseurs': fournisseurs,
            'search_query': search_query
        })
    # Product CRUD (already implemented)
    if request.method == 'POST' and 'prod_form' in request.POST:
        edit_id = request.POST.get('edit_id')
        nom = request.POST.get('nom')
        quantite = request.POST.get('quantite')
        prix = request.POST.get('prix')
        date_expiration = request.POST.get('date_expiration')
        categorie_id = request.POST.get('categorie')
        fournisseur_id = request.POST.get('fournisseur')
        if edit_id:
            produit = get_object_or_404(Produit, id=edit_id)
            produit.nom = nom
            produit.quantite = quantite
            produit.prix = prix
            produit.date_expiration = date_expiration
            produit.categorie_id = categorie_id
            produit.fournisseur_id = fournisseur_id
            produit.save()
        else:
            if nom and quantite and prix and date_expiration and categorie_id and fournisseur_id:
                Produit.objects.create(
                    nom=nom,
                    quantite=quantite,
                    prix=prix,
                    date_expiration=date_expiration,
                    categorie_id=categorie_id,
                    fournisseur_id=fournisseur_id
                )
        return redirect('stock')
    elif request.method == 'GET' and 'delete' in request.GET:
        produit = get_object_or_404(Produit, id=request.GET.get('delete'))
        produit.delete()
        return redirect('stock')
    elif request.method == 'GET' and 'edit' in request.GET:
        produit_to_edit = get_object_or_404(Produit, id=request.GET.get('edit'))
        return render(request, 'core/stock.html', {
            'produits': produits,
            'categories': categories,
            'fournisseurs': fournisseurs,
            'edit_produit': produit_to_edit,
            'search_query': search_query
        })
    return render(request, 'core/stock.html', {
        'produits': produits,
        'categories': categories,
        'fournisseurs': fournisseurs,
        'search_query': search_query
    })

@veterinarian_required
def logs(request):
    search_query = request.GET.get('search', '')
    qs = Log.objects.select_related('user').all()
    if search_query:
        qs = qs.filter(
            models.Q(user__username__icontains=search_query) |
            models.Q(user__first_name__icontains=search_query) |
            models.Q(user__last_name__icontains=search_query) |
            models.Q(action__icontains=search_query) |
            models.Q(description__icontains=search_query) |
            models.Q(table_cible__icontains=search_query)
        )
    
    # Get logs with pagination (show latest 100 logs by default)
    logs = qs[:100]
    
    return render(request, 'core/logs.html', {
        'logs': logs,
        'search_query': search_query
    })

@login_required(login_url='login')
def clients(request):
    from django.shortcuts import get_object_or_404
    search_query = request.GET.get('search', '')
    qs = Client.objects.all()
    if search_query:
        qs = qs.filter(
            models.Q(nom__icontains=search_query) |
            models.Q(prenom__icontains=search_query) |
            models.Q(telephone__icontains=search_query) |
            models.Q(email__icontains=search_query)
        )
    if request.method == 'POST':
        edit_id = request.POST.get('edit_id')
        if edit_id:
            client = get_object_or_404(Client, id=edit_id)
            client.prenom = request.POST.get('prenom')
            client.nom = request.POST.get('nom')
            client.telephone = request.POST.get('telephone')
            client.email = request.POST.get('email')
            client.save()
            
            # Log client update
            log_update(request, 'Client', client.id, f"Client: {client.prenom} {client.nom}")
        else:
            prenom = request.POST.get('prenom')
            nom = request.POST.get('nom')
            telephone = request.POST.get('telephone')
            email = request.POST.get('email')
            if prenom and nom and telephone and email:
                client = Client.objects.create(prenom=prenom, nom=nom, telephone=telephone, email=email)
                
                # Log client creation
                log_create(request, 'Client', client.id, f"Client: {client.prenom} {client.nom}")
        return redirect('clients')
    elif request.method == 'GET' and 'delete' in request.GET:
        client = get_object_or_404(Client, id=request.GET.get('delete'))
        client_name = f"{client.prenom} {client.nom}"
        client.delete()
        
        # Log client deletion
        log_delete(request, 'Client', client.id, f"Client: {client_name}")
        return redirect('clients')
    elif request.method == 'GET' and 'edit' in request.GET:
        all_clients = qs
        client_to_edit = get_object_or_404(Client, id=request.GET.get('edit'))
        return render(request, 'core/clients.html', {'clients': all_clients, 'edit_client': client_to_edit, 'search_query': search_query})
    all_clients = qs
    return render(request, 'core/clients.html', {'clients': all_clients, 'search_query': search_query})

@veterinarian_required
def report(request):
    from django.shortcuts import get_object_or_404
    search_query = request.GET.get('search', '')
    qs = RapportEnvoye.objects.select_related('user').all()
    if search_query:
        qs = qs.filter(
            models.Q(user__username__icontains=search_query) |
            models.Q(user__first_name__icontains=search_query) |
            models.Q(user__last_name__icontains=search_query) |
            models.Q(sujet__icontains=search_query) |
            models.Q(destinataire__icontains=search_query)
        )
    users = User.objects.all()
    if request.method == 'POST':
        edit_id = request.POST.get('edit_id')
        user_id = request.POST.get('user')
        sujet = request.POST.get('sujet')
        message = request.POST.get('message')
        date_envoi = request.POST.get('date_envoi')
        destinataire = request.POST.get('destinataire')
        if edit_id:
            rapport = get_object_or_404(RapportEnvoye, id=edit_id)
            rapport.user_id = user_id
            rapport.sujet = sujet
            rapport.message = message
            rapport.date_envoi = date_envoi
            rapport.destinataire = destinataire
            rapport.save()
            
            # Log report update
            log_update(request, 'RapportEnvoye', rapport.id, f"Report: {sujet}")
        else:
            if user_id and sujet and message and date_envoi and destinataire:
                rapport = RapportEnvoye.objects.create(user_id=user_id, sujet=sujet, message=message, date_envoi=date_envoi, destinataire=destinataire)
                
                # Log report creation and sending
                log_create(request, 'RapportEnvoye', rapport.id, f"Report: {sujet}")
                log_report_sent(request, rapport.user, sujet, destinataire)
        return redirect('report')
    elif request.method == 'GET' and 'delete' in request.GET:
        rapport = get_object_or_404(RapportEnvoye, id=request.GET.get('delete'))
        rapport_sujet = rapport.sujet
        rapport.delete()
        
        # Log report deletion
        log_delete(request, 'RapportEnvoye', rapport.id, f"Report: {rapport_sujet}")
        return redirect('report')
    elif request.method == 'GET' and 'edit' in request.GET:
        all_reports = qs
        report_to_edit = get_object_or_404(RapportEnvoye, id=request.GET.get('edit'))
        return render(request, 'core/report.html', {
            'reports': all_reports,
            'edit_report': report_to_edit,
            'users': users,
            'search_query': search_query
        })
    all_reports = qs
    return render(request, 'core/report.html', {
        'reports': all_reports,
        'users': users,
        'search_query': search_query
    })

@login_required(login_url='login')
def animals(request):
    from django.shortcuts import get_object_or_404
    search_query = request.GET.get('search', '')
    qs = Animal.objects.select_related('client').all()
    if search_query:
        qs = qs.filter(
            models.Q(nom__icontains=search_query) |
            models.Q(type__icontains=search_query) |
            models.Q(race__icontains=search_query) |
            models.Q(client__nom__icontains=search_query) |
            models.Q(client__prenom__icontains=search_query)
        )
    clients = Client.objects.all()
    if request.method == 'POST':
        edit_id = request.POST.get('edit_id')
        nom = request.POST.get('nom')
        type_ = request.POST.get('type')
        race = request.POST.get('race')
        age = request.POST.get('age')
        client_id = request.POST.get('client')
        if edit_id:
            animal = get_object_or_404(Animal, id=edit_id)
            animal.nom = nom
            animal.type = type_
            animal.race = race
            animal.age = age
            animal.client_id = client_id
            animal.save()
            
            # Log animal update
            log_update(request, 'Animal', animal.id, f"Animal: {animal.nom}")
        else:
            if nom and type_ and race and age and client_id:
                animal = Animal.objects.create(nom=nom, type=type_, race=race, age=age, client_id=client_id)
                
                # Log animal creation
                log_create(request, 'Animal', animal.id, f"Animal: {animal.nom}")
        return redirect('animals')
    elif request.method == 'GET' and 'delete' in request.GET:
        animal = get_object_or_404(Animal, id=request.GET.get('delete'))
        animal_name = animal.nom
        animal.delete()
        
        # Log animal deletion
        log_delete(request, 'Animal', animal.id, f"Animal: {animal_name}")
        return redirect('animals')
    elif request.method == 'GET' and 'edit' in request.GET:
        all_animals = qs
        animal_to_edit = get_object_or_404(Animal, id=request.GET.get('edit'))
        return render(request, 'core/animals.html', {
            'animals': all_animals,
            'edit_animal': animal_to_edit,
            'clients': clients,
            'search_query': search_query
        })
    all_animals = qs
    return render(request, 'core/animals.html', {
        'animals': all_animals,
        'clients': clients,
        'search_query': search_query
    })

@login_required(login_url='login')
def export_clients_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="clients.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['First Name', 'Last Name', 'Phone', 'Email'])
    
    search_query = request.GET.get('search', '')
    qs = Client.objects.all()
    if search_query:
        qs = qs.filter(
            models.Q(nom__icontains=search_query) |
            models.Q(prenom__icontains=search_query) |
            models.Q(telephone__icontains=search_query) |
            models.Q(email__icontains=search_query)
        )
    
    for client in qs:
        writer.writerow([client.prenom, client.nom, client.telephone, client.email])
    
    # Log export activity
    log_export(request, 'Client', 'CSV')
    
    return response

@login_required(login_url='login')
def export_animals_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="animals.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Name', 'Type', 'Breed', 'Age', 'Client'])
    
    search_query = request.GET.get('search', '')
    qs = Animal.objects.select_related('client').all()
    if search_query:
        qs = qs.filter(
            models.Q(nom__icontains=search_query) |
            models.Q(type__icontains=search_query) |
            models.Q(race__icontains=search_query) |
            models.Q(client__nom__icontains=search_query) |
            models.Q(client__prenom__icontains=search_query)
        )
    
    for animal in qs:
        writer.writerow([animal.nom, animal.type, animal.race, animal.age, f"{animal.client.prenom} {animal.client.nom}"])
    
    # Log export activity
    log_export(request, 'Animal', 'CSV')
    
    return response

@login_required(login_url='login')
def export_reservations_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="reservations.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Client', 'Animal', 'Date', 'Service', 'Status', 'Note'])
    
    search_query = request.GET.get('search', '')
    qs = Reservation.objects.select_related('client', 'animal').all()
    if search_query:
        qs = qs.filter(
            models.Q(client__nom__icontains=search_query) |
            models.Q(client__prenom__icontains=search_query) |
            models.Q(animal__nom__icontains=search_query) |
            models.Q(service__icontains=search_query) |
            models.Q(statut__icontains=search_query)
        )
    
    for reservation in qs:
        writer.writerow([
            f"{reservation.client.prenom} {reservation.client.nom}",
            reservation.animal.nom,
            reservation.date_reservation.strftime('%Y-%m-%d %H:%M'),
            reservation.service,
            reservation.statut,
            reservation.note
        ])
    
    # Log export activity
    log_export(request, 'Reservation', 'CSV')
    
    return response

@login_required(login_url='login')
def export_products_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="products.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Name', 'Category', 'Quantity', 'Price', 'Expiration', 'Supplier'])
    
    search_query = request.GET.get('search', '')
    qs = Produit.objects.select_related('categorie', 'fournisseur').all()
    if search_query:
        qs = qs.filter(
            models.Q(nom__icontains=search_query) |
            models.Q(categorie__nom__icontains=search_query) |
            models.Q(fournisseur__nom__icontains=search_query)
        )
    
    for produit in qs:
        writer.writerow([
            produit.nom,
            produit.categorie.nom,
            produit.quantite,
            produit.prix,
            produit.date_expiration.strftime('%Y-%m-%d'),
            produit.fournisseur.nom
        ])
    
    # Log export activity
    log_export(request, 'Produit', 'CSV')
    
    return response

@login_required(login_url='login')
def export_logs_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="logs.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['User', 'Action', 'Description', 'Date', 'Table', 'Element ID', 'IP Address'])
    
    search_query = request.GET.get('search', '')
    qs = Log.objects.select_related('user').all()
    if search_query:
        qs = qs.filter(
            models.Q(user__username__icontains=search_query) |
            models.Q(user__first_name__icontains=search_query) |
            models.Q(user__last_name__icontains=search_query) |
            models.Q(action__icontains=search_query) |
            models.Q(description__icontains=search_query) |
            models.Q(table_cible__icontains=search_query)
        )
    
    for log in qs:
        user_name = log.user.get_full_name() if log.user else 'Anonymous'
        writer.writerow([
            user_name,
            log.get_action_display(),
            log.description,
            log.date_action.strftime('%Y-%m-%d %H:%M'),
            log.table_cible or '',
            log.id_element or '',
            log.ip_address or ''
        ])
    
    # Log export activity
    log_export(request, 'Log', 'CSV')
    
    return response

@login_required(login_url='login')
def export_reports_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="reports.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['User', 'Subject', 'Message', 'Date', 'Recipient'])
    
    search_query = request.GET.get('search', '')
    qs = RapportEnvoye.objects.select_related('user').all()
    if search_query:
        qs = qs.filter(
            models.Q(user__username__icontains=search_query) |
            models.Q(user__first_name__icontains=search_query) |
            models.Q(user__last_name__icontains=search_query) |
            models.Q(sujet__icontains=search_query) |
            models.Q(destinataire__icontains=search_query)
        )
    
    for report in qs:
        user_name = report.user.get_full_name() or report.user.username
        writer.writerow([
            user_name,
            report.sujet,
            report.message,
            report.date_envoi.strftime('%Y-%m-%d %H:%M'),
            report.destinataire
        ])
    
    # Log export activity
    log_export(request, 'RapportEnvoye', 'CSV')
    
    return response

# User Management Views
@admin_required
def users(request):
    search_query = request.GET.get('search', '')
    qs = User.objects.all()
    if search_query:
        qs = qs.filter(
            models.Q(username__icontains=search_query) |
            models.Q(first_name__icontains=search_query) |
            models.Q(last_name__icontains=search_query) |
            models.Q(email__icontains=search_query) |
            models.Q(profile__role__icontains=search_query)
        )
    
    if request.method == 'POST':
        edit_id = request.POST.get('edit_id')
        if edit_id:
            user = get_object_or_404(User, id=edit_id)
            user.username = request.POST.get('username')
            user.first_name = request.POST.get('first_name')
            user.last_name = request.POST.get('last_name')
            user.email = request.POST.get('email')
            user.is_active = request.POST.get('is_active') == 'on'
            
            # Handle password change
            password = request.POST.get('password')
            if password:
                user.set_password(password)
            
            user.save()
            
            # Update profile
            if hasattr(user, 'profile'):
                user.profile.role = request.POST.get('role')
                user.profile.phone = request.POST.get('phone')
                user.profile.address = request.POST.get('address')
                user.profile.save()
            else:
                UserProfile.objects.create(
                    user=user,
                    role=request.POST.get('role'),
                    phone=request.POST.get('phone'),
                    address=request.POST.get('address')
                )
            
            messages.success(request, 'User updated successfully!')
        else:
            username = request.POST.get('username')
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')
            email = request.POST.get('email')
            role = request.POST.get('role')
            phone = request.POST.get('phone')
            address = request.POST.get('address')
            password = request.POST.get('password')
            
            if username and email and password and role:
                try:
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        password=password,
                        first_name=first_name,
                        last_name=last_name
                    )
                    
                    # Create profile
                    UserProfile.objects.create(
                        user=user,
                        role=role,
                        phone=phone,
                        address=address
                    )
                    
                    messages.success(request, 'User created successfully!')
                except Exception as e:
                    messages.error(request, f'Error creating user: {str(e)}')
            else:
                messages.error(request, 'Please fill all required fields.')
        
        return redirect('users')
    
    elif request.method == 'GET' and 'delete' in request.GET:
        user_id = request.GET.get('delete')
        if user_id != str(request.user.id):  # Prevent self-deletion
            user = get_object_or_404(User, id=user_id)
            user.delete()
            messages.success(request, 'User deleted successfully!')
        else:
            messages.error(request, 'You cannot delete your own account!')
        return redirect('users')
    
    elif request.method == 'GET' and 'edit' in request.GET:
        user_to_edit = get_object_or_404(User, id=request.GET.get('edit'))
        return render(request, 'core/users.html', {
            'users': qs,
            'edit_user': user_to_edit,
            'search_query': search_query,
            'role_choices': UserProfile.ROLE_CHOICES
        })
    
    return render(request, 'core/users.html', {
        'users': qs,
        'search_query': search_query,
        'role_choices': UserProfile.ROLE_CHOICES
    })

@admin_required
def export_users_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="users.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Username', 'First Name', 'Last Name', 'Email', 'Role', 'Phone','password'])
    
    search_query = request.GET.get('search', '')
    qs = User.objects.all()
    if search_query:
        qs = qs.filter(
            models.Q(username__icontains=search_query) |
            models.Q(first_name__icontains=search_query) |
            models.Q(last_name__icontains=search_query) |
            models.Q(email__icontains=search_query) |
            models.Q(profile__role__icontains=search_query)
        )
    
    for user in qs:
        role = user.profile.get_role_display() if hasattr(user, 'profile') else 'No Role'
        phone = user.profile.phone if hasattr(user, 'profile') else ''
        first_name = user.first_name if hasattr(user, 'first_name') else ''
        last_name = user.last_name if hasattr(user, 'last_name') else ''
        password = user.password if hasattr(user, 'password') else ''
        username=user.username if hasattr(user, 'username') else ''
        email=user.email if hasattr(user, 'email') else ''
        writer.writerow([
            username,
            first_name,
            last_name,
            email,
            role,
            phone,
            password,
        ])
    
    return response
def facture(request):
    return render(request, 'core/facture.html')

def all_appointments(request):
    """
    This view returns all reservations in the JSON format required by FullCalendar.
    """
    all_reservations = Reservation.objects.all()
    # Format the data into a list of event objects
    event_list = []
    for reservation in all_reservations:
        event_list.append({
            'id': reservation.id,
            'title': f"{reservation.service} - {reservation.animal.nom}",
            'start': reservation.date_reservation.strftime('%Y-%m-%dT%H:%M:%S'),
            'color': '#F39C12'  # Default color for scheduled or pending
        })
        
    return JsonResponse(event_list, safe=False)