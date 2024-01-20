import tempfile
import threading
from typing import NamedTuple

import docker

client = docker.from_env()


class LangConfig(NamedTuple):
    image: str
    ext: str
    compile_cmd: list[str]
    run_cmd: list[str]


lang_configs = {
    "python": LangConfig(
        "python:3.11.7-alpine3.18",
        ".py",
        [],
        ["python", "submitted_code.py"],
    ),
    "javascript": LangConfig(
        "node:20-alpine3.18",
        ".js",
        [],
        ["node", "submitted_code.js"],
    ),
    "cpp": LangConfig(
        "esolang/cpp-clang:latest",
        ".cpp",
        ["sh", "-c", "g++ submitted_code.cpp -o code.out"],
        ["./code.out"],
    ),
    "c": LangConfig(
        "esolang/cpp-clang:latest",
        ".c",
        ["sh", "-c", "gcc submitted_code.c -o code.out"],
        ["sh", "-c", "./code.out"],
    ),
    "java": LangConfig(
        "amazoncorretto:21-alpine3.18",
        ".java",
        ["sh", "-c", "javac submitted_code.java"],
        ["sh", "-c", "java Main"],
    ),
}


class CodeExecutor:
    def __init__(self, lang: str, code: str, question):
        self.language = lang
        self.code = code
        self.question = question
        self.config = lang_configs[lang.lower()]
        self.timer = threading.Timer(1.1, self.__remove_container)
        self.status_msg = ""

    def __enter__(self):
        self.__create_temp_code_file()
        self.container = client.containers.run(
            self.config.image,
            volumes={f"{self.temp_dir.name}": {"bind": "/mnt", "mode": "rw"}},
            detach=True,
            tty=True,
            working_dir="/mnt",
        )
        self.compile_status = self.__compile_code()
        return self

    def __exit__(self, exc, value, tb):
        self.temp_dir.cleanup()

    def execute(self):
        self.timer.start()
        if (compile_status := self.compile_status) and compile_status.exit_code:
            self.__output = compile_status.output
        else:
            self.__output = self.__run_code_with_testcase().output
        return self.output

    def __compile_code(self):
        if cmd := self.config.compile_cmd:
            return self.container.exec_run(cmd)
        return None

    def __run_code_with_testcase(self):
        output = self.container.exec_run(self.config.run_cmd)
        return output

    def __create_temp_code_file(self):
        self.temp_dir = tempfile.TemporaryDirectory(prefix="codecombat_")
        with open(
            self.temp_dir.name + "\submitted_code" + self.config.ext, "w+"
        ) as file:
            file.write(self.code)

    def __remove_container(self):
        self.status_msg = "Time Limit Exceeded"
        self.container.remove(force=True)

    @property
    def output(self):
        TOTAL_OUTPUT_CHARS = 4096
        output = self.__output.decode("utf-8", "replace").strip()
        return (
            output[:TOTAL_OUTPUT_CHARS]
            + ("......." if len(output) > TOTAL_OUTPUT_CHARS else ""),
            self.status_msg,
        )
