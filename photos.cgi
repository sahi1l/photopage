#!/usr/bin/env python3
import glob
import os
os.chdir("photos")
print("Content-type: text/plain\n")
photos = sorted(glob.glob("*"),reverse=True)
people = {}
for photo in photos:
    if "@" in photo:
        name = photo.split("@")[0]
    elif "." in photo:
        name = photo.split(".")[0]
    else: continue
    if name in people:
        os.rename(photo,f"DELETE/{photo}")
        #move to DELETE folder
        pass
    else:
        people[name] = photo
        

for line in people.values():
    print(line)

