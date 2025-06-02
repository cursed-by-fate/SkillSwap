from django.contrib import admin
from .models import CalendarEvent


@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "start_time", "end_time", "event_type")
    list_filter = ("event_type",)
    search_fields = ("user__email", "title")
