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

import asyncio
import time

from asgiref.sync import sync_to_async


async def inf():
    while True:
        print(1)


async def test():
    print(1)
    async with asyncio.timeout(2):
        print(2)
        await inf()
        # await sync_to_async(time.sleep, thread_sensitive=True)(2)
        print(3)
    print(4)


asyncio.run(test())
