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

Due to the magic of [wasm-pack](https://github.com/rustwasm/wasm-pack) I was able to compile the emulator core to wasm extremely quickly (after just a little refactoring), and had a fully functional web-based emulator in under a day's work.

Here it is embedded below!  This should work in Chrome and Firefox, but not IE/Edge or Safari due to their lack of support for `BigUInt64Array`.


<figure>
    <canvas id="screen" width="512", height="480", style="background: black" tabIndex=0></canvas>
    <div>
        <label for="rom_selector">Choose a ROM to play (.nes file)</label>
        <input type="file" id="rom-selector" name="rom_selector" accept=".nes" onchange="selectRom(this.files)">
        <div>Controls: A = Start, S = Select, Z = A, X = B, Arrow Keys = D-Pad</div>
    </div>
    <script src="app.js"></script>
</figure>


