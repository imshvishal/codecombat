from rest_framework import permissions


class IsSameUser(permissions.BasePermission):
    def has_object_permission(self, request, view, user):
        if request.method not in permissions.SAFE_METHODS:
            return request.user == user
        return True
