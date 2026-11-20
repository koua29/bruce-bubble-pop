# 🫧 Bubble Pop — Bruce / LilyGO T-Embed CC1101

<p align="center">🇺🇸 <b>English</b> · 🇫🇷 <a href="README.fr.md">Français</a></p>

[![Bruce firmware](https://img.shields.io/badge/firmware-Bruce-8A2BE2?logo=github)](https://github.com/BruceDevices/firmware) [![Device](https://img.shields.io/badge/device-LilyGO%20T--Embed%20CC1101-1E90FF)](https://github.com/BruceDevices/firmware) [![Language](https://img.shields.io/badge/script-JavaScript%20(BJS)-F7DF1E)](https://github.com/BruceDevices/firmware) [![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A **bubble shooter** for the Bruce JS interpreter, built around the rotary encoder. Laid out **sideways** to fit the landscape screen: the bubble wall is anchored on the **left**, the shooter sits on the **right**. Match 3+ same-colour bubbles to pop them, cut loose whole clusters, and hold back the creeping wall.

![Bubble Pop gameplay](docs/hero.jpg)

## 🎮 Controls

**Rotate = aim up/down**, **click = fire the bubble**, **ESC = menu**. The dotted guide shows the shot bouncing off the top/bottom walls.

## ✨ Features

- 🫧 **Hex bubble grid** — a real hexagonal wall. Shots snap into place; **match 3+** of a colour and they pop.
- ⛓️ **Cluster physics** — pop a chain and any bubbles no longer connected to the wall **fall off** for bonus points.
- ⏩ **Creeping wall** — every few shots a fresh column is pushed in from the left. Let it cross the red **danger line** on the right and it's game over.
- 🆙 **Levels** — more colours (4 → 6), a faster-advancing wall and a thicker starting wall each level. "LEVEL n" flash.
- 🎯 **Next-bubble preview** at the shooter, colours always drawn from what's still on the field (so it stays solvable).
- 🏆 **Persistent top-5 high scores** (`/bubblepop_scores.json`) with **3-initials** entry on a record.
- 🖥️ Flicker-free rendering, picto menu decorated with a bubble row.

| Menu |
|---|
| ![menu](docs/menu.jpg) |

## 🚀 Install

1. Copy **`Bubble Pop.js`** onto the SD card (e.g. `/scripts` or `/BruceJS`).
2. On the device: **JS Interpreter → select `Bubble Pop.js`** (or add it to your favorites with [bruce-launcher](https://github.com/koua29/bruce-launcher)).
3. High scores are stored in `/bubblepop_scores.json` on the SD.

## 🛒 Hardware

*Amazon affiliate links: if you buy through these links, the project earns a small commission at no extra cost to you.*

<table>
<tr>
<td align="center" width="33%">
  <a href="https://www.amazon.com/dp/B0D45MSMJR?linkCode=ll2&amp;tag=koua29bbubblepop-20&amp;ref_=as_li_ss_tl"><img src="docs/amazon-B0D45MSMJR.jpg" width="200" alt="Anker 545 power bank (10,000 mAh)"></a><br>
  <b><a href="https://www.amazon.com/dp/B0D45MSMJR?linkCode=ll2&amp;tag=koua29bbubblepop-20&amp;ref_=as_li_ss_tl">Anker 545 power bank (10,000 mAh)</a></b><br><sub>Keeps the T-Embed running away from an outlet</sub>
</td>
<td align="center" width="33%">
  <a href="https://www.amazon.com/dp/B0C1FCZM94?linkCode=ll2&amp;tag=koua29bbubblepop-20&amp;ref_=as_li_ss_tl"><img src="docs/amazon-B0C1FCZM94.jpg" width="200" alt="433 MHz SMA antenna (2-pack)"></a><br>
  <b><a href="https://www.amazon.com/dp/B0C1FCZM94?linkCode=ll2&amp;tag=koua29bbubblepop-20&amp;ref_=as_li_ss_tl">433 MHz SMA antenna (2-pack)</a></b><br><sub>Sub-GHz antenna for the CC1101 radio</sub>
</td>
<td align="center" width="33%">
  <a href="https://www.amazon.com/dp/B0B7NVMBPL?linkCode=ll2&amp;tag=koua29bbubblepop-20&amp;ref_=as_li_ss_tl"><img src="docs/amazon-B0B7NVMBPL.jpg" width="200" alt="SanDisk 64 GB microSD (2-pack)"></a><br>
  <b><a href="https://www.amazon.com/dp/B0B7NVMBPL?linkCode=ll2&amp;tag=koua29bbubblepop-20&amp;ref_=as_li_ss_tl">SanDisk 64 GB microSD (2-pack)</a></b><br><sub>For Bruce themes, scripts and captures</sub>
</td>
</tr>
</table>

<sub>As an Amazon Associate I earn from qualifying purchases.</sub>

## 🙏 Credits & License

- Script: **koua29**. Runs on the excellent **[Bruce firmware](https://github.com/BruceDevices/firmware)**.
- Released under the **MIT License** — see [LICENSE](LICENSE).

## ☕ Buy me a coffee

<img src="docs/paypal-qr.png" width="170" alt="PayPal" />
