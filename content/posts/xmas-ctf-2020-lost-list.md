---
title: "[CTF Writeup] X-MAS 2020 - Lost List"
date: 2020-12-19T22:25:00+09:00
tags:
  - ctf
  - crypto
---

**CTF**: [Xmas CTF 2020](https://xmas.htsp.ro/)  
**Challenge**: Lost List  
**Category**: Cryptography  
**Points**: 396  

```
Santa lost the key to his server where he keeps the lists of nice and naughty kids and the server started to malfunction. Luckily looking through the logs we found a capture file of his last connection to the server. He usually used this server only to write the lists, but we need to recover the lists so try and log into the server and read the lists. Santa counts on you, don't let him down!

Target: nc challs.xmas.htsp.ro 1002
Author: Heappie
```

Full code for my solution available [here.](https://gist.github.com/rynorris/e36530c9fe9854dd95798ddc1c959164)

Opening the associated pcap file in Wireshark and following the TCP stream, we find the following:

```
santa@northpole ~$ 53616e74612773313333374956343230ab0c288b0ae26eaf8adbcf00bddf35fa
key.py
main.py
naughty
nice

santa@northpole ~$ 
```

So looks like a relatively normal shell, except the commands being sent in are encrypted in some form.

That looks like hex, so let's see what's underneath:

```python
>>> import binascii
>>> binascii.unhexlify("53616e74612773313333374956343230ab0c288b0ae26eaf8adbcf00bddf35fa")
b"Santa's1337IV420\xab\x0c(\x8b\n\xe2n\xaf\x8a\xdb\xcf\x00\xbd\xdf5\xfa"
```

Aha, so seems like the command is encrypted using `Santa's1337IV420` as the intialization vector.  We make a guess here based on this that the encryption scheme is likely to be AES in CBC mode.

Doing a little research on the [Wikipedia page on block ciphers](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation), we learn that to decrypt a cipher in CBC mode, you take each block, run it through your cipher black box, and then XOR with the previous encrypted block.  Except the first block is XORed with the IV, since we don't have a previous block.

In other words: `P0 = E(C0) ^ IV`.

Since we fully control the IV (we saw previously it was sent as part of the command from Santa), if we know what the plaintext `P0` was, we could simply modify the IV to flip the bits we want in order to transform the decoded result into any plaintext we like!

Here's where we have to make some sensible guesses.

  1. Based on the pcap, we guess that the command being sent is `ls`.
  2. We guess they pad the block using [PKCS#5 padding](https://en.wikipedia.org/wiki/Padding_(cryptography)#PKCS#5_and_PKCS#7).

Therefore the plaintext block in the example should be (in hex) `6c 73 14 14 14 14 14 14 14 14 14 14 14 14 14 14`.

Now we decide which plaintext command we would like to send `P'`, and compute the new IV as `IV' = IV ^ P0 ^ P'`.
The server will then decrypt and compute `E(C0) ^ IV' = E(C0) ^ IV ^ P0 ^ P' = P0 ^ P0 ^ P' = P'`, and execute our command.

Note we never even needed to know what the AES encryption key was!
This is an example of a [Bit Flipping Attack](https://en.wikipedia.org/wiki/Bit-flipping_attack)

Then we can wrap this computation into a script to translate our inputs as we send them, and get a full shell on the remote host:

```
santa@northpole ~$ whoami
ctf

santa@northpole ~$ 
```

It works!  Let's see what's in these files then!

```
santa@northpole ~$ ls
key.py
main.py
naughty
nice

santa@northpole ~$ cat nice
Command not found
```

Ah.  Well that's unfortunate.  Given that `whoami` worked, we can assume that our attack is working correctly, and we guess that there's another layer of protection guarding against us running certain commands.

Luckily, after playing around for a while and getting just a little inventive, we find it not too difficult to bypass:

```
santa@northpole ~$ /bin/c?t nice
Alice
Bob
Galf
X-MAS{s33ms_1ik3_y0u_4r3_0n_7h3_1is7_700_h0_h0_h0}
```

