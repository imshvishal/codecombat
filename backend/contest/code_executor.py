import tempfile
import threading
import time
from contextlib import suppress
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
    def __init__(self, lang, code, question=None, *args, **kwargs):
        self.language = lang
        self.code = code
        self.question = None if isinstance(question, (int,)) else question
        self.config = lang_configs[lang.lower()]
        self.timer = threading.Timer(3, self.__remove_container)
        self.status_msg = ""
        self.__output = b""

    def __enter__(self):
        self.__create_temp_code_file()
        self.container = client.containers.run(
            self.config.image,
            volumes={f"{self.temp_dir.name}": {"bind": "/mnt", "mode": "rw"}},
            detach=True,
            tty=True,
            working_dir="/mnt",
            user="nobody",
        )
        self.compile_status = self.__compile_code()
        return self

    def __exit__(self, exc, value, tb):
        self.close()

    def execute(self):
        self.timer.start()
        result = {}
        if (compile_status := self.compile_status) and compile_status.exit_code:
            self.__output = compile_status.output
            result["error"] = "Compile Error"
        else:
            test_check = self.__run_code()
            if test_check:
                result["testcases"] = test_check
                result["success"] = all(test_check.values())
        result["output"] = self.output
        result["message"] = self.status_msg
        return result

    def __compile_code(self):
        if cmd := self.config.compile_cmd:
            return self.container.exec_run(cmd)
        return None

    def __strip_multi_line(self, string):
        _output = map(lambda line: line.strip(), string.splitlines())
        return "\n".join([line for line in _output if line != ""])

    def __run_code(self):
        if not ((question := self.question) and question.testcases.all()):
            exit_code, self.__output = self.container.exec_run(self.config.run_cmd)
            print("X", self.output)
            return {}
        testcases = self.question.testcases.all()
        testcase_check = {}
        for i, testcase in enumerate(testcases):
            exit_code, socket = self.container.exec_run(
                self.config.run_cmd, socket=True, stdin=True, tty=True
            )
            _input = self.__strip_multi_line(testcase.input) + "\n"
            time.sleep(0.1)
            _output = ""
            with suppress(BaseException):
                socket.send(_input.encode())
                time.sleep(0.5)
            with suppress(BaseException):
                _output = self.__strip_multi_line(
                    socket.recv(10240)
                    .replace(_input.replace("\n", "\r\n").encode(), b"", 1)
                    .decode()
                )
            if self.__strip_multi_line(testcase.output.strip()) == _output:
                self.__output += b"Passed\n"
                testcase_check.update({i: True})
            else:
                testcase_check.update({i: False})
                self.__output += b"Failed\n"
        return testcase_check

    def __create_temp_code_file(self):
        self.temp_dir = tempfile.TemporaryDirectory(prefix="codecombat_")
        with open(
            self.temp_dir.name + "\submitted_code" + self.config.ext, "w+"
        ) as file:
            file.write(self.code)

    def __remove_container(self):
        self.status_msg = "Time Limit Exceeded"
        self.container.remove(force=True)

    def close(self):
        print("Close called")
        self.temp_dir.cleanup()

    @property
    def output(self):
        TOTAL_OUTPUT_CHARS = 4096
        output = self.__output.decode(errors="replace").strip()
        return output[:TOTAL_OUTPUT_CHARS] + (
            "......." if len(output) > TOTAL_OUTPUT_CHARS else ""
        )
