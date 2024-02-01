from contest.code_executor import CodeExecutor

x = CodeExecutor("python", "print('Helo')")

with x as y:
    d = x.execute()
    print(d)
