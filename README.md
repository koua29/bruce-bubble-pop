# 🫧 Bubble Pop — Bruce / LilyGO T-Embed CC1101

[![Bruce firmware](https://img.shields.io/badge/firmware-Bruce-8A2BE2?logo=github)](https://github.com/BruceDevices/firmware) [![Device](https://img.shields.io/badge/device-LilyGO%20T--Embed%20CC1101-1E90FF)](https://github.com/BruceDevices/firmware) [![Language](https://img.shields.io/badge/script-JavaScript%20(BJS)-F7DF1E)](https://github.com/BruceDevices/firmware) [![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **EN** — A **Puzzle-Bobble / bust-a-move** for the Bruce JS interpreter, built around the rotary encoder. Laid out **sideways** to fit the landscape screen: the bubble wall is anchored on the **left**, the shooter sits on the **right**. Match 3+ same-colour bubbles to pop them, cut loose whole clusters, and hold back the creeping wall.

> **FR** — Un **Puzzle-Bobble / casse-bulles** pour l'interpréteur JS de Bruce, pensé pour la molette. Disposé **en paysage** pour l'écran : le mur de bulles est ancré à **gauche**, le canon est à **droite**. Aligne 3+ bulles de même couleur pour les faire éclater, détache des grappes entières, et repousse le mur qui avance.

![Bubble Pop gameplay](docs/hero.jpg)

## 🎮 Controls / Contrôles

**Rotate = aim up/down**, **click = fire the bubble**, **ESC = menu**. The dotted guide shows the shot bouncing off the top/bottom walls.

**Molette = viser (haut/bas)**, **clic = tirer la bulle**, **ESC = menu**. Le pointillé montre le tir qui rebondit sur les bords haut/bas.

## ✨ Features / Fonctions

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

## 🛒 Matériel / Hardware

Accessoires utiles pour ce projet — liens affiliés Amazon :

| [<img src="docs/amazon-B0D45MSMJR.jpg" width="200" alt="Anker 545 power bank (10 000 mAh)">](https://www.amazon.com/dp/B0D45MSMJR?linkCode=ll2&tag=koua29bbubblepop-20&ref_=as_li_ss_tl) | [<img src="docs/amazon-B0C1FCZM94.jpg" width="200" alt="433 MHz SMA antenna (2-pack)">](https://www.amazon.com/dp/B0C1FCZM94?linkCode=ll2&tag=koua29bbubblepop-20&ref_=as_li_ss_tl) | [<img src="docs/amazon-B0B7NVMBPL.jpg" width="200" alt="SanDisk 64 GB microSD (2-pack)">](https://www.amazon.com/dp/B0B7NVMBPL?linkCode=ll2&tag=koua29bbubblepop-20&ref_=as_li_ss_tl) |
|:---:|:---:|:---:|
| 🔋 **[Anker 545 power bank (10 000 mAh)](https://www.amazon.com/dp/B0D45MSMJR?linkCode=ll2&tag=koua29bbubblepop-20&ref_=as_li_ss_tl)**<br><sub>Pour faire tourner le T-Embed loin d'une prise</sub> | 📡 **[433 MHz SMA antenna (2-pack)](https://www.amazon.com/dp/B0C1FCZM94?linkCode=ll2&tag=koua29bbubblepop-20&ref_=as_li_ss_tl)**<br><sub>Antenne sub-GHz pour la radio CC1101</sub> | 💾 **[SanDisk 64 GB microSD (2-pack)](https://www.amazon.com/dp/B0B7NVMBPL?linkCode=ll2&tag=koua29bbubblepop-20&ref_=as_li_ss_tl)**<br><sub>Pour les thèmes, scripts et captures Bruce</sub> |

<sub>En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises. · As an Amazon Associate I earn from qualifying purchases.</sub>

## 🙏 Credits & License

- Script: **koua29**. Runs on the excellent **[Bruce firmware](https://github.com/BruceDevices/firmware)**.
- Released under the **MIT License** — see [LICENSE](LICENSE).

## ☕ Coffee?

<img src="docs/paypal-qr.png" width="170" alt="PayPal" />
