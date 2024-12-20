from django.contrib import admin

from contests.models import AttemptStatus, Contest, Question, Submission, TestCase


class TestCaseInline(admin.TabularInline):
    model = TestCase
    extra = 1


class QuestionInline(admin.StackedInline):
    model = Question
    inlines = [TestCaseInline]
    extra = 1


# Register your models here.
@admin.register(Contest)
class ContestAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]
    list_display = ("id", "__str__", "organizer")
    list_display_links = ("id", "__str__")


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display_links = ("id", "__str__")
    list_display = ("id", "__str__")
    inlines = [TestCaseInline]


@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    list_display = ("id", "__str__")
    list_display_links = ("id", "__str__")


from django.contrib import messages


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "__str__", "success", "user")
    list_display_links = ("id", "__str__")


@admin.register(AttemptStatus)
class AttemptStatusAdmin(admin.ModelAdmin):
    pass
