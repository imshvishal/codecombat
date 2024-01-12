import docker

from .models import Question

client = docker.from_env()

from typing import NamedTuple

from django.conf import settings

TEMP_CODE_FOLDER = "temp_codes"


class LangConfig(NamedTuple):
    image: str
    ext: str
    command: list[str]


lang_configs = {
    "python": LangConfig(
        "python:3.11.7-alpine3.18", ".py", ["python", "/mnt/submitted_code.py"]
    ),
    "javascript": LangConfig(
        "node:20-alpine3.18", ".js", ["node", "/mnt/submitted_code.js"]
    ),
    "java": LangConfig("", ".java", []),
    "c": LangConfig("", ".c", []),
    "cpp": LangConfig("", ".cpp", []),
}


class CodeExecutor:
    def __init__(self, request, question: Question, lang: str, code: str):
        self.user = request.user
        self.question = question
        self.language = lang
        self.code = code
        self.config = lang_configs[lang.lower()]

        #  docker run -v ./xyz:/mnt c1f619b6477e36a0b6a2531a972e918ef32bbf0217ee9b536409361261db6df0

    def temp_volume(self):
        return settings.BASE_DIR / TEMP_CODE_FOLDER / f"user{self.user.id}"

    def __create_temp_code_file(self, path):
        path.mkdir(exist_ok=True, parents=True)
        code_file = str(path) + f"\\submitted_code" + self.config.ext
        with open(code_file, "w+") as file:
            file.write(self.code)
        return code_file

    def test_submitted_code(self):
        path = self.temp_volume()
        self.__create_temp_code_file(path)
        container = client.containers.run(
            self.config.image,
            command=self.config.command,
            volumes={f"{path}": {"bind": "/mnt", "mode": "ro"}},
            detach=True,
        )
        container.wait()
        output = container.logs().decode("utf-8").strip()
        container.remove(force=True)
        # TODO: compare with testcases input and outputs
        return 1
