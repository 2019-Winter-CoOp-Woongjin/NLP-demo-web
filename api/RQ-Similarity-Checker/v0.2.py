import sys
import time

print("Version: v0.2")

time.sleep(2)

print("Reference: " + sys.argv[1].split(" ")[0])

time.sleep(2)

print("Question: " + sys.argv[2].split(" ")[0])