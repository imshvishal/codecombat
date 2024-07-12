# n = int(input())
strs = ["aaa", "hack", "zzz", "abcd", "szxp"]
data = set()

for string in strs:
    if "a" <= string[0] <= "m":
        data.add(string)
    else:
        msg = "".join(chr(219 - ord(i)) for i in string)
        data.add(msg)
    print(data)
