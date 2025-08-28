from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('veterinarian', 'Veterinarian'),
        ('assistant', 'Assistant'),
        ('receptionist', 'Receptionist'),
    ]
    
    THEME_CHOICES = [
        ('dark', 'Dark Theme'),
        ('light', 'Light Theme'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='receptionist')
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='dark')
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.get_role_display()})"
    
    def has_admin_access(self):
        return self.role == 'admin' or self.user.is_superuser
    
    def has_veterinarian_access(self):
        return self.role in ['admin', 'veterinarian'] or self.user.is_superuser
    
    def has_assistant_access(self):
        return self.role in ['admin', 'veterinarian', 'assistant'] or self.user.is_superuser
    
    def has_receptionist_access(self):
        return self.role in ['admin', 'veterinarian', 'assistant', 'receptionist'] or self.user.is_superuser

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()

# Create your models here.

class Utilisateur(models.Model):
    nom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mot_de_passe = models.CharField(max_length=128)
    role = models.CharField(max_length=50)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom

class Client(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)
    email = models.EmailField()

    def __str__(self):
        return f"{self.prenom} {self.nom}"

class Animal(models.Model):
    nom = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    race = models.CharField(max_length=50)
    age = models.PositiveIntegerField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='animaux')

    def __str__(self):
        return self.nom

class Reservation(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    date_reservation = models.DateTimeField()
    service = models.CharField(max_length=100)
    statut = models.CharField(max_length=50)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Reservation {self.id} - {self.client}"

class Categorie(models.Model):
    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom

class Fournisseur(models.Model):
    nom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)
    email = models.EmailField()
    adresse = models.CharField(max_length=255)

    def __str__(self):
        return self.nom

class Produit(models.Model):
    nom = models.CharField(max_length=100)
    categorie = models.ForeignKey(Categorie, on_delete=models.CASCADE)
    quantite = models.PositiveIntegerField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    date_ajout = models.DateField(auto_now_add=True)
    date_expiration = models.DateField()
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nom

class Log(models.Model):
    ACTION_CHOICES = [
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('auto_logout', 'Auto Logout'),
        ('create', 'Create Record'),
        ('update', 'Update Record'),
        ('delete', 'Delete Record'),
        ('view', 'View Record'),
        ('export', 'Export Data'),
        ('import', 'Import Data'),
        ('password_change', 'Password Change'),
        ('profile_update', 'Profile Update'),
        ('theme_change', 'Theme Change'),
        ('report_sent', 'Report Sent'),
        ('stock_alert', 'Stock Alert'),
        ('system', 'System Action'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField(default='')
    table_cible = models.CharField(max_length=100, blank=True, null=True)
    id_element = models.PositiveIntegerField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    date_action = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date_action']
    
    def __str__(self):
        user_name = self.user.get_full_name() if self.user else 'Anonymous'
        return f"{user_name} - {self.get_action_display()} - {self.date_action.strftime('%Y-%m-%d %H:%M')}"

class RapportEnvoye(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    sujet = models.CharField(max_length=255)
    message = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    destinataire = models.CharField(max_length=255)

    def __str__(self):
        return self.sujet
