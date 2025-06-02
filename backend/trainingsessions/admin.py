from django.contrib import admin
from .models import Session


@admin.register(Session)
class TrainingSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "mentor", "student", "scheduled_at", "status")
    list_filter = ("status",)
    search_fields = ("title", "mentor__email", "student__email")
