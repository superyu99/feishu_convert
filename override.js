name: '🧠 ChatGPT中继增强'
desc: 为 ChatGPT 策略组注入 OUTSTAND_RELAY + 定义 relay 架构
version: '2025.04.21'

proxies:
  - name: '🧦 Socks5 Config'
    type: socks5
    server: 45.195.244.191
    port: 7777
    username: linuxclash
    password: Linyu123

proxy-groups:
  - name: 'RELAY_ENTRY'
    type: select
    proxies:
      - '🇭🇰 香港 01'
      - '🇭🇰 香港 02'
      - '🇭🇰 香港 03'
      - '🇨🇳 台湾 01'
      - '🇨🇳 台湾 02'
      - '🇨🇳 台湾 03'
      - '🇸🇬 新加坡 01'
      - '🇸🇬 新加坡 02'
      - '🇸🇬 新加坡 03'
      - '🇯🇵 日本 01'
      - '🇯🇵 日本 02'
      - '🇯🇵 日本 03'
      - '🇺🇲 美国 01'
      - '🇺🇲 美国 02'
      - '🇺🇲 美国 03'

  - name: 'OUTSTAND_RELAY'
    type: relay
    proxies:
      - 'RELAY_ENTRY'
      - '🧦 Socks5 Config'

  - name: '🤖 ChatGPT'
    type: select
    proxies: #!replace
      - 'OUTSTAND_RELAY'
