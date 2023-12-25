from django.contrib import admin

from contest.models import Contest, Question, Submission, TestCase


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
    pass


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [TestCaseInline]


@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    pass


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    pass


# TODO: Fix Inlines
