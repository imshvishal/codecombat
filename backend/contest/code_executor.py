import docker

from .models import Question

client = docker.from_env()

import shutil
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
    "cpp": LangConfig(
        "esolang/cpp-clang:latest",
        ".cpp",
        ["sh", "-c", "g++ /mnt/submitted_code.cpp -o /mnt/code.out;/mnt/code.out"],
    ),
    "c": LangConfig(
        "esolang/cpp-clang:latest",
        ".c",
        ["sh", "-c", "gcc /mnt/submitted_code.c -o /mnt/code.out;/mnt/code.out"],
    ),
    "java": LangConfig(
        "amazoncorretto:21-alpine3.18",
        ".java",
        ["sh", "-c", "javac /mnt/submitted_code.java;java -cp /mnt Main"],
    ),
}


class CodeExecutor:
    def __init__(self, request, question: Question, lang: str, code: str):
        self.user = request.user
        self.question = question
        self.language = lang
        self.code = code
        self.config = lang_configs[lang.lower()]

    def temp_volume(self):
        return settings.BASE_DIR / TEMP_CODE_FOLDER / f"user{self.user.id}"

    def __create_temp_code_file(self, path):
        path.mkdir(exist_ok=True, parents=True)
        with (path / ("submitted_code" + self.config.ext)).open("w+") as file:
            file.write(self.code)

    def test_submitted_code(self):
        path = self.temp_volume()
        self.__create_temp_code_file(path)
        container = client.containers.run(
            self.config.image,
            command=self.config.command,
            volumes={f"{path}": {"bind": "/mnt", "mode": "rw"}},
            detach=True,
        )
        container.wait()
        output = container.logs().decode("utf-8").strip()
        print(output)
        container.remove(force=True)
        shutil.rmtree(path)

        # TODO: compare with testcases input and outputs
        return 1


# class Main {public static void main(String[] args) {System.out.println(\"Hello, World!\");\n}}
# include <stdio.h>\n\nint main(){printf(\"Hello World\");}
