#!/usr/bin/env python3
import cgi
import json
from datetime import datetime
timestamp = int(datetime.now().timestamp())
form = cgi.FieldStorage()
image = form.getvalue('file',None)
key = form.getvalue('key',None)
extension = form.getvalue('extension',"");
if extension: extension = "." + extension
if not image or not key: exit()
fname = f"photos/{key}@{timestamp}{extension}"
print("Content-type: text/plain\n")
open(fname,"wb").write(image);
print(key)
#return the name of the file

