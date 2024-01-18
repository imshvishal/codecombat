import asyncio
import tempfile
from typing import NamedTuple

import docker
from asgiref.sync import async_to_sync, sync_to_async

TEMP_CODE_FOLDER = "temp_codes"

client = docker.from_env()


class LangConfig(NamedTuple):
    image: str
    ext: str
    compile_cmd: list[str]
    run_cmd: list[str]


lang_configs = {
    "python": LangConfig(
        "python:3.11.7-alpine3.18", ".py", [], ["python", "submitted_code.py"]
    ),
    "javascript": LangConfig(
        "node:20-alpine3.18", ".js", [], ["node", "submitted_code.js"]
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
        ["./code.out"],
    ),
    "java": LangConfig(
        "amazoncorretto:21-alpine3.18",
        ".java",
        ["sh", "-c", "javac submitted_code.java"],
        ["java Main"],
    ),
}


class CodeExecutor:
    def __init__(self, lang: str, code: str):
        self.language = lang
        self.code = code
        self.config = lang_configs[lang.lower()]
        self.__output = b""
        self.__is_timedout = False

    def __create_temp_code_file(self, path):
        with open(path + "\submitted_code" + self.config.ext, "w+") as file:
            file.write(self.code)

    def execute(self, testcases=[]) -> str:
        with tempfile.TemporaryDirectory(prefix="codecombat_") as path:
            self.__create_temp_code_file(path)
            output = async_to_sync(self.__run_code_with_testcase)(path, testcases)
            # TODO: compare with testcases input and outputs
            return output

    async def __run_code_with_testcase(self, code_dir, testcases):
        self.container = client.containers.run(
            self.config.image,
            # command=["sh"],
            volumes={f"{code_dir}": {"bind": "/mnt", "mode": "rw"}},
            detach=True,
            tty=True,
            working_dir="/mnt",
        )
        if cmd := self.config.compile_cmd:
            self.container.exec_run(cmd)
        try:
            async with asyncio.timeout(1.1):
                exit_code, self.__output = await sync_to_async(
                    self.container.exec_run, thread_sensitive=True
                )(self.config.run_cmd)
        except TimeoutError as e:
            self.__output = b"Time Limit Exceeded"
        self.container.remove(force=True)
        return self.output

    @property
    def output(self):
        return self.__output.decode("utf-8").strip()


# class Main {public static void main(String[] args) {System.out.println(\"Hello, World!\");\n}}
# class Main {public static void main(String[] args) {System.out.println("Hello, World!");}}
# include <stdio.h>\n\nint main(){printf(\"Hello World\");}
