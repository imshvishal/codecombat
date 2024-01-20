# # import subprocess

# # data = subprocess.run(
# #     [
# #         "docker",
# #         "run",
# #         "-v",
# #         "C:/Users/Vishal/Desktop/codecombat/backend/temp_codes/userNone:/mnt",
# #         "--rm",
# #         "--name",
# #         "your_container",
# #         "0c2accfaa4a7",
# #         *["sh", "-c", "g++ /mnt/submitted_code.cpp -o /mnt/code.out;/mnt/code.out"],
# #     ],
# #     # text=True,
# #     timeout=2,
# #     capture_output=True,
# # )
# # print(data.stdout)

# py_code = """
# for i in range(5):
#     print("Hello")
# """

# cpp_code = """
# #include <stdio.h>

# int main(){
# for (int i=0;i<10;i++){
#         printf("Hii Laude");
#     }
# }
# """

# java_code = r"""
# class Main {
#     public static void main(String[] args){
#         System.out.println("Lauda lassan\nHello World");
#     }
# }
# """

# import requests as rq

# data = {
#     "lang": "java",
#     "question": 3,
#     "code": java_code,
#     "user": 1,
#     "attempt": 2,
#     "duration": "10:00",
# }

# data = rq.post("http://127.0.0.1:8000/api/submissions/", json=data)
# print(data.text)

# import docker

# # Assuming you have a Docker client instance
# client = docker.from_env()

# # Create and run a container
# container = client.containers.run("python:3.11.7-alpine3.18", detach=True, tty=True)

# # Execute a command in the running container
# command = "python -c 'while True:print(\"Hello World\")'"
# exec_result = container.exec_run(command, tty=True)
# print(dir(exec_result))
# # container.remove(force=True)
# # print(container.wait(timeout=2))
# print("E", exec_result.output.decode("utf-8").strip())
# # # Collect the logs from the initial TTY session
# # logs = container.logs()

# # # Print or process the logs as needed
# # print("L", logs.decode("utf-8").strip())

# # # Stop and remove the container
# # container.stop()
# # container.remove()


import tempfile

dir = tempfile.TemporaryDirectory(prefix="hmmVishal_")
print(f"XYZ {dir.name}")
with open(dir.name + "\submitted_code" + ".py", "w+") as file:
    file.write("print('Hello World')")
dir.cleanup()
