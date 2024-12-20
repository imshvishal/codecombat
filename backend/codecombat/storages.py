import os
import re

import cloudinary
import cloudinary.uploader
import environ
import requests
from django.conf import settings
from django.core.files.storage import Storage

env = environ.Env()

cloudinary.config(
    cloud_name=env("CLOUDINARY_CLOUD_NAME"),
    api_key=env("CLOUDINARY_API_KEY"),
    api_secret=env("CLOUDINARY_API_SECRET"),
)


class CloudinaryFileStorage(Storage):
    def _get_prefix(self) -> str:
        return settings.MEDIA_ROOT

    def _normalise_path(self, path):
        if path != "" and not path.endswith("/"):
            path += "/"
        return path

    def _prepend_prefix(self, name):
        prefix = self._get_prefix().lstrip("/")
        prefix = self._normalise_path(prefix)
        if not name.startswith(prefix):
            name = prefix + name
        return name

    def _get_url(self, name):
        name = self._prepend_prefix(name)
        cloudinary_resource = cloudinary.CloudinaryResource(name)
        return cloudinary_resource.url

    def _upload(self, name, content):
        options = {
            "resource_type": "auto",
        }
        folder = os.path.dirname(name)
        if folder:
            options["folder"] = folder
        return cloudinary.uploader.upload(content, **options)

    def _save(self, name, content):
        name = self._normalise_name(name)
        name = self._prepend_prefix(name)
        response = self._upload(name, content)
        return response["public_id"]

    def url(self, name) -> str:
        return self._get_url(name)

    def delete(self, name):
        response = cloudinary.uploader.destroy(name, invalidate=True)
        return response.get("result") == "ok"

    def exists(self, name: str):
        url = self._get_url(name)
        res = requests.head(url)
        if res.status_code == 404:
            return False
        res.raise_for_status()
        return True

    def _normalise_name(self, name):
        return name.replace("\\", "/")
