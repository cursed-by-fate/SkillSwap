from django.core.management.base import BaseCommand
from faker import Faker
import random

from django.utils import timezone
from datetime import timezone as dt_timezone, timedelta

from core.models import User
from skills.models import Skill, UserSkill
from chat.models import Chat, Message
from trainingsessions.models import Session
from usercalendar.models import CalendarEvent
from reviews.models import Review

fake = Faker()


class Command(BaseCommand):
    help = (
        "Генерация тестовых данных: пользователи, навыки, чаты, сессии, события, отзывы"
    )

    def handle(self, *args, **kwargs):
        self.stdout.write("🧪 Генерация тестовых данных...")

        # --- Навыки ---
        skills_list = ["Python", "Guitar", "Cooking", "Design", "Public Speaking"]
        skills = []

        for skill_name in skills_list:
            skill, created = Skill.objects.get_or_create(
                name=skill_name, defaults={"category": "General"}
            )
            skills.append(skill)
            if created:
                self.stdout.write(f"📘 Навык создан: {skill.name}")
            else:
                self.stdout.write(f"📘 Навык уже существует: {skill.name}")

        # --- Пользователи и UserSkill ---
        for _ in range(10):
            user = User.objects.create_user(
                email=fake.unique.email(),
                password="password123",
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                bio=fake.text(max_nb_chars=150),
                location=fake.city(),
            )
            self.stdout.write(f"👤 Пользователь создан: {user.email}")

            if len(skills) >= 2:
                teaching_skill = random.choice(skills)
                learning_skill = random.choice(
                    [s for s in skills if s != teaching_skill]
                )

                UserSkill.objects.create(
                    user=user,
                    skill=teaching_skill,
                    type="teaching",
                    level=random.choice(["beginner", "intermediate", "advanced"]),
                )
                UserSkill.objects.create(
                    user=user,
                    skill=learning_skill,
                    type="learning",
                    level=random.choice(["beginner", "intermediate", "advanced"]),
                )
                self.stdout.write(
                    f"📎 Навыки: учит={teaching_skill.name}, изучает={learning_skill.name}"
                )

        # --- Чаты и Сообщения ---
        self.stdout.write("💬 Генерация чатов и сообщений...")

        users = list(User.objects.all())

        for i in range(5):
            participants = random.sample(users, 2)
            chat = Chat.objects.create(
                participant1=participants[0],
                participant2=participants[1],
                last_message_at=timezone.now(),
            )
            self.stdout.write(
                f"💬 Чат создан между {participants[0].email} и {participants[1].email}"
            )

            for _ in range(random.randint(3, 5)):
                sender = random.choice(participants)
                message = Message.objects.create(
                    chat=chat,
                    sender=sender,
                    content=fake.sentence(),
                    message_type="text",
                    is_read=random.choice([True, False]),
                    metadata=None,
                    created_at=timezone.now(),
                )
                chat.last_message_at = message.created_at

            chat.save()
            self.stdout.write(f"📨 Сообщения добавлены в чат {chat.id}")

        # --- Сессии обучения ---
        self.stdout.write("🧑‍🏫 Генерация обучающих сессий...")

        user_skills = list(UserSkill.objects.all())

        for _ in range(7):
            mentor_skill = random.choice(
                [us for us in user_skills if us.type == "teaching"]
            )
            candidates = [
                us
                for us in user_skills
                if us.type == "learning"
                and us.skill == mentor_skill.skill
                and us.user != mentor_skill.user
            ]

            if not candidates:
                continue

            student_skill = random.choice(candidates)
            scheduled_at = fake.future_datetime(end_date="+10d", tzinfo=dt_timezone.utc)

            session = Session.objects.create(
                mentor=mentor_skill.user,
                student=student_skill.user,
                skill=mentor_skill.skill,
                title=f"Обучение по теме: {mentor_skill.skill.name}",
                description=fake.sentence(nb_words=10),
                scheduled_at=scheduled_at,
                duration=random.choice([30, 45, 60]),
                status=random.choice(["proposed", "confirmed", "completed"]),
                meeting_link="https://meet.jit.si/" + fake.uuid4(),
            )

            self.stdout.write(
                f"📚 Сессия: {session.title} ({session.status}) | {session.mentor.email} → {session.student.email}"
            )

        # --- События в календаре ---
        self.stdout.write("🗓️ Генерация событий календаря...")

        sessions = Session.objects.all()

        for session in sessions:
            if not session.scheduled_at or not session.duration:
                continue

            end_time = session.scheduled_at + timedelta(minutes=session.duration)

            CalendarEvent.objects.create(
                user=session.mentor,
                title=f"Сессия: {session.title}",
                description=f"Навык: {session.skill.name}",
                start_time=session.scheduled_at,
                end_time=end_time,
                event_type="session",
                related_session=session,
            )

            CalendarEvent.objects.create(
                user=session.student,
                title=f"Сессия: {session.title}",
                description=f"Навык: {session.skill.name}",
                start_time=session.scheduled_at,
                end_time=end_time,
                event_type="session",
                related_session=session,
            )

            self.stdout.write(
                f"📆 Событие добавлено для {session.mentor.email} и {session.student.email}"
            )

        # --- Отзывы для завершённых сессий ---
        self.stdout.write("⭐ Генерация отзывов...")

        completed_sessions = Session.objects.filter(status="completed")

        for session in completed_sessions:
            Review.objects.create(
                session=session,
                reviewer=session.mentor,
                reviewee=session.student,
                rating=random.randint(4, 5),
                comment=fake.sentence(nb_words=12),
            )
            Review.objects.create(
                session=session,
                reviewer=session.student,
                reviewee=session.mentor,
                rating=random.randint(4, 5),
                comment=fake.sentence(nb_words=10),
            )

            self.stdout.write(
                f"⭐ Отзывы созданы для сессии {session.title} ({session.mentor.email} ↔ {session.student.email})"
            )

        self.stdout.write(self.style.SUCCESS("✅ Все данные успешно сгенерированы."))
