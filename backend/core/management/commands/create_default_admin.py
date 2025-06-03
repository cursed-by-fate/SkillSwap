from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Creates a default admin user if it doesn't exist"

    def handle(self, *args, **kwargs):
        User = get_user_model()
        email = "admin@example.com"
        password = "admin"

        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f"✅ Admin created: {email}"))
        else:
            self.stdout.write(f"ℹ️ Admin already exists: {email}")
