---
title: "Deploy pe un VPS Linux în 30 de minute: ssh, systemd, nginx"
description: "Traseul minim pentru o aplicație în producție pe Ubuntu: acces cu cheie SSH, un user dedicat, un serviciu systemd și nginx în față."
pubDate: 2026-09-29
author: "Andrei Popescu"
tags: ["linux", "nginx", "systemd", "devops"]
---

Un VPS cu Ubuntu 24.04 costă câțiva euro pe lună și îți dă control complet asupra serverului. Iată traseul minim, fără panouri de administrare.

## 1. Acces și securitate de bază

Te conectezi cu `ssh root@IP` folosind o cheie, nu o parolă. Creezi un user dedicat aplicației, `app`, și pornești firewall-ul `ufw` cu doar trei porturi deschise: 22, 80 și 443.

## 2. Aplicația ca serviciu systemd

Un fișier `.service` descrie cum pornește aplicația: sub ce user rulează, din ce director și ce variabile de mediu primește. Cu `Restart=always` procesul revine singur după o cădere, iar logurile ajung în journald, unde le urmărești cu `journalctl -u app -f`.

## 3. nginx în față

Aplicația ascultă doar pe `127.0.0.1:3000`, iar nginx primește traficul public pe portul 80 și îl trimite mai departe, ca reverse proxy. Pentru un site static, ca acesta, nginx servește direct fișierele din `/var/www`, fără niciun proces Node.

## 4. Domeniu și HTTPS

Un record DNS de tip A către IP-ul serverului, apoi `certbot --nginx -d domeniu.ro`, și ai un certificat Let's Encrypt care se reînnoiește automat.

## 5. Redeploy

Un script care face build, sincronizează fișierele cu `rsync` și verifică răspunsul cu `curl`. Același rezultat la fiecare rulare, fără pași făcuți de mână.
