from django.contrib import admin
from .models import Utilisateur, Client, Animal, Reservation, Categorie, Fournisseur, Produit, Log, RapportEnvoye

admin.site.register(Utilisateur)
admin.site.register(Client)
admin.site.register(Animal)
admin.site.register(Reservation)
admin.site.register(Categorie)
admin.site.register(Fournisseur)
admin.site.register(Produit)
admin.site.register(Log)
admin.site.register(RapportEnvoye)
