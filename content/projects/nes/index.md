---
title: "Nes"
date: 2019-03-02T18:06:11+09:00
description: an NES emulator written in Rust and compiled to wasm for the web
---

[nes](https://github.com/rynorris/nes) is a Nintendo Entertainment System (NES) emulator written in Rust.

Overview
--------

Late last year I got interested in emulator development, and decided to write an NES emulator (which seems to be a common starting point).

I decided to use Rust, since I'd previously played around with it a little, but never used it for a major project.  It also seemed like a good fit for an emulator due to the high performance requirements.

I also had a moonshot stretch goal of compiling the emulator to WebAssembly (wasm) and running it in the browser, which I knew would be possible with Rust.


Web Assembly
------------

Due to the magic of [wasm-pack]() I was able to compile the emulator core to wasm extremely quickly (after just a little refactoring), and had a fully functional web-based emulator in under a day's work.

Here it is embedded below!  (I think this only works on Chrome, haven't figured out why yet)

<canvas id="screen" width="512", height="480"></canvas>
<input type="file" id="rom-selector" onchange="selectRom(this.files)">
<script src="app.js"></script>


